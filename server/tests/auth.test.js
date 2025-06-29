import request from "supertest";
import app from "../app.js";
import prisma from "../prisma/client.js";
import { v4 as uuidv4 } from "uuid";

describe("Auth routes", () => {
  let randomEmail;

  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(() => {
    randomEmail = `testuser+${uuidv4()}@example.com`;
  });

  afterEach(async () => {
    await prisma.user.deleteMany({
      where: { email: { contains: "testuser+" } },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("registers a student user successfully with gender", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test Student",
        email: randomEmail,
        password: "password123",
        role: "student",
        gender: "male",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "User created successfully");
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user).toHaveProperty("email", randomEmail);
      expect(res.body.user).toHaveProperty("role", "student");
      expect(res.body.user).toHaveProperty("createdAt");
      expect(res.body).toHaveProperty("token");
    });

    it("registers an owner user successfully without gender", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test Owner",
        email: randomEmail,
        password: "password123",
        role: "owner",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.user.role).toBe("owner");
      expect(res.body.user).toHaveProperty("gender", null);
    });

    it("returns 400 if gender is missing for student role", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test Student",
        email: randomEmail,
        password: "password123",
        role: "student",
        // no gender
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Gender is required for students");
    });

    it("returns 400 if gender is invalid", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test Student",
        email: randomEmail,
        password: "password123",
        role: "student",
        gender: "invalidgender",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Invalid gender value");
    });

    it("returns 400 if role is invalid", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: randomEmail,
        password: "password123",
        role: "invalidrole",
        gender: "male",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Invalid role specified");
    });

    it("returns 400 if required fields missing", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: randomEmail,
        role: "student",
        gender: "male",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Name, email, and password are required");
    });

    it("returns 400 if email already exists", async () => {
      await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: randomEmail,
        password: "password123",
        role: "student",
        gender: "male",
      });

      const res = await request(app).post("/api/auth/register").send({
        name: "Test User 2",
        email: randomEmail,
        password: "password456",
        role: "student",
        gender: "female",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Email already in use");
    });

    it("returns 400 if password is too short", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: randomEmail,
        password: "123",
        role: "student",
        gender: "male",
      });

      // Since your controller doesn't validate password length explicitly,
      // this might be a validation middleware in your stack or part of your existing test.
      // Adjust this based on your actual implementation.
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });
  });

  describe("POST /api/auth/login", () => {
    it("logs in a registered user successfully", async () => {
      await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: randomEmail,
        password: "password123",
        role: "student",
        gender: "male",
      });

      const res = await request(app).post("/api/auth/login").send({
        email: randomEmail,
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Login successful");
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("email", randomEmail);
    });

    it("returns 400 if email or password missing", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: randomEmail,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Email and password are required");
    });

    it("returns 401 for invalid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: randomEmail,
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("error", "Invalid credentials");
    });
  });
});

describe("User routes", () => {
  let adminToken, studentToken, adminUserId, studentUserId;

  beforeAll(async () => {
    await prisma.$connect();

    // Create admin user
    const adminEmail = `admin+${uuidv4()}@example.com`;
    const adminRes = await request(app).post("/api/auth/register").send({
      name: "Admin User",
      email: adminEmail,
      password: "password123",
      role: "admin",
    });
    adminToken = adminRes.body.token;
    adminUserId = adminRes.body.user.id;

    // Create student user
    const studentEmail = `student+${uuidv4()}@example.com`;
    const studentRes = await request(app).post("/api/auth/register").send({
      name: "Student User",
      email: studentEmail,
      password: "password123",
      role: "student",
      gender: "female",
    });
    studentToken = studentRes.body.token;
    studentUserId = studentRes.body.user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [adminUserId, studentUserId],
        },
      },
    });
    await prisma.$disconnect();
  });

  describe("GET /api/users", () => {
    it("allows admin to fetch all users", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("users");
      expect(Array.isArray(res.body.users)).toBe(true);
    });

    it("rejects non-admin from fetching all users", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("error", "You are not authorized to access this resource");
    });
  });

  describe("GET /api/users/:id", () => {
    it("allows admin to get any user by ID", async () => {
      const res = await request(app)
        .get(`/api/users/${studentUserId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty("id", studentUserId);
    });

    it("allows user to get own details", async () => {
      const res = await request(app)
        .get(`/api/users/${studentUserId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty("id", studentUserId);
    });

    it("prevents user from getting others' details", async () => {
      const res = await request(app)
        .get(`/api/users/${adminUserId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("error", "You are not authorized to access this user");
    });

    it("returns 404 if user not found", async () => {
      const res = await request(app)
        .get(`/api/users/non-existent-id`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", "User not found");
    });
  });

  describe("PUT /api/users/:id", () => {
    it("allows user to update own name and email", async () => {
      const newName = "Updated Student";
      const newEmail = `updated+${uuidv4()}@example.com`;

      const res = await request(app)
        .put(`/api/users/${studentUserId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ name: newName, email: newEmail });

      expect(res.statusCode).toBe(200);
      expect(res.body.user.name).toBe(newName);
      expect(res.body.user.email).toBe(newEmail);
    });

    it("prevents user from updating role or gender (only admin allowed)", async () => {
      const res = await request(app)
        .put(`/api/users/${studentUserId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ role: "admin", gender: "male" });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toMatch(/Only admins can update/);
    });

    it("allows admin to update role and gender", async () => {
      const res = await request(app)
        .put(`/api/users/${studentUserId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "owner", gender: "unisex" });

      expect(res.statusCode).toBe(200);
      expect(res.body.user.role).toBe("owner");
      expect(res.body.user.gender).toBe("unisex");
    });

    it("returns 400 if admin updates role to invalid role", async () => {
      const res = await request(app)
        .put(`/api/users/${studentUserId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "invalidrole" });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Invalid role specified");
    });

    it("returns 400 if admin updates gender to invalid gender", async () => {
      const res = await request(app)
        .put(`/api/users/${studentUserId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ gender: "invalidgender" });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Invalid gender value");
    });

    it("returns 400 if email is already in use by another user", async () => {
      // Create a new user to conflict email
      const anotherEmail = `conflict+${uuidv4()}@example.com`;
      await request(app).post("/api/auth/register").send({
        name: "Conflict User",
        email: anotherEmail,
        password: "password123",
        role: "student",
        gender: "male",
      });

      const res = await request(app)
        .put(`/api/users/${studentUserId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ email: anotherEmail });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Email already in use");
    });

    it("prevents non-admins from updating others' info", async () => {
      const res = await request(app)
        .put(`/api/users/${adminUserId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ name: "Hacker" });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe("You are not authorized to update this user");
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("allows admin to delete another user", async () => {
      // Create a user to delete
      const userToDeleteEmail = `delete+${uuidv4()}@example.com`;
      const userToDeleteRes = await request(app).post("/api/auth/register").send({
        name: "Delete User",
        email: userToDeleteEmail,
        password: "password123",
        role: "student",
        gender: "male",
      });
      const userToDeleteId = userToDeleteRes.body.user.id;

      const res = await request(app)
        .delete(`/api/users/${userToDeleteId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "User deleted successfully");
    });

    it("prevents user from deleting themselves", async () => {
      const res = await request(app)
        .delete(`/api/users/${studentUserId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe("Users cannot delete themselves");
    });

    it("prevents non-admins from deleting other users", async () => {
      const res = await request(app)
        .delete(`/api/users/${adminUserId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe("You are not authorized to delete this user");
    });

    it("returns 404 if user to delete not found", async () => {
      const res = await request(app)
        .delete("/api/users/non-existent-id")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("User not found");
    });
  });
});
