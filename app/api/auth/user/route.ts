import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(request: Request) {
  const { user } = await request.json();
  if (!user) {
    return NextResponse.json({ error: "user data missing" }, { status: 400 });
  }
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.user_metadata.full_name || null,
          avatar_url: user.user_metadata.avatar_url || null,
        },
      });
    } else {
      console.log("user already exist ,no need to insert");
    }
    return NextResponse.json({ meesage: "user stored successfully" });
  } catch (error) {
    console.log("error", error);
    NextResponse.json({ error: "internal server error" }, { status: 300 });
  }
}
