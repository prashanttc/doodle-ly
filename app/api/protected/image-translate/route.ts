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

    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const descriptionResponse = await client.chat.completions.create({
      model: "Qwen/Qwen2-VL-72B-Instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Based on the provided image description, create a prompt for realistic and  colourfull image generation model"          },
            {
              type: "image_url",
              image_url: { url: image },
            },
          ],
        },
      ],
      max_tokens: 300,
      
    });

    const description = descriptionResponse.choices[0].message.content;

    if (!description) {
      return NextResponse.json(
        { error: "Failed to generate description" },
        { status: 500 }
      );
    }

    return NextResponse.json({ description });
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
