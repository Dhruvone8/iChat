import React, { useState, useRef, useEffect } from 'react'
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

const ProfileHeader = () => {

  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Img = reader.result;
      setSelectedImg(base64Img);
      await updateProfile({ profilePic: base64Img });
    };
  }

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar avatar-online">
            <button className="size-14 rounded-full overflow-hidden relative group cursor-pointer"
              onClick={() => fileInputRef.current.click()}>
              <img src={selectedImg || authUser.profilePic || '/avatar.png'} alt="User Image" className="size-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
              transition-opacity flex items-center justify-center">
              </div>
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
          </div>

          {/* UserName & Online Text */}
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser.fullName}
            </h3>
            <p className="text-xs text-slate-400">Online</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 items-center">
          {/* Logout Button */}
          <button className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" onClick={logout}>
            <LogOutIcon className="size-5" />
          </button>
          {/* Sound Toggle Button */}
          <button className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}>
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader