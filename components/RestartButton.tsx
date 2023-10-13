import { IoMdRefresh } from "react-icons/io";

interface RestartButtonProps {
  onClick: () => void;
}

const RestartButton: React.FC<RestartButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="focus:outline-none">
      <IoMdRefresh size={25} className="text-neutral-400 cursor-pointer hover:text-white transition" />
    </button>
  );
};

export default RestartButton;