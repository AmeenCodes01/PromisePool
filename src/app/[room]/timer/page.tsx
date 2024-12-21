import SessionTimer from "./components/SessionTimer";

// hook gives all countdown functionality. handle end session/rat e session here.
function page() {
 
  return (
    <div className="w-full h-full flex justify-center items-center ">
      {/* Video */}
      <div>{/* Yt video embed, simple */}</div>
      {/* Timer */}
      <SessionTimer/>
   
    </div>
  );
}

export default page;
