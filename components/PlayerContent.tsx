"use client";

import { Song } from "@/types";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import {
  RxSpeakerOff,
  RxSpeakerQuiet,
  RxSpeakerModerate,
  RxSpeakerLoud,
} from "react-icons/rx";
import { FC, MouseEventHandler, useEffect, useState } from "react";
import { useVolume } from "@/contexts/VolumeContext";
// @ts-ignore
import useSound from "use-sound";

import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import ProgressBar from "./ProgressBar";
import { IoMdRefresh } from "react-icons/io";
import { IoMdShuffle } from "react-icons/io";
import { useShuffle } from "@/contexts/ShuffleContext";

import "./css/SeekBar.css";
import "./css/Animation.css";
import Header from "./Header";
import ListItem from "./ListItem";
interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const { volume, setVolume } = useVolume();
  const { shuffle, toggleShuffle } = useShuffle();

  const [prevVolume, setPrevVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songProgress, setSongProgress] = useState(0);
  const [seekValue, setSeekValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [isSongDetailVisible, setIsSongDetailVisible] = useState(false);
  const [isPlayNextEnabled, setIsPlayNextEnabled] = useState(true);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;

  const VolumeIcon =
    volume === 0
      ? RxSpeakerOff
      : volume >= 0 && volume <= 0.3
      ? RxSpeakerQuiet
      : volume > 0.3 && volume <= 0.6
      ? RxSpeakerModerate
      : RxSpeakerLoud;

  const onPlayNext = () => {
    if (shuffle) {
      const remainingSongs = player.ids.filter((id) => id !== player.activeId);

      if (remainingSongs.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingSongs.length);
        const nextSong = remainingSongs[randomIndex];
        player.setId(nextSong);
      }
    } else {
      const currentIndex = player.ids.findIndex((id) => id === player.activeId);
      const nextSong = player.ids[currentIndex + 1];

      if (!nextSong) {
        player.setId(player.ids[0]);
      } else {
        player.setId(nextSong);
      }
    }
  };

  const onPlayPrev = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  };

  const checkIfAtEnd = () => {
    const progress = sound?.seek() || 0;
    const duration = sound?.duration() || 0;
    // console.log(`${progress} >= ${duration - 0.2}`);
    if (progress >= duration - 0.2) {
      setIsAtEnd(true);
    } else {
      setIsAtEnd(false);
    }
  };

  const [play, { pause, sound }] = useSound(songUrl, {
    volume: volume,
    onplay: () => {
      // console.log("Song starts playing");
      setIsPlaying(true);
    },
    onend: () => {
      onPlayNext();
    },
    onpause: () => setIsPlaying(false),
    format: ["mp3"],
  });

  // console.log("sound:", sound);

  useEffect(() => {
    sound?.play();

    const updateProgress = () => {
      const progress = (sound?.seek() || 0) / sound?.duration() || 0;
      // console.log(progress);
      setSongProgress(progress * 100);
    };

    const interval = setInterval(updateProgress, 100);

    return () => {
      clearInterval(interval);
      sound?.unload();
    };
  }, [sound]);

  useEffect(() => {
    const interval = setInterval(checkIfAtEnd, 100);

    return () => {
      clearInterval(interval);
    };
  }, [sound]);

  useEffect(() => {
    setSeekValue(songProgress);
  }, [songProgress]);

  const handlePlay = () => {
    // console.log("handlePlay called!");
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
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsPart = Math.floor(seconds % 60);
    const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secondsStr = secondsPart < 10 ? `0${secondsPart}` : `${secondsPart}`;
    return `${minutesStr}:${secondsStr}`;
  };

  const handleSeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setSeekValue(value);
    const newTime = (value / 100) * (sound?.duration() || 0);
    sound?.seek(newTime);
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
    pause();
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
    play();
  };

  const handleToggleRepeat = () => {
    setRepeat((repeat) => !repeat);
  };

  useEffect(() => {
    // console.log(isAtEnd);
    // console.log(repeat);
    if (isAtEnd && repeat) {
      sound.seek(0);
    }
  }, [isAtEnd, repeat]);

  const showSongDetail = () => {
    setIsSongDetailVisible(true);
  };

  const hideSongDetail = () => {
    setIsSongDetailVisible(false);
  };

  const toggleShuffleMode = () => {
    toggleShuffle();
  };

  useEffect(() => {
    if (!sound) {
      return;
    }

    const checkIfAtEnd2 = () => {
      const progress = sound?.seek() || 0;
      const duration = sound?.duration() || 0;
      if (progress >= duration - 0.2) {
        onPlayNext();
      }
    };

    const interval = setInterval(checkIfAtEnd2, 150);

    return () => {
      clearInterval(interval);
    };
  }, [sound]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div
        className="
        flex
        w-full
        justify-start
      "
      >
        <div
          className="
          flex                  
          items-center                    
          gap-x-2                                   
        "
        >
          <div className="md:hidden">
            <div
              className="truncate max-w-[60vw] text-sm"
              onClick={showSongDetail}
            >
              <MediaItem data={song} />
            </div>
          </div>

          {/* TODO: Code song detail here */}
          <div
            className={`fixed top-0 left-0 flex flex-col items-center justify-center gap-y-4 w-full h-full z-10 ${
              isSongDetailVisible ? "slide-in" : "slide-out"
            }`}
            style={{
              background:
                "linear-gradient(to bottom, #1e3a8a 0%, #171717 35%, #171717 35%, #171717 100%)",
            }}
          >
            <button onClick={hideSongDetail}>Close</button>
          </div>

          <div className="hidden md:block">
            <div className="truncate max-w-[28vw] text-base">
              <MediaItem data={song} />
            </div>
          </div>

          <LikeButton songId={song.id} songTitle={song.title} />
        </div>
      </div>
      <div
        className="
        flex
        md:hidden
        col-auto
        w-full
        justify-end
        items-center
        gap-x-3
      "
      >
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
          "
        >
          <Icon size={24} className="text-black" />
        </div>
      </div>

      <div
        className="
        hidden
        h-full
        md:flex        
        flex-col
        justify-center
        items-center
        w-full
        max-w-[722px]
        gap-x-3        
      "
      >
        <div
          className="        
          md:flex        
          justify-center
          items-center
          w-full        
          gap-x-3  
          mb-1
        "
        >
          {/* Shuffle Button Here */}
          <button
            onClick={toggleShuffleMode}
            className={`transform transition ${
              shuffle
                ? "text-blue-500 hover:text-blue-400"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <IoMdShuffle size={18} />
          </button>
          <AiFillStepBackward
            onClick={onPlayPrev}
            size={24}
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
            <Icon size={30} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNext}
            size={24}
            className="
            text-neutral-400
            cursor-pointer
            hover:text-white
            transition
          "
          />
          <button onClick={handleToggleRepeat} className="rotate-90">
            <IoMdRefresh
              size={24}
              className={`transform transition ${
                repeat
                  ? "text-blue-500 hover:text-blue-400"
                  : "text-neutral-400 hover:text-white"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-end mr-4 gap-x-2">
          <div className="text-neutral-400 text-xs cursor-default">
            {formatTime(sound?.seek() || 0)}
          </div>
          <div className="flex items-center">
            <input
              type="range"
              value={seekValue}
              onChange={handleSeekChange}
              onMouseDown={handleSeekStart}
              onMouseUp={handleSeekEnd}
              min="0"
              max="100"
              step="1"
              className="seek-bar"
            />
          </div>
          <div className="text-neutral-400 text-xs cursor-default">
            {formatTime(sound?.duration() || 0)}
          </div>
        </div>
      </div>

      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            onClick={toggleMute}
            className="cursor-pointer text-white hover:opacity-75 transition"
            size={34}
          />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
      <div className="md:hidden w-full h-1 bg-black absolute bottom-0 left-0">
        <ProgressBar songProgress={songProgress} onSeek={handleSeekChange} />
      </div>
    </div>
  );
};

export default PlayerContent;
