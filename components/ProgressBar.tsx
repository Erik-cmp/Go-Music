import { useState } from "react";

interface ProgressBarProps {
  songProgress: number;
  onSeek: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ songProgress, onSeek }) => {
  return (
    <div
      className="h-[75%] bg-blue-500"
      style={{
        width: `${songProgress}%`,
        transition: "width 0.1s ease-in-out",
      }}
    ></div>
  );
};

export default ProgressBar;
