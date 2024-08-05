"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
export default function LandingPage() {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleJoinRoom = async () => {
    if (!name || !room) {
      toast.error("name or room section is empty");
      return;
    }
    try {
      const res = await axios.post("/api/user/signup", {
        userName: name,
        roomName: room,
      });
      console.log(res);
      localStorage.setItem("roomId", res.data.room.id);
      router.push(`/room/${room}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <main className="flex flex-col items-center justify-center w-full flex-1 p-20 text-center">
        <h1 className="text-6xl font-bold mb-10">Multiplayer Drawing Board</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="mb-4 p-2 border text-black"
        />
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room name"
          className="mb-4 p-2 border text-black"
        />
        <button onClick={handleJoinRoom} className="p-2 bg-blue-500 text-white">
          Join Room
        </button>
        <Toaster />
      </main>
    </div>
  );
}
