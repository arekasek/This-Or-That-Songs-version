"use client";
import { ProgressLinear } from "@elvia/elvis-progress-linear/react";

export default function ProgressBarAnimated({ text, processed }) {
  return (
    <div className="w-full flex justify-center items-center gap-8 flex-col-reverse">
      <ProgressLinear size={"large"} value={processed}></ProgressLinear>
      {text}
    </div>
  );
}
