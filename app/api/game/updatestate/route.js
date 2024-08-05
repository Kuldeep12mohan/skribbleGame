import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export const POST = async (request) => {
  const body = await request.json();
  console.log(body); //offsetX,offsetY,color,lineWidth,roomName
  const room = await prisma.room.findFirst({
    where: {
      name: body.roomName,
    },
  });
  const gameState = await prisma.gameState.create({
    data: {
      offsetX,
      offsetY,
      lineWidth,
      color,
      roomId: room.id,
    },
  });
  return NextResponse.json({
    message: "receiving correct arguments",
    gameState,
  });
};
