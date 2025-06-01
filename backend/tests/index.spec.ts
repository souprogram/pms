import request from "supertest";
import { app } from "../src/app";

describe("Sanity test", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});

describe("App", () => {
  test("should work", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: "Welcome to the API" });
  });
});
