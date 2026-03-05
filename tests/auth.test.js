import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/User.js";

describe("Auth Routes", () => {
  let token;

  // Cleanup before tests run
  beforeAll(async () => {
    // Ensure we are connected before dropping
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskmanager");
    }
    await User.deleteMany({});
  });

  // Close connection after tests finish
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("test@example.com");
    expect(res.body.password).toBeUndefined(); // Security check
  });

  it("should login user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });
});