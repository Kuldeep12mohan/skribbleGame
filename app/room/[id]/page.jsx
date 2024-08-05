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
      <DrawingBoard room={room} />
    </div>
  );
};

export default Room;
