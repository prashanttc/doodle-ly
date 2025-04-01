import { prisma } from "@/lib/prisma"; 
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.NEBIUS_KEY,
});
export async function POST(request: Request) {
  try {
    if (request.method !== "POST") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }

    const { image, userId } = await request.json();

    if (!image || !userId) {
      return NextResponse.json(
        { error: "image or userId is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.json({ error: "no user found" }, { status: 404 });
    }
    if (user.credits < 1) {
      return NextResponse.json({ error: "no credit left" }, { status: 403 });
    }

    const descriptionResponse = await client.chat.completions.create({
      model: "Qwen/Qwen2-VL-72B-Instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Based on the provided image description, create a short prompt for anime type image generation",
            },
            {
              type: "image_url",
              image_url: { url: image },
            },
          ],
        },
      ],
      max_tokens: 100,
    });

    const description = descriptionResponse.choices[0].message.content;

    if (!description) {
      return NextResponse.json(
        { error: "Failed to generate description" },
        { status: 500 }
      );
    }
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: 1 },
      },
    });
    return NextResponse.json({ description });
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
