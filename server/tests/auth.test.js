import request from "supertest";
import app from "../app.js";
import prisma from "../prisma/client.js";
import { v4 as uuidv4 } from "uuid";

describe("Auth routes", () => {
  // Generate a unique email per test run
  let randomEmail;

  beforeAll(async () => {
    // Optional: Connect to the DB or do global setup if needed
    await prisma.$connect();
  });

  beforeEach(() => {
    // Generate a fresh email before each test to avoid conflicts
    randomEmail = `testuser+${uuidv4()}@example.com`;
  });

  afterEach(async () => {
    // Clean up created test users to keep DB clean
    await prisma.user.deleteMany({
      where: { email: { contains: "testuser+" } },
    });
  });

  afterAll(async () => {
    // Optional: Disconnect from DB or clean resources
    await prisma.$disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: randomEmail,
        password: "password123",
        role: "student",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "User created successfully");
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user).toHaveProperty("email", randomEmail);
    });

    it("should return 400 if name is missing", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: randomEmail,
        password: "password123",
        role: "student",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
      expect(Array.isArray(res.body.errors)).toBe(true);
    });

    it("should return 400 if email is missing", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        password: "password123",
        role: "student",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
      expect(Array.isArray(res.body.errors)).toBe(true);

      // Check one of the errors is about missing email
      const emailErrors = res.body.errors.filter((e) =>
        e.msg.toLowerCase().includes("email")
      );
      expect(emailErrors.length).toBeGreaterThan(0);
    });

    it("should return 400 if password is missing", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: randomEmail,
        role: "student",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
      expect(Array.isArray(res.body.errors)).toBe(true);
    });

    it("should return 400 if entered password has less than 6 characters", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: randomEmail,
        password: "123", // <-- too short
        role: "student",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
      expect(Array.isArray(res.body.errors)).toBe(true);
      const passwordErrors = res.body.errors.filter((e) =>
        e.msg.toLowerCase().includes("password")
      );
      expect(passwordErrors.length).toBeGreaterThan(0);
    });

    it("should return 400 if email already registered", async () => {
      // First, register the user
      await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: randomEmail,
        password: "password123",
        role: "student",
      });

      // Try to register again with the same email
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: randomEmail,
        password: "password123",
        role: "student",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error.toLowerCase()).toContain("email");
    });

    it("should return 400 if email format is invalid", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "invalid-email-format",
        password: "password123",
        role: "student",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
      expect(Array.isArray(res.body.errors)).toBe(true);
      const emailErrors = res.body.errors.filter((e) =>
        e.msg.toLowerCase().includes("email")
      );
      expect(emailErrors.length).toBeGreaterThan(0);
    });
  });
  describe("POST /api/auth/login", () => {
    it("should login an existing user", async () => {
      // First, register a user
      await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: randomEmail,
        password: "password123",
        role: "student",
      });

      // Now, try to login
      const res = await request(app).post("/api/auth/login").send({
        email: randomEmail,
        password: "password123",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Login successful");
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user).toHaveProperty("email", randomEmail);
    });

    it("should return 400 if email or password is missing", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: randomEmail,
        // password missing
      });

      expect(res.statusCode).toBe(400);
      // Expect the error property instead of errors array
      expect(res.body).toHaveProperty("error", "Invalid email or password");
    });
  });
});
