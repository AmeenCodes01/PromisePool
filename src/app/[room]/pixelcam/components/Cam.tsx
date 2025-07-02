"use client";
import { useEffect, useRef } from "react";

export default function PixelCam() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
      video.play();
    });

    const draw = () => {
      const pixelSize = 24; // 👈 adjust this to control pixelation level

      // draw tiny video frame into canvas
      ctx.drawImage(video, 0, 0, pixelSize, pixelSize);

      // then scale that tiny frame up to full canvas size
      ctx.drawImage(canvas, 0, 0, pixelSize, pixelSize, 0, 0, canvas.width, canvas.height);

      requestAnimationFrame(draw);
    };

    video.addEventListener("play", () => {
      draw();
    });
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} width={640} height={480} />
    </div>
  );
}
