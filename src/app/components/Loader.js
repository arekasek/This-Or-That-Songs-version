import React from "react";

export default function loader() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <img src="/loading-gif.gif" className="w-[250px]" />
    </div>
  );
}
