import { toast } from "sonner";

export const generatePrompt = async ({
  imageUrl,
  userId,
}: {
  imageUrl: string;
  userId: string;
}) => {
  const response = await fetch("/api/protected/image-translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: imageUrl, userId }),
  });

  const data = await response.json();

  if (!response.ok) {
    toast.error(data.error || "An error occurred while generating the prompt.");
    throw new Error(
      data.error || "An error occurred while generating the prompt."
    );
  }
  return data;
};

export const generateImage = async (prompt: string) => {
  const response = await fetch("/api/protected/image-generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    toast.error(data.error || "An error occurred while generating the image.");
    throw new Error(
      data.error || "An error occurred while generating the image."
    );
  }
  return data;
};

export const getUser = async () => {
  try {
    const response = await fetch("/api/protected/get-user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast.error("Cannot find user");
      return null;
    }

    const data = await response.json(); 
    return data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    toast.error("Failed to fetch user");
    return null;
  }
};
