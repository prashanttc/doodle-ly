  import { NextResponse } from "next/server";
  import OpenAI from "openai";

  const client = new OpenAI({
    baseURL: "https://api.studio.nebius.com/v1/",
    apiKey: process.env.NEBIUS_KEY,
  });

  export async function POST(request: Request) {
    try {
      const { prompt } = await request.json();
      if (!prompt) {
        return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
      }
      const hyperRealisticPrompt = `Generate a studio ghibli style image of this prompt: ${prompt}`;
      const generatedImage = await client.images.generate({
        model: "black-forest-labs/flux-dev",
        response_format: 'b64_json',
        n: 1,
        size: '512x512',
        quality:'standard',
        prompt:hyperRealisticPrompt,
      });

      const base64 = generatedImage.data[0]?.b64_json;
      const imageUrl = `data:image/png;base64,${base64}`
      return NextResponse.json({ image:imageUrl });
    } catch (error) {
      console.error("Internal server error", error);
      return NextResponse.json({ error: "internal server error" }, { status: 500 });
    }
  }
