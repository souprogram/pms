require("dotenv").config();

export const env = {
  port: process.env.PORT ?? 3000,

  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY ?? "",

  emailUser: process.env.EMAIL_USER ?? "",
  emailPass: process.env.EMAIL_PASS ?? "",
  emailHost: process.env.EMAIL_HOST ?? "",
  emailPort: process.env.EMAIL_PORT ?? "",

  frontendUrl: process.env.FRONTEND_URL ?? "",

  nodeEnv: process.env.NODE_ENV ?? "development",
};
