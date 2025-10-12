import { Request, Response } from "express";
import { LeaveModel, ILeave } from "../models/leave";
import { AuthUserModel } from "../models/authUser";
import mongoose from "mongoose";


interface AuthRequest extends Request {
  user?: any;
}


export const applyLeave = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eid = req.user?.eid;
    const email = req.user?.email;

    console.log(email)
    if (!eid) {
      res.status(401).json({ message: "Unauthorized: user not found in token" });
      return;
    }

    const { from, to, reason } = req.body;
    if (!from || !to || !reason || !email ) {
      res.status(400).json({ message: "Missing required fields: from, to, reason" });
      return;
    }

    const leave = new LeaveModel({
      eid,
      email,
      from,
      to,
      reason,
      status: "Pending",
      appliedAt: new Date(),
    });

    await leave.save();

    res.status(201).json({ message: "Leave applied successfully", leave });
  } catch (error) {
    console.error("Apply leave error:", error);
    res.status(500).json({ message: "Server error applying leave" });
  }
};


export const editLeave = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const eid = req.user?.eid;
    if (!eid) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const leave = await LeaveModel.findById(id);
    if (!leave) {
      res.status(404).json({ message: "Leave not found" });
      return;
    }

    if (leave.status !== "Pending") {
      res.status(400).json({ message: "Cannot edit leave once it is handled" });
      return;
    }

    if (leave.eid !== eid) {
      res.status(403).json({ message: "Forbidden: cannot edit other's leave" });
      return;
    }

    

    const { from, to, reason } = req.body;
    leave.from = from ?? leave.from;
    leave.to = to ?? leave.to;
    leave.reason = reason ?? leave.reason;

    await leave.save();
    res.status(200).json({ message: "Leave updated successfully", leave });
  } catch (error) {
    console.error("Edit leave error:", error);
    res.status(500).json({ message: "Server error editing leave" });
  }
};

export const handleLeave = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action } = req.body; 
    const handledBy = req.user?.eid;


    if (!handledBy) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!["Approved", "Rejected"].includes(action)) {
      res.status(400).json({ message: "Invalid action. Must be 'Approved' or 'Rejected'" });
      return;
    }

    const leave = await LeaveModel.findById(id);
    if (!leave) {
      res.status(404).json({ message: "Leave not found" });
      return;
    }

    if (leave.status !== "Pending") {
      res.status(400).json({ message: "Leave has already been handled" });
      return;
    }

    leave.status = action as "Approved" | "Rejected";
    leave.handledBy = handledBy;
    await leave.save();

    res.status(200).json({ message: `Leave ${action.toLowerCase()} successfully`, leave });
  } catch (error) {
    console.error("Handle leave error:", error);
    res.status(500).json({ message: "Server error handling leave" });
  }
};



export const getLeaves = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eid = req.user?.eid;

    let leaves;
    if (!eid) {
      res.status(402).json({message:"User not found"});
    } 

     leaves = await LeaveModel.find({ eid }).sort({ appliedAt: -1 });

    res.status(200).json(leaves);
  } catch (error) {
    console.error("Get leaves error:", error);
    res.status(500).json({ message: "Server error fetching leaves" });
  }
};


export const getLeavesAll = async (req: AuthRequest, res: Response): Promise<void> => {  // send by staus pending or all  
  try {
    const role = req.user?.role;

    let leaves;
    if (role !== "Admin") {
      res.status(403).json({message:"Unauthorised access"});
    }

    leaves = await LeaveModel.find().sort({ appliedAt: -1 });

    res.status(200).json(leaves);
  } catch (error) {
    console.error("Get leaves error:", error);
    res.status(500).json({ message: "Server error fetching leaves" });
  }
};


export const getLeaveById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const leave = await LeaveModel.findById(id);

    if (!leave) {
      res.status(404).json({ message: "Leave not found" });
      return;
    }

    res.status(200).json(leave);
  } catch (error) {
    console.error("Get leave by ID error:", error);
    res.status(500).json({ message: "Server error fetching leave" });
  }
};



export const deleteLeave = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const eid = req.user?.eid;

    const leave = await LeaveModel.findById(id);
    if (!leave) {
      res.status(404).json({ message: "Leave not found" });
      return;
    }
  // only user can delete if pending only 
    // if ( req.user?.role !== "Admin") {
    //   res.status(403).json({ message: "Forbidden: cannot delete this leave" });
    //   return;
    // }

    await leave.deleteOne();
    res.status(200).json({ message: "Leave deleted successfully" });
  } catch (error) {
    console.error("Delete leave error:", error);
    res.status(500).json({ message: "Server error deleting leave" });
  }
};
