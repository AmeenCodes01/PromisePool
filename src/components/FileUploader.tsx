"use client"
import { FormEvent, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import usePersistState from "@/hooks/usePersistState";
import { Switch } from "./ui/switch";

export default function FileUploader() {
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const sendImage = useMutation(api.images.sendImage);

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));
  async function handleSendImage(event: FormEvent) {
    event.preventDefault();

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": selectedImage!.type },
      body: selectedImage,
    });

    const { storageId } = await result.json();
    // Step 3: Save the newly allocated storage id to the database
    await sendImage({ storageId, author: name });

    setSelectedImage(null);
    imageInput.current!.value = "";
  }
  return (
    <div className=" flex flex-col  gap-2 min-w-[300px]  ">

      <form
  onSubmit={handleSendImage}
  className="border border-gray-700 rounded p-2 flex flex-col items-center gap-2 w-fit shadow-sm "
>
  <div>

  <input
    type="file"
    accept="image/*"
    ref={imageInput}
    onChange={(e) => setSelectedImage(e.target.files![0])}
    disabled={selectedImage !== null}
    className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:border file:border-gray-300 file:rounded file:bg-gray-100 file:text-gray-500 file:text-xs file:font-normal disabled:opacity-50 file:disabled:opacity-40 file:cursor-pointer"
    title="Choose BG Image"
  />
  <input
    type="submit"
    value="Send"
    disabled={selectedImage === null}
    className="px-3 py-1 text-xs bg-blue-600 text-white rounded disabled:bg-gray-300"
  />
    </div>
  <span className="text-xs italic text-primary">upload img to set as bg</span>
</form>
    </div>

  )
}