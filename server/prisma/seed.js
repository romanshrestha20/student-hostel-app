// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create Users
  const student = await prisma.user.create({
    data: {
      name: 'Alice Student',
      email: 'alice@student.com',
      hashedPassword: 'hashed_pwd_123', // Use hashed in prod
      role: 'student',
    },
  });

  const owner = await prisma.user.create({
    data: {
      name: 'Bob Owner',
      email: 'bob@owner.com',
      hashedPassword: 'hashed_pwd_456',
      role: 'owner',
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@platform.com',
      hashedPassword: 'hashed_pwd_admin',
      role: 'admin',
    },
  });

  // Create Hostel
  const hostel = await prisma.hostel.create({
    data: {
      name: 'Sunrise Student Hostel',
      description: 'A modern and safe student hostel near campus.',
      address: '123 Campus Lane, Cityville',
      locationLat: 37.7749,
      locationLng: -122.4194,
      contactNumber: '+1234567890',
      amenities: ['WiFi', 'Laundry', 'Study Room', 'Gym'],
      status: 'approved',
      ownerId: owner.id,
      photos: {
        create: [
          { url: 'https://picsum.photos/200/300', isPrimary: true },
          { url: 'https://picsum.photos/200/301' },
        ],
      },
      rooms: {
        create: [
          {
            roomType: 'single',
            price: 350.0,
            capacity: 1,
            amenities: ['Desk', 'Private Bathroom'],
            available: true,
            photos: {
              create: [{ url: 'https://picsum.photos/200/302', isPrimary: true }],
            },
          },
          {
            roomType: 'dormitory',
            price: 150.0,
            capacity: 4,
            amenities: ['Shared Bathroom', 'Bunk Beds'],
            available: true,
          },
        ],
      },
    },
  });

  // Create Inquiry
  await prisma.inquiry.create({
    data: {
      message: 'Hi, is this hostel available for August move-in?',
      studentId: student.id,
      hostelId: hostel.id,
    },
  });

  // Create Favorite
  await prisma.favorite.create({
    data: {
      studentId: student.id,
      hostelId: hostel.id,
    },
  });

  console.log('🌱 Seed data created successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
