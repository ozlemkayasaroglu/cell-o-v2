import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const avatars = [
  { id: 'unicorn', emoji: '🦄' },
  { id: 'butterfly', emoji: '🦋' },
  { id: 'ladybug', emoji: '🐞' },
  { id: 'bunny', emoji: '🐰' },
  { id: 'cat', emoji: '🐱' },
  { id: 'dog', emoji: '🐶' },
];

const ageGroups = [
  { id: '4-5', label: '4-5 yaş', emoji: '🫘' },
  { id: '6-7', label: '6-7 yaş', emoji: '🌱' },
  { id: '8-9', label: '8-9 yaş', emoji: '🌿' },
  { id: '10-12', label: '10-12 yaş', emoji: '🌳' },
];

const getDefaultNickname = (ageId: string) => {
  switch (ageId) {
    case '4-5':
      return 'Küçük Bilim İnsanı';
    case '6-7':
      return 'Meraklı Öğrenen';
    case '8-9':
      return 'Deney Sever';
    case '10-12':
      return 'Bilim Yolcusu';
    default:
      return 'Küçük Bilim İnsanı';
  }
};

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('unicorn');
  const [selectedAge, setSelectedAge] = useState('8-9');

  const handleContinue = () => {
    const profile = {
      nickname: nickname.trim() || getDefaultNickname(selectedAge),
      avatar: selectedAvatar,
      ageGroup: selectedAge,
      createdAt: new Date().toISOString(),
      totalPoints: 0,
      completedExperiments: [],
      badges: [],
      currentStreak: 0,
    };

    localStorage.setItem('user_profile', JSON.stringify(profile));
    localStorage.setItem('profile_completed', 'true');
    navigate('/');
  };

  const handleSkip = () => {
    const defaultProfile = {
      nickname: getDefaultNickname(selectedAge),
      avatar: selectedAvatar,
      ageGroup: selectedAge,
      createdAt: new Date().toISOString(),
      totalPoints: 0,
      completedExperiments: [],
      badges: [],
      currentStreak: 0,
    };

    localStorage.setItem('user_profile', JSON.stringify(defaultProfile));
    localStorage.setItem('profile_completed', 'true');
    navigate('/');
  };

  const selectedAvatarData = avatars.find((a) => a.id === selectedAvatar);

  return (
    <div className="min-h-screen bg-[#F8FEFB]">
      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-8 right-6 bg-white rounded-full px-4 py-1.5 shadow-sm z-10 flex items-center gap-1 hover:bg-gray-50 transition"
      >
        <span className="text-[#222] font-semibold text-[15px]">Atla</span>
        <span className="text-[#222] text-lg font-bold">›</span>
      </button>

      {/* Beautiful Header Section */}
      <div className="w-full bg-gradient-to-br from-[#E0F7F1] to-[#B8F0E8] rounded-b-[32px] overflow-hidden relative mb-8">
        <div className="max-w-2xl mx-auto px-6 pt-20 pb-16 text-center">
          {/* Icon Badge */}
          <div className="inline-flex items-center justify-center w-32 h-32 bg-[#14B8A6]/20 rounded-full mb-6">
            <span className="text-6xl">🥼</span>
          </div>

          {/* Title */}
          <h1 className="text-[32px] font-bold text-[#222] mb-4">
            Profilini Oluştur!
          </h1>

          {/* Description */}
          <p className="text-[17px] text-[#4B5563] leading-relaxed max-w-md mx-auto">
            Bilim yolculuğuna başlamadan önce kendini tanıtalım. Takma adını
            seç, avatarını belirle ve keşfetmeye hazır ol!
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-10 overflow-y-auto">
        {/* Nickname Input */}
        <div className="mb-6">
          <label className="block text-base text-[#222] font-semibold mb-3">
            Takma Adın
          </label>
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-[14px] border-2 border-gray-100 shadow-sm">
            <svg
              className="w-5 h-5 text-[#14B8A6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <input
              type="text"
              placeholder="Örn: Süper Kaşif"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              className="flex-1 outline-none text-base text-[#1F2937] placeholder:text-[#94A3B8]"
            />
          </div>
        </div>

        {/* Avatar Selection */}
        <div className="mb-6">
          <label className="block text-base text-[#222] font-semibold mb-3">
            Avatarını Seç
          </label>
          <div className="grid grid-cols-6 gap-[10px]">
            {avatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`relative aspect-square rounded-2xl flex items-center justify-center text-[40px] transition border-2 shadow-sm ${
                  selectedAvatar === avatar.id
                    ? 'bg-white border-[#F59E0B] border-[3px] shadow-md'
                    : 'bg-white border-gray-100'
                }`}
              >
                {avatar.emoji}
                {selectedAvatar === avatar.id && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center shadow-sm">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Age Group Selection */}
        <div className="mb-6">
          <label className="block text-base text-[#222] font-semibold mb-3">
            Yaş Grubun
          </label>
          <div className="grid grid-cols-2 gap-3">
            {ageGroups.map((age) => (
              <button
                key={age.id}
                onClick={() => setSelectedAge(age.id)}
                className={`py-4 rounded-2xl flex flex-col items-center transition border-[3px] shadow-sm ${
                  selectedAge === age.id
                    ? 'bg-white border-[#10B981] shadow-md'
                    : 'bg-white border-gray-100'
                }`}
              >
                <span className="text-[38px] mb-1">{age.emoji}</span>
                <span
                  className={`text-[13px] font-semibold ${
                    selectedAge === age.id ? 'text-[#1F2937]' : 'text-[#6B7280]'
                  }`}
                >
                  {age.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gradient-to-br from-[#14B8A6]/10 to-[#0D9488]/10 border-2 border-[#14B8A6]/30 rounded-[20px] p-4 text-center mb-6 shadow-sm">
          <div className="text-[64px] ">{selectedAvatarData?.emoji}</div>
          <h2 className="text-[22px] font-bold text-[#222] mb-1">
            {nickname.trim() || getDefaultNickname(selectedAge)}
          </h2>
          <p className="text-sm text-[#6B7280]">
            {ageGroups.find((a) => a.id === selectedAge)?.label}
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-[#14B8A6] text-white font-bold text-lg py-[18px] rounded-[32px] shadow-lg shadow-[#14B8A6]/20 hover:bg-[#0D9488] transition flex items-center justify-center gap-2"
        >
          <span>Hazırım!</span>
          <span className="text-xl">🚀</span>
        </button>

        {/* Privacy Note */}
        <p className="text-[13px] text-[#6B7280] text-center mt-4">
          🔒 Bilgilerin sadece bu cihazda saklanır
        </p>
      </div>
    </div>
  );
}
