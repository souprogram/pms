import assert from "assert";
import { NextFunction, Response } from "express";
import { supabase } from "../lib/supabase";
import { AuthRequest } from "../types/auth-request";

export const authorizeAuthor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    assert(user, "User must be authenticated");

    const { error: userError } = await supabase
      .from("authors")
      .select("*")
      .eq("id", user.id)
      .single();

    if (userError) throw userError;

    next();
  } catch (err) {
    console.error("Authorization error:", err);
    res.status(500).json({ message: "Authorization failed" });
  }
};
