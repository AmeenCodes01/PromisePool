"use client";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function PixelVideoRoom({ room }: { room: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const sendSignal = useMutation(api.signals.sendSignal);
  const [startTime] = useState(() => Date.now());
  const signals = useQuery(api.signals.getSignals, { room, since: startTime });
    const user = useQuery(api.users.current);
    const userId = user?._id as Id<"users">
  useEffect(() => {
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;

    // Pixelate webcam
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
      video.play();

      const draw = () => {
        const size = 24;
        ctx.drawImage(video, 0, 0, size, size);
        ctx.drawImage(canvas, 0, 0, size, size, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(draw);
      };

      video.addEventListener("play", () => draw());

      // WebRTC Peer Connection
      const pc = new RTCPeerConnection();
      peerConnection.current = pc;

      const pixelStream = canvas.captureStream(15);
      pixelStream.getTracks().forEach((track) => pc.addTrack(track, pixelStream));

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          sendSignal({
            room,
            type: "candidate",
            data: e.candidate.toJSON(),
          });
        }
      };

      pc.ontrack = (e) => {
        const remoteVideo = document.createElement("video");
        remoteVideo.srcObject = e.streams[0];
        remoteVideo.autoplay = true;
        remoteVideo.playsInline = true;
        remoteVideo.width = 320;
        remoteVideo.height = 240;
        document.body.appendChild(remoteVideo);
      };

      // Create offer
      pc.createOffer().then((offer) => {
        pc.setLocalDescription(offer);
        sendSignal({ room,  type: "offer", data: offer });
      });
    });
  }, []);

  // Listen for new signals
  useEffect(() => {
    if (!signals) return;
    const pc = peerConnection.current!;
    signals.forEach(async (signal) => {
      if (signal.senderId === userId) return;

      if (signal.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendSignal({ room,  type: "answer", data: answer });
      }

      if (signal.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
      }

      if (signal.type === "candidate") {
        await pc.addIceCandidate(new RTCIceCandidate(signal.data));
      }
    });
  }, [signals]);

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} width={640} height={480} />
    </div>
  );
}
