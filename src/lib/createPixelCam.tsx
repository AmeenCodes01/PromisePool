"use client"
import { createLocalVideoTrack, LocalVideoTrack } from 'livekit-client';

export async function createPixelatedVideoTrack(
  pixelSize = 8,
  targetWidth = 160,  // Much smaller resolution for lower data
  targetHeight = 120,
  frameRate = 15      // Lower frame rate for less data
) {
  // 1. Capture the raw video stream with lower resolution
  
  const originalTrack = await createLocalVideoTrack({
    facingMode: 'user',
    resolution: { width: targetWidth, height: targetHeight },
    frameRate: frameRate,
  });

  const originalVideoElement = originalTrack.mediaStreamTrack;

  // 2. Create canvas for processing
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // 3. Create video element
  const video = document.createElement('video');
  video.srcObject = new MediaStream([originalVideoElement]);
  video.width = targetWidth;
  video.height = targetHeight;
  video.play();

  // 4. Wait for video to be ready
  await new Promise<void>((resolve) => {
    video.onloadedmetadata = () => resolve();
  });

  let animationId: number;
  
  const pixelateFrame = () => {
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      animationId = requestAnimationFrame(pixelateFrame);
      return;
    }

    // Clear canvas
    context.clearRect(0, 0, targetWidth, targetHeight);
    
    // Calculate pixelated dimensions
    const pixelatedWidth = Math.floor(targetWidth / pixelSize);
    const pixelatedHeight = Math.floor(targetHeight / pixelSize);
    
    // Draw video frame to canvas at original size
    context.drawImage(video, 0, 0, targetWidth, targetHeight);
    
    // Get image data and create pixelated version
    const imageData = context.getImageData(0, 0, targetWidth, targetHeight);
    const pixelatedImageData = context.createImageData(targetWidth, targetHeight);
    
    // Manual pixelation for better control
    for (let y = 0; y < targetHeight; y += pixelSize) {
      for (let x = 0; x < targetWidth; x += pixelSize) {
        // Get the color of the top-left pixel of each block
        const pixelIndex = (y * targetWidth + x) * 4;
        const r = imageData.data[pixelIndex];
        const g = imageData.data[pixelIndex + 1];
        const b = imageData.data[pixelIndex + 2];
        const a = imageData.data[pixelIndex + 3];
        
        // Fill the entire block with this color
        for (let dy = 0; dy < pixelSize && y + dy < targetHeight; dy++) {
          for (let dx = 0; dx < pixelSize && x + dx < targetWidth; dx++) {
            const blockPixelIndex = ((y + dy) * targetWidth + (x + dx)) * 4;
            pixelatedImageData.data[blockPixelIndex] = r;
            pixelatedImageData.data[blockPixelIndex + 1] = g;
            pixelatedImageData.data[blockPixelIndex + 2] = b;
            pixelatedImageData.data[blockPixelIndex + 3] = a;
          }
        }
      }
    }
    
    // Draw the pixelated image data back to canvas
    context.putImageData(pixelatedImageData, 0, 0);
    
    animationId = requestAnimationFrame(pixelateFrame);
  };
  
  // Start the animation loop
  pixelateFrame();

  // 5. Create stream from canvas with lower frame rate
  const canvasStream = canvas.captureStream(frameRate);
  const pixelatedVideoTrack = new LocalVideoTrack(canvasStream.getVideoTracks()[0]);
  
  // Clean up original track
  originalTrack.stop();
  
  // Return track with cleanup function
  const cleanup = () => {
    cancelAnimationFrame(animationId);
    video.srcObject = null;
    pixelatedVideoTrack.stop();
  };
  
  return { track: pixelatedVideoTrack, cleanup };
}

// Alternative version with even more aggressive data reduction
export async function createUltraLowDataPixelTrack(
  pixelSize = 16,
  targetWidth = 80,   // Very small resolution
  targetHeight = 60,
  frameRate = 10,     // Very low frame rate
  colorDepth = 16     // Reduce color depth
) {
  const originalTrack = await createLocalVideoTrack({
    facingMode: 'user',
    resolution: { width: targetWidth, height: targetHeight },
    frameRate: frameRate,
  });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const video = document.createElement('video');
  video.srcObject = new MediaStream([originalTrack.mediaStreamTrack]);
  video.width = targetWidth;
  video.height = targetHeight;
  video.play();

  await new Promise<void>((resolve) => {
    video.onloadedmetadata = () => resolve();
  });

  let animationId: number;
  
  const pixelateFrame = () => {
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      animationId = requestAnimationFrame(pixelateFrame);
      return;
    }

    context.clearRect(0, 0, targetWidth, targetHeight);
    context.drawImage(video, 0, 0, targetWidth, targetHeight);
    
    const imageData = context.getImageData(0, 0, targetWidth, targetHeight);
    
    // Ultra pixelation with color reduction
    for (let y = 0; y < targetHeight; y += pixelSize) {
      for (let x = 0; x < targetWidth; x += pixelSize) {
        const pixelIndex = (y * targetWidth + x) * 4;
        
        // Reduce color depth by rounding to nearest colorDepth value
        const r = Math.round(imageData.data[pixelIndex] / colorDepth) * colorDepth;
        const g = Math.round(imageData.data[pixelIndex + 1] / colorDepth) * colorDepth;
        const b = Math.round(imageData.data[pixelIndex + 2] / colorDepth) * colorDepth;
        
        // Fill block
        context.fillStyle = `rgb(${r}, ${g}, ${b})`;
        context.fillRect(x, y, pixelSize, pixelSize);
      }
    }
    
    animationId = requestAnimationFrame(pixelateFrame);
  };
  
  pixelateFrame();

  const canvasStream = canvas.captureStream(frameRate);
  const pixelatedVideoTrack = new LocalVideoTrack(canvasStream.getVideoTracks()[0]);
  
  originalTrack.stop();
  
  const cleanup = () => {
    cancelAnimationFrame(animationId);
    video.srcObject = null;
    pixelatedVideoTrack.stop();
  };
  
  return { track: pixelatedVideoTrack, cleanup };
}