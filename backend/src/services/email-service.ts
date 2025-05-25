import nodemailer from "nodemailer";
import { env } from "../environment";

export const emailService = nodemailer.createTransport({
  pool: true,
  host: env.emailHost,
  port: Number(env.emailPort),
  secure: true,
  auth: {
    user: env.emailUser,
    pass: env.emailPass,
  },
});
