import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export const GET = async (request) => {
  // Accessing the query parameter
  const id = request.nextUrl.searchParams.get("id");//roomId
  console.log(id);
  const gameState = await prisma.gameState.findFirst({
    where:{
      roomId:id
    },
    select:{
      offsetX:true,
      offsetY:true,
      lineWidth:true,
      color:true
    }
  })
  return NextResponse.json({
    message: "hello baby",
    gameState
  });
};
