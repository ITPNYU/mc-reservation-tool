import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GETリクエストの処理
export async function GET() {
  try {
    const bookingStatuss = await prisma.bookingStatus.findMany();
    return NextResponse.json(bookingStatuss);
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
  const input = await req.json();
  try {
    const newRoom = await prisma.bookingStatus.create({
      data: input,
    });
    return NextResponse.json(newRoom, { status: 201 });
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
    await prisma.bookingStatus.delete({
      where: { id: id },
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
