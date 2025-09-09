'use client';

import {
  RoomAudioRenderer,
  useTracks,
  RoomContext,
  VideoConference,
  LiveKitRoom,
} from '@livekit/components-react';
import { LocalParticipant, Room, RoomEvent, Track } from 'livekit-client';
import '@livekit/components-styles';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { createPixelatedVideoTrack, createUltraLowDataPixelTrack } from '@/lib/createPixelCam';
import { useRouter } from 'next/navigation';
import { usePromiseStore } from '@/hooks/usePromiseStore';
import { useShallow } from 'zustand/react/shallow';


export default function Cam({ room }: { room: string }) {
  console.log(room, " camroom")

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

      // Low simulcast layers for subscribers with even worse network conditions.
      videoSimulcastLayers: [
        {
          width: 160,
          height: 120,
          encoding: {
            maxBitrate: 50_000, // 50 kbps
            maxFramerate: 5,
          },
          resolution: {
            width: 160,
            height: 120,
          }
        },
      ],
    },
  })





  );
  const handleOnLeave = useCallback(() => router.push(`/${room}/pixelcam`), [router]);
  let token;
  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | null = null;

    (async () => {
      try {
        if (user?.name) {

          const res = await fetch(`/api/token?room=${room}&username=${user?.name}`);
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
        roomInstance.on(RoomEvent.Reconnected,()=>{
          console.log("reconnected")
          roomInstance.localParticipant.setCameraEnabled(true)}
        
        )
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
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
<>

      <VideoConference/>
  
</>
    // chatMessageFormatter={formatChatMessageLinks}
    // SettingsComponent={SHOW_SETTINGS_MENU ? SettingsMenu : undefined}
    
  )
}