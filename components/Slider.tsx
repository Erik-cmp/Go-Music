import * as RadixSlider from "@radix-ui/react-slider";
import { useState } from 'react';

interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  value = 1,
  onChange
}) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  }

  const [isHovered, setIsHovered] = useState(false);
  
  const circlePosition = (value * 100) - 6;

  return (
    <RadixSlider.Root
      className="
        relative
        flex
        items-center
        select-none
        touch-none
        w-full
        h-8      
      "
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleChange}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}        
      max={1}
      step={0.01}
      aria-label="Volume"
    >
      <RadixSlider.Track
        className="
          bg-neutral-600
          relative
          grow
          rounded-full
          h-[4px]
        "
      >
        <RadixSlider.Range
          className={`
            absolute
            rounded-full
            h-full
            transition            
            ${isHovered ? 'bg-blue-500' : 'bg-white'}
          `}
        />
        {isHovered && (
          <div
            className="
              w-3
              h-3
              bg-white
              rounded-full
              absolute
              top-1/2
              transform -translate-y-1/2
              transition
            "
            style={{ left: `${circlePosition}%` }}
          ></div>
        )}
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
}

export default Slider;
