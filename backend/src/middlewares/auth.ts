import { NextFunction, Response } from "express";
import { supabase } from "../lib/supabase";
import { AuthRequest } from "../types/auth-request";

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer "))
      throw new Error("Authorization header missing or invalid");

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) throw error;

    req.user = {
      id: data.user.id,
      email: data.user.email,
      access_token: token,
    };

    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(500).json({ message: "Authentication failed" });
  }
};
