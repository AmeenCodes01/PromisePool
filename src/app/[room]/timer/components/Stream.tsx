"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import usePersistState from "@/hooks/usePersistState";
import React, { useState, useRef, useEffect } from "react";
import { OnProgressProps } from "react-player/base";
import ReactPlayer from "react-player/youtube";

const Stream = () => {
  const [url, setUrl] = usePersistState<string >(
    "https://youtu.be/eQHmKJh20_c?feature=shared","url"
  );

  const [showVid, setShowVid]= usePersistState(false,"showVid")
  const [pip, setPip] = useState(false);
  const [playing, setPlaying] = usePersistState(false,"playing");
  const [controls, setControls] = useState(false);
  const [light, setLight] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = usePersistState(0,"elapsed");
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [loop, setLoop] = useState(false);
  const [seeking, setSeeking] = useState(false);

  const playerRef = useRef(null);
  
  

  const handleStop = () => {
    setPlaying(false);
  };

  
  const handlePlay = () => setPlaying(true);
  const handlePause = () => setPlaying(false);
const handleSeekMouseUp = (val:number) => {
    setSeeking(false);
    // @ts-ignore
    playerRef?.current?.seekTo(val);
  };

  const handleProgress = (state:OnProgressProps) => {
    if (!seeking) {
      setPlayed(state.played);
      setLoaded(state.loaded);
    }
  };


 
  useEffect(() => {
 
    if(played !== 0){
     
      
      handleSeekMouseUp(played)
    }
    
    
    
  }, []);

  return (
    <div className={ showVid ?"flex flex-1    w-full h-full ":""}>
      {
        showVid ?
        <div className="w-full h-full flex ">
      { url !== "" ?
      <div className="flex flex-col gap-2 p-2 w-full">
          <ReactPlayer
            ref={playerRef}
            className="  h-[90%] w-full"
            width="100%"
            height="100%"
            url={url}
            // pip={pip}
            playing={playing}
            controls={true}
            // light={light}
            // loop={loop}
            // playbackRate={playbackRate}
            // volume={volume}
            muted={true}
            // onReady={() =>setPlaying(true)}
            //  onStart={() => console.log("onStart")}
            onPlay={handlePlay}
            onPause={handlePause}
            // onEnablePIP={() => setPip(true)}
            // onDisablePIP={() => setPip(false)}
            
            // onPlaybackRateChange={setPlaybackRate}
            // onSeek={(e) => console.log("onSeek", e)}
            onEnded={handleStop}
            
            // onError={(e) => console.log("onError", e)}
            onProgress={handleProgress}
            // onDuration={handleDuration}
            /> 
        <Button variant={"secondary"} onClick={()=>setUrl("")}>Change Video</Button>
            </div>
        :
        <div className="h-fit my-auto p-2 ">
        < Input value={url} onChange={(e)=> setUrl(e.target.value)} placeholder="paste in URL of youtube video" className="self-center mx-auto my-auto border-2 w-[50%]" />
        <span className="text-xs  italic">Click on "Share" button under the youtube video & copy that link here.</span>
        </div>
        }
        </div>

        :null
      }
        <Button
        variant={"outline"}
        onClick={()=>setShowVid(state=>!state)}
        className="absolute bottom-10 left-5"
      >
        
        {!showVid ? "Show ":"Hide "  } 
        
        Video</Button>

    </div>
    

        
  );
};

export default Stream;
