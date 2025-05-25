import { generateMockBlog } from "../database/factories/blog-factory";
import { createBlog, deleteBlog } from "../src/helpers/supabase-helper";
import { mockAuthUser } from "./utils/mock-auth";

describe("Blog Creation", () => {
  const mockUser = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "test@example.com",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    role: "authenticated",
  };

  const mockAccessToken = "mock-access-token";

  beforeEach(() => {
    mockAuthUser(mockUser, mockAccessToken);
  });

  it("should create a blog", async () => {
    const testBlog = generateMockBlog({
      author_id: mockUser.id,
    });

    const { id, ...blogData } = testBlog;

    const { data: createdBlog, error } = await createBlog(
      blogData,
      mockAccessToken
    );

    expect(error).toBeNull();
    expect(createdBlog).toMatchObject(blogData);

    // await deleteBlog(createdBlog.id);
  });

  it("should fail when unauthenticated", async () => {
    const testBlog = generateMockBlog();
    const { id, ...blogData } = testBlog;

    const { error } = await createBlog(blogData, "");

    expect(error).not.toBeNull();
    expect(error?.message).toContain("permission denied");
  });
});
