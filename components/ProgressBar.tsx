interface ProgressBarProps {
  songProgress: number;
  onSeek: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ songProgress, onSeek }) => {
  return (
    <div
      className="h-full bg-blue-500 z-20"
      style={{
        width: `${songProgress}%`,
        transition: "width 0.1s ease-in-out",
      }}
    >
    </div>
  );
};

export default ProgressBar;
