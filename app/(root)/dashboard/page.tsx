"use client";
import { createClient } from "@/lib/client";
import {
  generateImage,
  generatePrompt,
} from "@/utils/helperFunction";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DownloadButton from "@/components/DownloadButton";

const Board = dynamic(() => import("@/components/Board"), { ssr: false });

type UserProps = {
  id: string;
  user_metadata: {
    avatarUrl?: string;
    name?: string;
    email?: string;
  };
};

const Page = () => {
  const [scribbleUrl, setScribbleUrl] = useState("");
  const [aiImageUrl, setAiImageUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const aiImageRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<UserProps | null>(null);
  useEffect(() => {
    const supabase = createClient();
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log("Error fetching user:", error);
      } else {
        setUser(data?.user || null);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async (imageUrl: string) => {
    setScribbleUrl(imageUrl);
    setIsGenerating(true);
    setProgress(0);

    try {
      setTimeout(() => {
        aiImageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);

      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);

      const data = await generatePrompt(imageUrl);
      const image = await generateImage(data.description);
      setAiImageUrl(image.image);
      clearInterval(interval);
      setProgress(100);
      toast.success("Image generated successfully");
    } catch (error) {
      console.error("Error generating AI image:", error);
      toast.error("Failed to generate image");
    }

    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col justify-center p-4 w-full  xl:mt-20 min-h-screen px-5">
      <div className="flex gap-20  border-b-2  items-center border-white pb-10">
        <Board onSave={handleSave} />
        <div className="w-full flex flex-col py-10 justify-center xl:-mt-32 gap-6 items-center h-screen ">
          <h1 className="text-white/50">
            hey{" "}
            <span className="font-semibold text-white">
              {" "}
              {user?.user_metadata.name}
            </span>
          </h1>
          <h1 className="text-white text-5xl font-bold text-center">
            From Doodles to Masterpieces in Seconds!
          </h1>
          <p className="text-white/60 text-center">
            draw or upload anything you want and doodle-ly will convert it for
            you.{" "}
          </p>
          <div className="flex gap-5">
            <div className="bg-black flex items-center justify-center border border-gray-300 rounded-md px-4 py-2 cursor-pointer relative w-full h-12">
              <label className="w-full text-center text-white cursor-pointer">
                {scribbleUrl ? "File Selected" : "No file chosen"}
              </label>
              <Input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setScribbleUrl(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <Button
              disabled={isGenerating}
              className="p-6  bg-white flex items-center text-black rounded-xl cursor-pointer hover:bg-black hover:text-white hover:border-2 border-white/50"
              onClick={() => {
                if (!scribbleUrl) {
                  toast.error("Please upload an image first.");
                  return;
                }
                handleSave(scribbleUrl);
              }}
            >
              {isGenerating ? "generating" : "generate"}
            </Button>
          </div>
        </div>
      </div>

      {scribbleUrl && (
        <div className=" h-screen mt-20 xl:mt-4 flex flex-col gap-10 xl:gap-20 items-center justify-center">
          <div className="flex flex-col gap-8 items-center justify-center ">
            <h2 className="text-xl xl:text-4xl text-white font-semibold">
              awesome your creation is here!
            </h2>
            <DownloadButton aiImageUrl={aiImageUrl} />
          </div>
          <div className="xl:flex-row flex-col gap-10 flex items-center justify-around">
            <div className="border-2 border-white/40 rounded-2xl p-3">
              <h2 className="text-lg font-semibold text-white">
                Your Scribble
              </h2>
              <div className="xl:h-[400px] h-[350px] w-[350px] xl:w-[400px]">
                <Image
                  height={500}
                  width={500}
                  src={scribbleUrl}
                  alt="Scribble"
                  className="mt-2 h-full w-full object-cover"
                />
              </div>
            </div>
            <div
              ref={aiImageRef}
              className="border-2 border-white/40 rounded-2xl p-3"
            >
              <h2 className="text-lg font-semibold text-white">
                AI-Generated Image
              </h2>
              {isGenerating ? (
                <div className="xl:h-[400px] xl:w-[400px] h-[350px] w-[350px] flex items-center justify-center">
                  <AnimatedCircularProgressBar
                    max={100}
                    min={0}
                    gaugePrimaryColor="purple"
                    gaugeSecondaryColor="gray"
                    value={progress}
                    className="text-white"
                  />
                </div>
              ) : (
                aiImageUrl && (
                  <div className="xl:h-[400px] xl:w-[400px] w-[350px] h-[350px]">
                    <Image
                      height={500}
                      width={500}
                      src={aiImageUrl}
                      alt="AI-Generated"
                      className="mt-2 h-full w-full object-cover"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
