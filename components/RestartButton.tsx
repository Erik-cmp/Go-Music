import { IoMdRefresh } from "react-icons/io";

interface RestartButtonProps {
  onClick: () => void;
}

const RestartButton: React.FC<RestartButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="focus:outline-none">
      <IoMdRefresh size={25} className="text-white cursor-pointer hover:text-neutral-400 transition" />
    </button>
  );
};

export default RestartButton;