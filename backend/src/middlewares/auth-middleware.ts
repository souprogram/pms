import { NextFunction, Request, Response } from "express";
import { supabase } from "../lib/supabase";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    // Attach user to request for use in controllers
    // @ts-ignore
    req.user = {
      id: data.user.id,
      email: data.user.email,
      access_token: token,
    };

    next();
  } catch (err) {
    res.status(500).json({ message: "Athentication failed" });
  }
};
