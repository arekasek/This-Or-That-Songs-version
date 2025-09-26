"use client";
import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 cursor-glow"
      style={{
        background: `radial-gradient(200px circle at ${pos.x}px ${pos.y}px, rgba(0,255,128,0.1), transparent 50%)`,
        transition: "background 0.1s ease-out",
      }}
    />
  );
}
