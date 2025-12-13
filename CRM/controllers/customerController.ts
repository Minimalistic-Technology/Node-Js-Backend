import { Request, Response } from "express";
import mongoose from "mongoose";
import { Customer } from "../models/customer";
import { success, error as apiError } from "../utils/apiResponse";
import { parsePagination, buildSort } from "../utils/pagination";
import { auditLog } from "../utils/logger";

export async function listCustomers(req: Request, res: Response) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const sort = buildSort((req.query.sortBy as string) || "createdAt", req.query.order as string);

    const filter: any = {};

    if (req.query.filter) {
      const f = req.query.filter as any;
      Object.keys(f).forEach((k) => {
        const v = f[k];
        if (typeof v === "string" && v.includes(",")) {
          filter[k] = { $in: v.split(",") };
        } else {
          filter[k] = v;
        }
      });
    }

    if (req.query.q) {
      filter.$text = { $search: String(req.query.q) };
    }

    const user = (req as any).user;
    if (user && user.role !== "admin") {
      filter.$or = [{ createdBy: user.id }, { assignedTo: user.id }];
    }

    const [total, items] = await Promise.all([
      Customer.countDocuments(filter),
      Customer.find(filter)
        .sort(sort as any)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    if (user?.id) {
      auditLog({
        customerId: new mongoose.Types.ObjectId(user.id),
        actorId: user.id,
        action: "LIST_CUSTOMERS",
        details: { query: req.query },
        req,
      }).catch(() => {});
    }

    const meta = { page, limit, total, pages: Math.ceil(total / limit) };
    return res.json(success(items, "Customers retrieved", meta));
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiError("Failed to list customers", 500, err));
  }
}

export async function getCustomer(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(apiError("Invalid customer id", 400));
    }

    const customer = await Customer.findById(id).lean();
    if (!customer) return res.status(404).json(apiError("Customer not found", 404));

    const user = (req as any).user;
    if (user?.role !== "admin" && String(customer.createdBy) !== String(user?.id) && String(customer.assignedTo) !== String(user?.id)) {
      return res.status(403).json(apiError("Forbidden", 403));
    }

    if (user?.id) {
      auditLog({
        customerId: customer._id,
        actorId: user.id,
        action: "VIEW_CUSTOMER",
        details: { customerId: id },
        req,
      }).catch(() => {});
    }

    return res.json(success(customer, "Customer retrieved"));
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiError("Failed to fetch customer", 500, err));
  }
}

export async function updateCustomer(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json(apiError("Invalid id", 400));

    const payload = req.body;
    const user = (req as any).user;

    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json(apiError("Customer not found", 404));

    if (user?.role !== "admin" && String(customer.createdBy) !== String(user?.id) && String(customer.assignedTo) !== String(user?.id)) {
      return res.status(403).json(apiError("Forbidden", 403));
    }

    Object.assign(customer, payload);
    await customer.save();

    auditLog({
      customerId: customer._id,
      actorId: user.id,
      action: "UPDATE_CUSTOMER",
      details: { updatedFields: payload },
      req,
    }).catch(() => {});

    return res.json(success(customer, "Customer updated"));
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiError("Failed to update customer", 500, err));
  }
}
