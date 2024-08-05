import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
export const POST = async (request) => {
  try {
    const body = await request.json();
    console.log(body);
    const res = await prisma.user.create({
      data:{
        name:body.name
      }
    })
    console.log(res)
    return NextResponse.json({
      message: "hi from signup"
    });
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({
      error: "Invalid request body"
    }, { status: 400 });
  }
};

export default POST;
