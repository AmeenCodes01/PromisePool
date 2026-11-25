'use client';

import {
  RoomAudioRenderer,
  useTracks,
  RoomContext,
  GridLayout,
  ParticipantTile,
  ControlBar,
  LiveKitRoom,
} from '@livekit/components-react';
import { AudioPresets, LocalParticipant, Room, RoomEvent, Track } from 'livekit-client';
import '@livekit/components-styles';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useRouter } from 'next/navigation';
import { usePromiseStore } from '@/hooks/usePromiseStore';
import { useShallow } from 'zustand/react/shallow';


export default function Cam({ roomId }: { roomId: string }) {
  console.log(roomId, " camroom")

  const {
      // workMin,
      // setWorkMin,
      // setBreakMin,
      // mode,
      // groupSesh,
      // setGroupSesh,
      // goal,
      // setSecLeft,
      // setGoalOpen,
      // onSoloReset,
      // setPause,
      secLeft,
      recoverInterval,
      onPause,
      pause
    } = usePromiseStore(
      useShallow((state) => ({
        // workMin: state.workMin,
        // setWorkMin: state.setWorkMin,
        secLeft: state.secLeft,
        onPause:state.onPause,
        pause: state.pause,

  
        // setBreakMin: state.setBreakMin,
        // mode: state.mode,
        // groupSesh: state.groupSesh,
        // setGroupSesh: state.setGroupSesh,
        // goal: state.goal,
        // setSecLeft: state.setSecLeft,
        // setGoalOpen: state.setGoalOpen,
        // setPause: state.setPause,
        // onSoloReset: state.onSoloReset,
        
      recoverInterval: state.recoverInterval
      }))
    );
  
  
    useEffect(() => {
      console.log("store hydratted");
      usePromiseStore.persist.rehydrate();
        recoverInterval()
    }, []);
  
  console.log(secLeft, " secLeft")
  const router = useRouter()
  // TODO: get user input for room and name
  const user = useQuery(api.users.current)
  const [roomInstance] = useState(() => new Room({
    // Only receive the resolution the tile actually shows; stop sending layers nobody watches.
    adaptiveStream: true,
    dynacast: true,
    // Video capture defaults: The settings for the video track we create.
    videoCaptureDefaults: {
      resolution: {

        width: 320,
        height: 240,
        frameRate: 10,
        // A low frame rate reduces the number of frames per second to encode.
      }
      // A low resolution is the most impactful change for data reduction.
    },

    // Publish defaults: The settings for how the video is encoded and sent.
    publishDefaults: {
      // A very low max bitrate to ensure minimal data is sent.
      videoEncoding: {
        maxBitrate: 150_000, // 150 kbps
        maxFramerate: 10,
      },

      // One small stream is enough for 3-4 people; simulcast would upload a second copy.
      simulcast: false,
      // Opus at speech bitrate; DTX sends nothing while silent; RED would double audio data.
      audioPreset: AudioPresets.speech,
      dtx: true,
      red: false,
    },
  })





  );
  const handleOnLeave = useCallback(() => router.push(`/${roomId}/pixelcam`), [router]);
  let token;
  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | null = null;

    (async () => {
      try {
        if (user?.name) {

          const res = await fetch(`/api/token?room=${roomId}&username=${user?.name}`);
          const data = await res.json();
          console.log(data.token, " token")
          if (!mounted) return;

          if (data.token) {
            // Create the pixelated video track
            // const { track: localVideoTrack, cleanup: videoCleanup } = await createUltraLowDataPixelTrack(16);
            // cleanup = videoCleanup;

            //console.log(localVideoTrack, " localPixelTrack");

            // Connect to the room first
            console.log("room connecting")
            await roomInstance.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL as string, data.token);

            // IMPORTANT: Publish the pixelated track (uncomment this line!)
            //  const publication = await roomInstance.localParticipant.publishTrack(localVideoTrack);
            //console.log(publication," publication")

            // Optional: Disable the default camera track to ensure only pixelated video is sent
            // This prevents LiveKit from automatically publishing the regular camera

            //await roomInstance.localParticipant.setCameraEnabled(true);
          }
          token = data.token;
        }

        roomInstance.on(RoomEvent.Disconnected, handleOnLeave);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      mounted = false;
      // Clean up the pixelated video processing
      // if (cleanup) {
      //   cleanup();
      // }
      roomInstance.off(RoomEvent.Disconnected, handleOnLeave);
      roomInstance.disconnect();
    };
  }, [roomInstance, user]);

  console.log(token, " token")


  if (token === '') {
    return <div>Getting token...</div>;
  }


  const hours = Math.floor(Math.floor(secLeft / 60) / 60);

  const minutes =
    hours > 0
      ? Math.floor(secLeft / 60 - hours * 60)
      : Math.floor(secLeft / 60);
  const seconds = Math.floor(secLeft % 60);


  return (
    <RoomContext.Provider value={roomInstance} >


      <div data-lk-theme="default" style={{ height: '100%' }}>
  <div className=" flex ">
            {hours !== 0 && (
              <span className=" text-lg font-mono">
                {hours < 10 ? "0" + hours : hours}:
              </span>
            )}
            <span className="text-lg  font-mono ">
              {minutes < 10 ? "0" + minutes : minutes}:
            </span>
            <span className=" text-lg font-mono">
              {seconds < 10 ? "0" + seconds : seconds}
            </span>
          </div>
        
        {/* Your custom component with basic video conferencing functionality. */}
        <MyVideoConference />
        {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
        <RoomAudioRenderer />
        {/* Controls for the user to start/stop audio, video, and screen share tracks */}
        {/* <ControlBar /> */}
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference() {
  // Camera tiles only: screen share is left out on purpose, it costs far more data than the 150 kbps camera.
  const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }]);
  return (
    <>
      <GridLayout tracks={tracks} style={{ height: 'calc(100% - 60px)' }}>
        <ParticipantTile />
      </GridLayout>
      <ControlBar controls={{ screenShare: false, chat: false, settings: false }} />
    </>
  );
}
