"use client"

import { Song } from "@/types";
import { BsPauseFill, BsPlayFill } from "react-icons/bs"
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2"
import { useEffect, useState } from "react"
import { useVolume } from '@/contexts/VolumeContext';
// @ts-ignore
import useSound from "use-sound";

import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import { BiRefresh } from "react-icons/bi";
import { IoMdRefresh } from "react-icons/io";
import RestartButton from "./RestartButton";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
  song,
  songUrl
}) => {
  const player = usePlayer();  
  const { volume, setVolume } = useVolume();
  const [prevVolume, setPrevVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songProgress, setSongProgress] = useState(0);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave

  const onPlayNext = () => {
    if(player.ids.length === 0){
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId)
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong){
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  }

  const onPlayPrev = () => {
    if(player.ids.length === 0){
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId)
    const prevSong = player.ids[currentIndex - 1];

    if (!prevSong){
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(prevSong);
  }  

  const [play, { pause, sound }] = useSound(
    songUrl,
    {
      volume: volume,      
      onplay: () => {
        console.log('Song starts playing');
        setIsPlaying(true);
      },
      onend: () => {
        setIsPlaying(false);
        onPlayNext();
      },
      onpause: () => setIsPlaying(false),
      format: ['mp3']
    }
  );

  console.log('sound:', sound);

  useEffect(() => {    
    sound?.play();

    const updateProgress = () => {
      const progress = (sound?.seek() || 0) / sound?.duration() || 0;
      console.log(progress)
      setSongProgress(progress * 100);
    };

    const interval = setInterval(updateProgress, 100);    
    
    return () => {
      clearInterval(interval);
      sound?.unload();
    }
  }, [sound]);

  const handlePlay = () => {
    console.log('isPlaying:', isPlaying);
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  const toggleMute = () => {
    if (volume === 0) {      
      setVolume(prevVolume);
    } else {      
      setPrevVolume(volume);
      setVolume(0);
    }
  }

  const handleRestart = () => {
    if(!isPlaying){
      play();       
    }
    sound.seek(0);    
  };

  return (  
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div className="
        flex
        w-full
        justify-start
      ">
        <div className="
          flex                  
          items-center                    
          gap-x-2                                   
        ">
          <div className="truncate max-w-[60vw] md:max-w-[28vw] text-sm md:text-base min-w-[60vw]">
            <MediaItem data={song} />
          </div>
          <LikeButton songId={song.id} songTitle={song.title} />            
          <RestartButton onClick={handleRestart} />                      
        </div>
      </div>
      <div className="
        flex
        md:hidden
        col-auto
        w-full
        justify-end
        items-center
        gap-x-3
      ">     
        <div
          onClick={handlePlay}
          className="
            h-10
            w-10
            flex
            items-center
            justify-center
            rounded-full
            bg-blue-500
            p-1
            cursor-pointer
          ">
          <Icon size={30} className="text-black" />
        </div>
      </div>

      <div className="
        hidden
        h-full
        md:flex
        justify-center
        items-center
        w-full
        max-w-[722px]
        gap-x-3
      ">
        <AiFillStepBackward 
          onClick={onPlayPrev}
          size={30}
          className="
            text-neutral-400
            cursor-pointer
            hover:text-white
            transition
          "
        />
        <div
          onClick={handlePlay}
          className="
            flex
            items-center
            justify-center
            h-10
            w-10
            rounded-full
            bg-blue-500
            p-1
            cursor-pointer
            hover:scale-110
            transform 
          "
        >
          <Icon size={30} className="text-black"/>
        </div>   
        <AiFillStepForward 
          onClick={onPlayNext}
          size={30}
          className="
            text-neutral-400
            cursor-pointer
            hover:text-white
            transition
          "
        />             
      </div>

      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon 
            onClick={toggleMute}
            className="cursor-pointer"
            size={34}
          />
          <Slider 
            value={volume}
            onChange={(value) => setVolume(value)}
          />
        </div>        
      </div>
      <div className="w-full h-1 bg-blue-500 absolute bottom-0 left-0" style={{ width: `${songProgress}%`, transition: "width 0.1s ease-in-out" }}></div>      
    </div>
  );
}
 
export default PlayerContent;