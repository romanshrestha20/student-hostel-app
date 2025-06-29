import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // ======= 1. CLEANUP EXISTING DATA IN CORRECT ORDER
  await prisma.reply.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.room.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.adminAction.deleteMany();
  await prisma.userUpdateLog.deleteMany();
  await prisma.hostel.deleteMany();
  await prisma.user.deleteMany();

  // ======= 2. CREATE USERS
  const password = await bcrypt.hash('123456', 10);

  const student = await prisma.user.create({
    data: {
      name: 'Roman Student',
      email: 'roman@student.com',
      hashedPassword: password,
      role: 'student',
      gender: 'male',
    },
  });

  const owner1 = await prisma.user.create({
    data: {
      name: 'Roman Owner 1',
      email: 'roman.owner1@owner.com',
      hashedPassword: password,
      role: 'owner',
      gender: 'male',
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: 'Roman Owner 2',
      email: 'roman.owner2@owner.com',
      hashedPassword: password,
      role: 'owner',
      gender: 'female',
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Roman Admin',
      email: 'roman@admin.com',
      hashedPassword: password,
      role: 'admin',
      gender: 'unisex',
    },
  });

  // ======= 3. CREATE HOSTELS FOR OWNER 1
  const hostelsForOwner1 = [
    {
      name: 'Sunrise Hostel',
      description: 'A nice place with sunrise views.',
      address: '123 Sun Ave',
    },
    {
      name: 'Moonlight Hostel',
      description: 'Quiet and clean hostel in downtown.',
      address: '456 Moon St',
    },
  ];

  const hostelsForOwner2 = [
    {
      name: 'Starry Hostel',
      description: 'Best rooftop for stargazing.',
      address: '789 Star Blvd',
    },
    {
      name: 'Riverbank Hostel',
      description: 'Peaceful hostel near the river.',
      address: '101 River Rd',
    },
  ];

  // Create hostels for owner1
  for (const data of hostelsForOwner1) {
    const hostel = await prisma.hostel.create({
      data: {
        ...data,
        locationLat: 37.7749,
        locationLng: -122.4194,
        contactNumber: '+1234567890',
        amenities: ['WiFi', 'Laundry', 'Gym'],
        gender: 'unisex',
        status: 'approved',
        ownerId: owner1.id,
        photos: {
          create: [
            { url: 'https://picsum.photos/seed/hostel1/200/300', isPrimary: true },
            { url: 'https://picsum.photos/seed/hostel2/200/301' },
          ],
        },
        rooms: {
          create: [
            {
              roomType: 'single',
              price: 350.0,
              capacity: 1,
              available: true,
              amenities: ['Desk', 'Private Bathroom'],
              photos: {
                create: [
                  { url: 'https://picsum.photos/seed/room1/200/302', isPrimary: true },
                ],
              },
            },
            {
              roomType: 'dormitory',
              price: 150.0,
              capacity: 4,
              available: true,
              amenities: ['Shared Bathroom', 'Bunk Beds'],
            },
          ],
        },
      },
    });

    if (data.name === 'Sunrise Hostel') {
      const favorite = await prisma.favorite.create({
        data: {
          studentId: student.id,
          hostelId: hostel.id,
        },
      });

      const inquiry = await prisma.inquiry.create({
        data: {
          message: 'Is this hostel available in August?',
          studentId: student.id,
          hostelId: hostel.id,
        },
      });

      await prisma.reply.create({
        data: {
          message: 'Yes, rooms are available!',
          inquiryId: inquiry.id,
          repliedById: owner1.id,
        },
      });
    }
  }

  // ======= 4. CREATE HOSTELS FOR OWNER 2
  for (const data of hostelsForOwner2) {
    await prisma.hostel.create({
      data: {
        ...data,
        locationLat: 37.7749,
        locationLng: -122.4194,
        contactNumber: '+0987654321',
        amenities: ['WiFi', 'Laundry', 'Gym', 'Cafeteria'],
        gender: 'female',
        status: 'approved',
        ownerId: owner2.id,
        photos: {
          create: [
            { url: 'https://picsum.photos/seed/hostel3/200/303', isPrimary: true },
            { url: 'https://picsum.photos/seed/hostel4/200/304' },
          ],
        },
        rooms: {
          create: [
            {
              roomType: 'double',
              price: 450.0,
              capacity: 2,
              amenities: ['Desk', 'Balcony'],
              available: true,
              photos: {
                create: [
                  { url: 'https://picsum.photos/seed/room2/200/305', isPrimary: true },
                ],
              },
            },
            {
              roomType: 'apartment',
              price: 900.0,
              capacity: 4,
              amenities: ['Kitchen', 'Living Room', 'Bathroom'],
              available: true,
            },
          ],
        },
      },
    });
  }

  // ======= 5. CREATE ADMIN ACTION
  await prisma.adminAction.create({
    data: {
      actionType: 'approve_hostel',
      targetType: 'hostel',
      targetId: 'manual-placeholder-id', // placeholder
      reason: 'Initial seed approval',
      adminId: admin.id,
    },
  });

  console.log('🌱 Database has been seeded successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
