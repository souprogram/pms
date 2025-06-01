import { base, en, Faker, hr } from "@faker-js/faker";
import request from "supertest";
import { app } from "../src/app";
import { supabase } from "../src/lib/supabase";

const faker = new Faker({
  locale: [hr, en, base],
});

// Mock the auth middleware
const fakeUserId = "615cac1b-7661-4335-bd76-f3323a7eb207";

jest.mock("../src/middlewares", () => ({
  ...jest.requireActual("../src/middlewares"),
  auth: jest.fn((req, res, next) => {
    req.user = {
      id: fakeUserId,
      email: "test@example.com",
      access_token: "mock-token",
    };
    next();
  }),
  authorizeAuthor: jest.fn((req, res, next) => next()),
}));

// Mock the email service
jest.mock("../src/lib/email", () => ({
  ...jest.requireActual("../src/lib/email"),
  emailService: {
    sendMail: jest.fn().mockResolvedValue({
      accepted: ["test@example.com"],
      rejected: [],
      messageId: "mock-message-id",
    }),
  },
}));

const getCategory = () =>
  ["Technology", "Health", "Lifestyle", "Education", "Travel"][
    Math.floor(Math.random() * 5)
  ];

const getHashtags = () =>
  Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () =>
    faker.word.noun()
  ).join(",");

const getContent = () =>
  `<p>${getParagraph()}</p><p>${getParagraph()}</p><p>${getParagraph()}</p><p>${getParagraph()}</p><p>${getParagraph()}</p>`;

const getParagraph = () => faker.lorem.paragraph({ min: 3, max: 7 });

describe("Blog API", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("POST /api/blogs", () => {
    it("should create a new blog post", async () => {
      const image = await fetch("https://picsum.photos/800/600").then(
        (response) => response.arrayBuffer()
      );

      const res = await request(app)
        .post("/api/blogs")
        .field("title", faker.book.title())
        .field("description", getParagraph())
        .field("content", getContent())
        .field("category", getCategory())
        .field("hashtags", getHashtags())
        .field("author", faker.person.fullName())
        .field("image_alt", faker.lorem.sentence(3))
        .attach("image", Buffer.from(image), {
          filename: "test-image.jpg",
          contentType: "image/jpeg",
        });

      expect(res.statusCode).toEqual(201);

      const { emailService } = require("../src/lib/email");
      expect(emailService.sendMail).toHaveBeenCalled();
      expect(emailService.sendMail.mock.calls[0][0]).toHaveProperty(
        "subject",
        expect.stringContaining("PMS objava:")
      );
    });
  });

  describe("PATCH /api/blogs/:id", () => {
    it("should update an existing blog post", async () => {
      const image = await fetch("https://picsum.photos/800/600").then(
        (response) => response.arrayBuffer()
      );

      const { data, error } = await supabase
        .from("blogs")
        .select("id")
        .eq("author_id", fakeUserId)
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching blog for update test:", error);
        throw new Error("Failed to fetch blog for update test");
      }

      const res = await request(app)
        .patch(`/api/blogs/${data.id}`)
        .field("title", faker.book.title())
        .field("description", getParagraph())
        .field("content", getContent())
        .field("category", getCategory())
        .field("hashtags", getHashtags())
        .field("author", faker.person.fullName())
        .field("image_alt", faker.lorem.sentence(3))
        .attach("image", Buffer.from(image), {
          filename: "test-image.jpg",
          contentType: "image/jpeg",
        });

      expect(res.statusCode).toEqual(200);
    });
  });

  describe("DELETE /api/blogs/:id", () => {
    it("should delete a blog post", async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("id")
        .eq("author_id", fakeUserId)
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching blog for delete test:", error);
        throw new Error("Failed to fetch blog for delete test");
      }

      const res = await request(app).delete(`/api/blogs/${data.id}`);

      expect(res.statusCode).toEqual(204);
    });
  });
});
