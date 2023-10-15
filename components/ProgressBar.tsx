import { useState } from "react";

interface ProgressBarProps {
  songProgress: number;
  onSeek: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ songProgress, onSeek }) => {
  const [hovered, setHovered] = useState(false);

  const handleSeekChange = (value: number) => {
    const event = {
      target: {
        value: String(value),
      },
    } as React.ChangeEvent<HTMLInputElement>;
  
    onSeek(event);
  };

  return (
    <div
      className="w-full h-8 bg-black"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="h-full bg-blue-500"
        style={{ width: `${songProgress}%`, transition: "width 0.1s ease-in-out" }}
      ></div>
      {hovered && (
        <div style={{ position: "absolute", left: 0, right: 0 }}>
          <input type="range" value={songProgress} onChange={(e) => handleSeekChange(Number(e.target.value))} />
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
