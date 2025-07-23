"use client"
import { FormEvent, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

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
 <form
  onSubmit={handleSendImage}
  className="border border-gray-700 rounded p-2 flex items-center gap-2 w-fit shadow-sm "
>
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
</form>

  )
}