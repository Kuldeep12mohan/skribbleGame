"use client";
import { useParams } from "next/navigation";
import DrawingBoard from "@/components/DrawingBoard";

const Room = () => {
  const { id: room } = useParams();

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div> users</div>
      <DrawingBoard room={room} />
      <dir>chatting section</dir>
    </div>
  );
};

export default Room;
