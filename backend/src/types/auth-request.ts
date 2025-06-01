import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    access_token: string;
    email?: string;
  };
}
