import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GETリクエストの処理
export async function GET() {
  try {
    const reservationTypes = await prisma.reservationType.findMany();
    return NextResponse.json(reservationTypes);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POSTリクエストの処理
export async function POST(req: Request) {
  const { name } = await req.json();
  try {
    const newRoom = await prisma.reservationType.create({
      data: { name, createdAt: new Date() },
    });
    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUTリクエストの処理
export async function PUT(req: Request) {
  const { id, name, capacity } = await req.json();
  try {
    const updatedRoom = await prisma.reservationType.update({
      where: { id: Number(id) },
      data: { name, capacity },
    });
    return NextResponse.json(updatedRoom);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETEリクエストの処理
export async function DELETE(req: Request) {
  const { id } = await req.json();
  try {
    await prisma.reservationType.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Room deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
  }
}
