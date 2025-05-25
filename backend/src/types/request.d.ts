declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        accessToken: string;
        email?: string;
      };
    }
  }
}
