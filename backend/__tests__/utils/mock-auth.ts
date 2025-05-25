import { supabase } from "../../src/database";

export const mockAuthUser = (user: any, accessToken: string) => {
  jest.spyOn(supabase.auth, "getSession").mockResolvedValue({
    data: {
      session: {
        access_token: accessToken,
        user: user,
        refresh_token: "mock-refresh-token",
        expires_in: 1234567890,
        token_type: "bearer",
      },
    },
    error: null,
  });

  jest.spyOn(supabase.auth, "getUser").mockResolvedValue({
    data: { user },
    error: null,
  });
};
