import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/User.js";
import Task from "../src/models/Task.js";

let token;
let taskId;

describe("Task Routes", () => {

  beforeAll(async () => {
  // 1. Connect and Wipe
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskmanager");
  }
  await User.deleteMany({});
  await Task.deleteMany({});

  // 2. Register
  await request(app)
    .post("/api/auth/register")
    .send({ name: "Task User", email: "task@example.com", password: "123456" });

  // 3. Login - WE MUST WAIT FOR THIS
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "task@example.com", password: "123456" });

  // 4. Set Token
  token = res.body.token; 
  
  // LOG THIS TO YOUR TERMINAL TO DEBUG
  if (!token) console.error("TEST ERROR: Login failed, no token received!");
});

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should not allow access without token", async () => {
    const res = await request(app)
      .get("/api/tasks");

    expect(res.statusCode).toBe(401);
  });

  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Testing"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task");

    taskId = res.body._id;
  });

  it("should get user tasks only", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should delete a task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});