"use client";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function PixelVideoRoom({ room }: { room: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const sendSignal = useMutation(api.signals.sendSignal);
  const [startTime] = useState(() => Date.now());
  const signals = useQuery(api.signals.getSignals, { room, since: startTime });
  const user = useQuery(api.users.current);
  const userId = user?._id as Id<"users">;

  useEffect(() => {
    if (!user) return;
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

      video.addEventListener("play", draw);
    });
  }, [user]);

  // Function to create a peer connection for a given peer
  const createPeerConnection = (peerId: string) => {
    const pc = new RTCPeerConnection();

    // Capture pixel canvas stream
    const pixelStream = canvasRef.current!.captureStream(10);
    pixelStream.getTracks().forEach((track) => pc.addTrack(track, pixelStream));

    // Send ICE candidates via Convex
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        sendSignal({
          room,
          type: "candidate",
          data: e.candidate.toJSON(),
          receiverId: peerId,
        });
      }
    };

    // When receiving a track from peer
    pc.ontrack = (e) => {
      const remoteVideo = document.createElement("video");
      remoteVideo.srcObject = e.streams[0];
      remoteVideo.autoplay = true;
      remoteVideo.playsInline = true;
      remoteVideo.width = 320;
      remoteVideo.height = 240;
      document.body.appendChild(remoteVideo);
    };

    peerConnections.current.set(peerId, pc);
    return pc;
  };

  // Listen for incoming signals
  useEffect(() => {
    if (!signals) return;
    if (!userId) return;

    signals.forEach(async (signal) => {
      if (signal.senderId === userId) return;

      // Get or create a peer connection for this sender
      let pc = peerConnections.current.get(signal.senderId);
      if (!pc) {
        pc = createPeerConnection(signal.senderId);
      }

      if (signal.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendSignal({
          room,
          type: "answer",
          data: answer,
          receiverId: signal.senderId,
        });
      }

      if (signal.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
      }

      if (signal.type === "candidate") {
        await pc.addIceCandidate(new RTCIceCandidate(signal.data));
      }
    });
  }, [signals, userId]);

  // On joining — send offers to all peers (or have a joining trigger)
  const startConnectionWithPeer = async (peerId: string) => {
    let pc = peerConnections.current.get(peerId);
    if (!pc) {
      pc = createPeerConnection(peerId);
    }
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    sendSignal({
      room,
      type: "offer",
      data: offer,
      receiverId: peerId,
    });
  };

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} width={640} height={480} />
      {/* Later: Map over participant list and call startConnectionWithPeer(peerId) */}
    </div>
  );
}
