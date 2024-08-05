import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (request) => {
  try {
    const body = await request.json();
    console.log(body); //userName, roomName

    const existingRoom = await prisma.room.findFirst({
      where: {
        name: body.roomName,
      },
    });

    if (existingRoom) {
      const user = await prisma.user.create({
        data: {
          name: body.userName,
          roomId: existingRoom.id,
        },
      });
      return NextResponse.json({
        message:
          "room already exist and a user is created and joined this room",
        user,
        room: existingRoom,
      });
    }

    const room = await prisma.room.create({
      data: {
        name: body.roomName,
      },
    });

    const user = await prisma.user.create({
      data: {
        name: body.userName,
        roomId: room.id,
      },
    });

    console.log(user);

    return NextResponse.json({
      message: "Hi from signup",
      user,
      room,
    });
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json(
      {
        error: "Invalid request body",
      },
      { status: 400 }
    );
  }
};
