"use client"
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function BuildAnimation() {
  const totalBricks = 10;
  const [brickCount, setBrickCount] = useState(0);
  const [avatarX, setAvatarX] = useState(0);
  const [movingToBricks, setMovingToBricks] = useState(false);

  const [frame, setFrame] = useState(0);
  const [row, setRow] = useState(0);
  const totalFrames = 8;
  const frameWidth = 64;
  const frameHeight = 60;
  const intervalRef = useRef(null);

  const startAnimation = (directionRow:number) => {
    setRow(directionRow);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setFrame((prev) => (prev + 1) % totalFrames);
    }, 120);
  };

  const stopAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (brickCount >= totalBricks) return;

    const interval = setInterval(() => {
      if (movingToBricks) {
        setAvatarX(0);
        startAnimation(0); // move to bricks
        setMovingToBricks(false);
      } else {
        setAvatarX(300);
        startAnimation(3); // move to house
        setMovingToBricks(true);
        setBrickCount((c) => c + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [brickCount, movingToBricks]);

  useEffect(() => {
    return () => stopAnimation();
  }, []);

  return (
    <div className="scene">
      <div className="bricks">
        {Array.from({ length: totalBricks - brickCount }).map((_, i) => (
          <img key={i} className="brick" src="/brick-1.png" />
        ))}
      </div>

      <div className="house">
        {Array.from({ length: brickCount }).map((_, i) => (
          <img key={i} className="brick" src="/brick-1.png" />
        ))}
      </div>

      <motion.div
        className="w-[64px] h-[60px] border-2 bg-[url(/walk.png)] absolute bottom-0"
        animate={{ x: avatarX }}
        transition={{ type: "tween", duration: 2 }}
        style={{
          backgroundPosition: `-${frame * frameWidth}px -${row * frameHeight}px`,
          backgroundRepeat: "no-repeat",
        }}
      />

      <style jsx>{`
        .scene {
          position: relative;
          width: 400px;
          height: 200px;
          overflow: hidden;
        }

        .bricks {
          position: absolute;
          left: 0;
          top: 50%;
          display: flex;
          flex-wrap: wrap;
          width: 80px;
        }

        .brick {
          width: 20px;
          height: 20px;
        }

        .house {
          position: absolute;
          right: 0;
          top: 50%;
          display: flex;
          flex-wrap: wrap;
          width: 80px;
        }
      `}</style>
    </div>
  );
}
