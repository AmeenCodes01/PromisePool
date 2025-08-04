
// This file defines a Next.js API route for the App Router.
// It allows you to securely terminate a LiveKit room from a client-side request.

import {
  RoomServiceClient
} from 'livekit-server-sdk';
import {
  NextRequest,
  NextResponse
} from 'next/server';

 
// Replace these with your actual LiveKit server credentials.
// It's best practice to store these as environment variables.
const livekitHost = process.env.NEXT_PUBLIC_LIVEKIT_URL; 
const apiKey = process.env.LIVEKIT_API_KEY || 'YOUR_API_KEY';
const apiSecret = process.env.LIVEKIT_API_SECRET || 'YOUR_API_SECRET';

// Create a RoomServiceClient instance to interact with the LiveKit server API.
const svc = new RoomServiceClient(livekitHost as string, apiKey, apiSecret);
console.log(svc)
/**
 * Handles POST requests to the API route.
 * @param {Request} request The incoming request object.
 */
export async function POST(request:NextRequest) {
  try {
    // Extract the room name from the request body.
    // The request body should be a JSON object like: { "roomName": "my-room" }
    const {
      roomName
    } = await request.json();

    if (!roomName) {
      return NextResponse.json({
        error: 'Room name is required'
      }, {
        status: 400
      });
    }

    console.log(`Attempting to terminate room: ${roomName}`);

    // Call the deleteRoom method to forcibly disconnect all participants
    // and delete the room from the server.
    await svc.deleteRoom(roomName);

    console.log(`Successfully terminated room: ${roomName}`);

    // Respond with a success message.
    return NextResponse.json({
      message: `Successfully terminated room: ${roomName}`
    }, {
      status: 200
    });
  } catch (error) {
    console.error(`Error terminating room:`, error);
    // Respond with a detailed error message in case of failure.
    return NextResponse.json({
      error: `Failed to terminate room`
    }, {
      status: 500
    });
  }
}
