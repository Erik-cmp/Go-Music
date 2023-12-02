"use client";

import { useEffect, useRef, useState } from "react";
import { Playlist, Song } from "@/types";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { RiMenuAddFill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import {
  RxSpeakerOff,
  RxSpeakerQuiet,
  RxSpeakerModerate,
  RxSpeakerLoud,
  RxCaretDown,
} from "react-icons/rx";
import Vibrant from "node-vibrant";
// @ts-ignore
import useSound from "use-sound";

import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import ProgressBar from "./ProgressBar";
import { IoMdRefresh } from "react-icons/io";
import { IoMdShuffle } from "react-icons/io";
import { useVolume } from "@/contexts/VolumeContext";
import { useShuffle } from "@/contexts/ShuffleContext";
import { useSongDetail } from "@/contexts/SongDetailContext";

import "./css/SeekBar.css";
import "./css/Animation.css";
import Image from "next/image";
import useLoadImage from "@/hooks/useLoadImage";
import AddToPlaylist from "./AddToPlaylist";
import PlaylistItem from "./PlaylistItem";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";
import useAuthModal from "@/hooks/useAuthModal";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
interface PlayerContentProps {
  song: Song;
  songUrl: string;
  playlist: Playlist[];
}

const PlayerContent: React.FC<PlayerContentProps> = ({
  song,
  songUrl,
  playlist,
}) => {
  const player = usePlayer();
  const { volume, setVolume } = useVolume();
  const { shuffle, toggleShuffle } = useShuffle();
  const { isSongDetailVisible, setIsSongDetailVisible } = useSongDetail();

  const [prevVolume, setPrevVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songProgress, setSongProgress] = useState(0);
  const [seekValue, setSeekValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(
    "linear-gradient(to bottom, #1e3a8a 0%, #171717 75%, #171717 75%, #171717 100%)"
  );
  const [isAddPlaylistVisible, setIsAddPlaylistVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
  const AuthModal = useAuthModal();
  const [isMuted, setIsMuted] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;

  const VolumeIcon =
    volume === 0
      ? RxSpeakerOff
      : volume >= 0 && volume <= 0.3
      ? RxSpeakerQuiet
      : volume > 0.3 && volume <= 0.6
      ? RxSpeakerModerate
      : RxSpeakerLoud;

  const imagePath = useLoadImage(song);

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
    if (progress >= duration - 0.3) {
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
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
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
    if (isPlaying) {
      setIsSeeking(true);
      pause();
    }
  };

  const handleSeekEnd = () => {
    if (isSeeking) {
      setIsSeeking(false);
      play();
    }
  };

  const handleToggleRepeat = () => {
    setRepeat((repeat) => !repeat);
    setShowTooltip(false);
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

  const showAddPlaylist = () => {
    console.log("add playlist show called");
    setIsAddPlaylistVisible(true);
  };

  const hideAddPlaylist = () => {
    console.log("add playlist hide called");
    setIsAddPlaylistVisible(false);
  };

  const toggleShuffleMode = () => {
    toggleShuffle();
    setShowTooltip(false);
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

  useEffect(() => {
    let v = Vibrant.from(imagePath || "");
    v.getPalette().then((palette) =>
      setBackgroundColor(
        `linear-gradient(to bottom, ${palette.Vibrant?.hex} 0%, #171717 75%, #171717 75%, #171717 100%)`
      )
    );
  }, [imagePath]);

  const imageRef = useRef<HTMLDivElement | null>(null);

  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [swipeInProgress, setSwipeInProgress] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setLastTouchTime(new Date().getTime());
    setSwipeInProgress(true);
  };

  let timeout: any = null;

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX !== 0) {
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;
      if (!swipeInProgress && Math.abs(deltaX) > 50) {
        setSwipeInProgress(true);
      }
      if (swipeInProgress) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (deltaX > 50) {
            onPlayPrev();
            setSwipeInProgress(false);
          } else if (deltaX < -50) {
            onPlayNext();
            setSwipeInProgress(false);
          } else if (deltaY > 50) {
            hideSongDetail();
            setSwipeInProgress(false);
          }
        }, 100);
      }
    }
  };

  const handleTouchMove2 = (e: React.TouchEvent) => {
    if (touchStartX !== 0) {
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;
      if (!swipeInProgress && Math.abs(deltaX) > 50) {
        setSwipeInProgress(true);
      }
      if (swipeInProgress) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (deltaY > 50) {
            hideAddPlaylist();
            setSwipeInProgress(false);
          }
        }, 100);
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(0);
    setSwipeInProgress(false);
  };

  const handleTouchDoubleTap = () => {
    const currentTime = new Date().getTime();
    if (currentTime - lastTouchTime < 300) {
      handlePlay();
    }
    setLastTouchTime(currentTime);
  };

  function formatDate(dateString: any) {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      // @ts-ignore
      options
    );
    return formattedDate;
  }

  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    const delay = setTimeout(() => {
      setShowTooltip(true);
    }, 300);

    setShowTooltipTimeout(delay as any);
  };

  const handleMouseLeave = () => {
    if (showTooltipTimeout) {
      clearTimeout(showTooltipTimeout);
    }
    setShowTooltip(false);
  };

  const [showTooltipTimeout, setShowTooltipTimeout] = useState(null);

  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

  const handleRightClick = (e: any) => {
    e.preventDefault();

    if (!user) {
      return AuthModal.onOpen();
    }

    setShowAddToPlaylist(true);
  };

  const handleMouseLeave2 = () => {
    setShowAddToPlaylist(false);
  };

  const addSongToPlaylist = async (playlist: Playlist, song: Song) => {
    try {
      setIsLoading(true);

      const existingRecord = await supabaseClient
        .from("playlists_song")
        .select("id")
        .eq("playlist_id", playlist.id)
        .eq("song_id", song.id)
        .single();

      console.log(existingRecord);

      if (existingRecord.data) {
        toast.error(`${song.title} is already in ${playlist.title}!`);
        return;
      }

      const id = uniqid();

      const { error } = await supabaseClient.from("playlists_song").upsert([
        {
          id,
          user_id: user?.id,
          playlist_id: playlist.id,
          song_id: song.id,
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success(`${song.title} added to ${playlist.title}!`);
    } catch (error) {
      console.error(error);
      toast.error("Whoops, something went wrong...");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
      <div
        className="
        flex
        w-full
        justify-between        
      "
      >
        <div
          className="
          flex                  
          items-center                    
          gap-x-2                      
        "
        >
          <div className="md:hidden w-[76vw] z-10" onClick={showSongDetail}>
            <div className="truncate text-sm">
              <MediaItem data={song} variant="2" />
            </div>
          </div>

          {/* MOBILE SONG DETAIL START */}
          <div
            className={`fixed top-0 left-0 flex flex-col items-center justify-center gap-y-4 w-full h-full z-10 ${
              isSongDetailVisible ? "slide-in" : "slide-out"
            }`}
            style={{ background: backgroundColor }}
          >
            <div className="fixed top-0 left-0 p-4 z-10 flex justify-between w-full">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <RxCaretDown
                  onClick={hideSongDetail}
                  className="text-white"
                  size={34}
                ></RxCaretDown>
              </div>
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <RiMenuAddFill
                  className="text-white"
                  size={18}
                  onClick={showAddPlaylist}
                ></RiMenuAddFill>
              </div>
            </div>
            <div
              className="
            flex
            flex-col 
            w-[82vw]
            h-[82vh]            
            pt-12
            "
            >
              <div
                className="relative w-[80vw] aspect-square"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchStartCapture={handleTouchDoubleTap}
              >
                <Image
                  // @ts-ignore
                  ref={imageRef}
                  className="object-fill rounded-lg"
                  src={imagePath || "/images/liked.png"}
                  layout="fill"
                  alt="Image"
                />
              </div>
              <div
                className="
                flex
                justify-between
                items-center
                pt-6
                "
              >
                <div className="flex flex-col">
                  <div className="marquee-container max-w-[68vw]">
                    <p
                      className={`text-white text-xl font-semibold ${
                        song.title.length > 27 ? "marquee-text" : ""
                      }`}
                    >
                      {song.title}
                    </p>
                  </div>
                  <p className="text-neutral-400">{song.author}</p>
                </div>
                <div>
                  <LikeButton
                    songId={song.id}
                    songTitle={song.title}
                    size={36}
                    variant={1}
                    hasTooltip={false}
                  />
                </div>
              </div>
              <div className="flex items-center pt-6">
                <input
                  type="range"
                  value={seekValue}
                  onChange={handleSeekChange}
                  onTouchStart={handleSeekStart}
                  onTouchEnd={handleSeekEnd}
                  min="0"
                  max="100"
                  step="0.1"
                  className="seek-bar"
                />
              </div>
              <div className="flex justify-between pt-4">
                <div className="text-neutral-400 text-xs cursor-default">
                  {formatTime(sound?.seek() || 0)}
                </div>
                <div className="text-neutral-400 text-xs cursor-default">
                  {formatTime(sound?.duration() || 0)}
                </div>
              </div>
              <div
                className=" 
                  flex               
                  justify-between
                  items-center
                  w-full        
                  gap-x-2                                                 
                "
              >
                <button
                  onClick={toggleShuffleMode}
                  className={`transform transition ${
                    shuffle ? "text-blue-500" : "text-neutral-400"
                  }`}
                >
                  <IoMdShuffle size={25} />
                </button>
                <div className="flex items-center gap-x-[7vw] res">
                  <AiFillStepBackward
                    onClick={onPlayPrev}
                    size={36}
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
                    h-16
                    w-16
                    rounded-full
                    bg-white
                    p-1
                    cursor-pointer
                    hover:scale-110
                    transform             
                  "
                  >
                    <Icon size={40} className="text-black" />
                  </div>
                  <AiFillStepForward
                    onClick={onPlayNext}
                    size={36}
                    className="
                    text-neutral-400
                    cursor-pointer
                    hover:text-white
                    transition                    
                  "
                  />
                </div>
                <button onClick={handleToggleRepeat} className="rotate-90">
                  <IoMdRefresh
                    size={32}
                    className={`transform transition ${
                      repeat ? "text-blue-500" : "text-neutral-400"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* MOBILE SONG DETAIL END */}

          {/* ADD PLAYLIST OVERLAY FOR MOBILE */}
          <div
            className={`fixed top-0 left-0 flex flex-col items-start justify-start gap-y-4 w-full h-full z-10 bg-neutral-900 ${
              isAddPlaylistVisible ? "slide-in" : "slide-out"
            }`}
          >
            <div
              className="flex flex-col items-center justify-center gap-x-2 w-full pt-4 lg:hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove2}
              onTouchEnd={handleTouchEnd}
            >
              <div className="md:block hidden w-full cursor-pointer">
                <div className="flex justify-end w-full px-2">
                  <div className="flex w-8 h-8 rounded-full bg-black hover:opacity-75 transition items-center justify-center">
                    <IoIosClose
                      onClick={hideAddPlaylist}
                      className="text-white"
                      size={34}
                    ></IoIosClose>
                  </div>
                </div>
              </div>
              <div className="w-8 h-1 bg-neutral-600 rounded-full mb-4 md:hidden block"></div>
              <div className="flex items-start flex-col w-full p-2">
                <MediaItem data={song} variant="1" />
                <p className="text-xs px-2 text-neutral-400 flex w-full justify-end">
                  Uploaded {formatDate(song.created_at)}
                </p>
              </div>
              <div className="w-full h-[1px] bg-neutral-800"></div>
            </div>
            <div className="scrollable-content w-full">
              <div className="lg:flex justify-end w-full px-2 hidden cursor-pointer">
                <div className="flex w-10 h-10 rounded-full bg-black hover:opacity-75 transition items-end justify-center">
                  <IoIosClose
                    onClick={hideAddPlaylist}
                    className="text-white"
                    size={40}
                  ></IoIosClose>
                </div>
              </div>
              <div className="flex flex-col w-full px-4 pb-2 gap-y-2">
                {user ? (
                  <>
                    {playlist.length > 0 ? (
                      <div className="flex flex-col w-full items-center justify-center">
                        <h1 className="text-lg w-full lg:hidden block">
                          Add <span className="font-bold">{song.title}</span> to
                          Playlist:
                        </h1>
                      </div>
                    ) : (
                      <div className="text-neutral-400 flex justify-center lg:text-base text-xs w-full p-2">
                        <p>You have no playlists. Create one to add songs!</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-neutral-400 flex justify-center lg:text-base text-xs w-full p-2">
                    <p>
                      You need to be logged in to view and create playlists!
                    </p>
                  </div>
                )}
              </div>
              <div className="w-full px-2 grid grid-cols-1 lg:hidden">
                {playlist.map((playlist) => (
                  <div
                    className="w-full"
                    key={playlist.id}
                    onClick={() => addSongToPlaylist(playlist, song)}
                  >
                    <PlaylistItem
                      data={playlist}
                      href={playlist.id}
                      key={playlist.id}
                      variant="2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div
              className="truncate max-w-[28vw] lg:max-w-[20vw] text-base"
              onContextMenu={handleRightClick}
              onMouseLeave={handleMouseLeave2}
            >
              <MediaItem data={song} variant="3" />

              {showAddToPlaylist && (
                <div className="fixed z-10 bottom-[60px] left-10">
                  <AddToPlaylist playlist={playlist} song={song} />
                </div>
              )}
            </div>
          </div>
          <div className="hidden lg:block">
            <LikeButton
              songId={song.id}
              songTitle={song.title}
              size={28}
              variant={1}
              hasTooltip={true}
            />
          </div>
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
          className="
            flex
            items-center
            justify-center
            rounded-full
            p-1
            cursor-pointer      
            gap-x-2                  
          "
        >
          <LikeButton
            songId={song.id}
            songTitle={song.title}
            size={28}
            variant={1}
            hasTooltip={false}
          />
          <Icon size={34} className="text-white" onClick={handlePlay} />
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
        gap-x-3       
        lg:gap-x-0 
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
          <Tippy
            content={
              <div style={{ fontWeight: "600" }}>
                {shuffle ? "Disable Shuffle" : "Enable Shuffle"}
              </div>
            }
            delay={[100, 0]}
            touch={false}
          >
            <button
              onClick={toggleShuffleMode}
              className="relative group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <IoMdShuffle
                size={18}
                className={`transform transition ${
                  shuffle
                    ? "text-blue-500 hover:text-blue-400"
                    : "text-neutral-400 hover:text-white"
                }`}
              />
            </button>
          </Tippy>
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
            h-9
            w-9
            rounded-full
            bg-blue-500
            p-1
            cursor-pointer
            hover:scale-110
            transform             
          "
          >
            <Icon size={28} className="text-black" />
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
          <Tippy
            content={
              <div style={{ fontWeight: "600" }}>
                {repeat ? "Disable Repeat" : "Enable Repeat"}
              </div>
            }
            delay={[100, 0]}
            touch={false}
          >
            <button
              onClick={handleToggleRepeat}
              className="relative group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <IoMdRefresh
                size={24}
                className={`transform transition rotate-90 ${
                  repeat
                    ? "text-blue-500 hover:text-blue-400"
                    : "text-neutral-400 hover:text-white"
                }`}
              />
            </button>
          </Tippy>
        </div>

        <div className="flex items-center justify-center mr-4 gap-x-2">
          <div className="text-neutral-400 text-xs cursor-default flex items-center w-[32px]">
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
              step="0.1"
              className="seek-bar"
            />
          </div>
          <div className="text-neutral-400 text-xs cursor-default flex items-center w-[32px]">
            {formatTime(sound?.duration() || 0)}
          </div>
        </div>
      </div>

      <div className="hidden md:flex w-full justify-end gap-x-4">
        <div className="flex items-center gap-x-2">
          <div className="lg:hidden items-center justify-center flex">
            <LikeButton
              songId={song.id}
              songTitle={song.title}
              size={28}
              variant={1}
              hasTooltip={true}
            />
          </div>
          <Tippy
            content={<div style={{ fontWeight: "600" }}>Add to Playlist</div>}
            delay={[100, 0]}
            touch={false}
          >
            <div>
              <RiMenuAddFill
                className="text-white hover:opacity-75 transition cursor-pointer"
                size={22}
                onClick={() => setPopupOpen(true)}
              />

              {isPopupOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-75 bg-black backdrop-blur z-10">
                  <div className="bg-neutral-800 rounded-md p-2 border border-neutral-700 max-h-[60vh] w-[400px] scrollable-content">
                    <div className="flex justify-end w-full">
                      <div className="flex items-center justify-center cursor-pointer">
                        <IoIosClose
                          onClick={() => setPopupOpen(false)}
                          className="text-neutral-400 hover:text-white"
                          size={24}
                        />
                      </div>
                    </div>
                    {user ? (
                      <>
                        {playlist.length > 0 ? (
                          <div className="flex flex-col w-full items-center justify-center">
                            <h1 className="text-xl w-full text-center pt-2 pb-4 px-4">
                              Add{" "}
                              <span className="font-bold">{song.title}</span> to
                              Playlist:
                            </h1>
                          </div>
                        ) : (
                          <div className="text-neutral-400 flex justify-center items-center text-center text-lg w-full h-[50vh] p-3">
                            <p>
                              You have no playlists. Create one to add songs!
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-neutral-400 flex justify-center items-center w-full text-center text-lg h-[50vh] p-3">
                        <p>
                          You need to be logged in to view and create playlists!
                        </p>
                      </div>
                    )}
                    <div className="w-full grid grid-cols-1">
                      {playlist.map((playlist) => (
                        <Tippy
                          content={
                            <div>
                              <p style={{ fontSize: "1rem" }}>
                                {playlist.title}
                              </p>
                              <p
                                style={{
                                  fontSize: "0.875rem",
                                  color: "#a3a3a3",
                                }}
                              >
                                Created {formatDate(playlist.created_at)}
                              </p>
                            </div>
                          }
                          placement="right"
                          delay={[300, 0]}
                          key={playlist.id}
                          touch={false}
                        >
                          <div
                            className="w-full transition"
                            key={playlist.id}
                            onClick={() => addSongToPlaylist(playlist, song)}
                          >
                            <PlaylistItem
                              data={playlist}
                              href={playlist.id}
                              key={playlist.id}
                              variant="3"
                            />
                          </div>
                        </Tippy>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Tippy>
        </div>
        <div className="flex items-center gap-x-2 w-[120px]">
          <Tippy
            content={
              <div style={{ fontWeight: "600" }}>
                {isMuted ? "Unmute" : "Mute"}
              </div>
            }
            delay={[100, 0]}
            touch={false}
          >
            <div>
              <VolumeIcon
                onClick={toggleMute}
                className="cursor-pointer text-white hover:opacity-75 transition"
                size={22}
              />
            </div>
          </Tippy>
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
      <div className="md:hidden w-full h-0.5 absolute bottom-0 left-0 flex items-end">
        <ProgressBar songProgress={songProgress} onSeek={handleSeekChange} />
      </div>
    </div>
  );
};

export default PlayerContent;
