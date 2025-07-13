import request from "supertest";
import app from "../server";
import prisma from "../prisma/client";

describe("Booking API Integration Tests", () => {
  let testHostelId;
  let testRoomId;
  let testStudentId;
  let bookingId;

  beforeAll(async () => {
    // Create a test hostel
    const hostel = await prisma.hostel.create({
      data: {
        name: `Test Hostel ${Date.now()}`,
        location: "Test City",
        description: "Test description",
        // Add other required fields for your Hostel model
      },
    });
    testHostelId = hostel.id;

    // Create a test room linked to the hostel
    const room = await prisma.room.create({
      data: {
        name: "Test Room",
        available: true,
        price: 50,
        hostelId: testHostelId,
        // Add other required fields for your Room model
      },
    });
    testRoomId = room.id;

    // Create a test student user
    const student = await prisma.user.create({
      data: {
        name: "Test Student",
        email: `teststudent${Date.now()}@example.com`,
        password: "testpassword", // Assume plain or hashed based on your schema
        role: "student",
      },
    });
    testStudentId = student.id;
  });

  afterAll(async () => {
    // Clean up bookings linked to test student
    await prisma.booking.deleteMany({ where: { studentId: testStudentId } });

    // Delete test room, hostel, and student
    await prisma.room.delete({ where: { id: testRoomId } });
    await prisma.hostel.delete({ where: { id: testHostelId } });
    await prisma.user.delete({ where: { id: testStudentId } });

    await prisma.$disconnect();
  });

  test("Create a booking successfully", async () => {
    const res = await request(app).post("/api/bookings").send({
      roomId: testRoomId,
      studentId: testStudentId,
      checkInDate: "2025-08-01",
      checkOutDate: "2025-08-05",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("booking");
    expect(res.body.booking.roomId).toBe(testRoomId);
    expect(res.body.booking.studentId).toBe(testStudentId);
    bookingId = res.body.booking.id;
  });

  test("Get bookings by student ID", async () => {
    const res = await request(app).get(
      `/api/bookings/student/${testStudentId}`
    );

    expect(res.status).toBe(200);
    expect(res.body.bookings.length).toBeGreaterThan(0);
  });

  test("Get booking by booking ID", async () => {
    const res = await request(app).get(`/api/bookings/${bookingId}`);

    expect(res.status).toBe(200);
    expect(res.body.booking.id).toBe(bookingId);
  });

  test("Update booking dates", async () => {
    const res = await request(app).put(`/api/bookings/${bookingId}`).send({
      checkInDate: "2025-08-02",
      checkOutDate: "2025-08-06",
    });

    expect(res.status).toBe(200);
    expect(new Date(res.body.booking.startDate).toISOString()).toContain(
      "2025-08-02"
    );
  });

  test("Cancel booking", async () => {
    const res = await request(app).delete(`/api/bookings/${bookingId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Booking cancelled successfully");
  });

  test("Room becomes available after booking cancellation", async () => {
    const room = await prisma.room.findUnique({ where: { id: testRoomId } });
    expect(room?.available).toBe(true);
  });
});
