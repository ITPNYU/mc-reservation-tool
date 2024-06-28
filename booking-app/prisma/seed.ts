import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rooms = [
    { roomId: 103, name: "The Garage", capacity: 74 },
    { roomId: 202, name: "Lecture Hall", capacity: 210 },
    { roomId: 220, name: "Black Box", capacity: 30 },
    { roomId: 221, name: "Ballroom A", capacity: 12 },
    { roomId: 222, name: "Ballroom B", capacity: 12 },
    { roomId: 223, name: "Ballroom C", capacity: 12 },
    { roomId: 224, name: "Ballroom D", capacity: 12 },
    { roomId: 230, name: "Audio Lab", capacity: 13 },
    { roomId: 233, name: "Co-Lab", capacity: 50 },
    { roomId: 260, name: "Post Production Lab", capacity: 20 },
    { roomId: 1201, name: "Seminar Room", capacity: 100 },
  ];

  for (const room of rooms) {
    const createdRoom = await prisma.room.create({
      data: room,
    });
    console.log({ createdRoom });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
