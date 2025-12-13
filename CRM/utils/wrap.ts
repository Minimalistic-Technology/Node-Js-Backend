import { RequestHandler } from "express";

export const wrap =
  (mw: any): RequestHandler =>
  (req, res, next) => {
    mw(req, res, next);
  };
