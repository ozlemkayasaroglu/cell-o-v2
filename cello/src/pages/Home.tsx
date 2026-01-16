import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";

export default function Home() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const { currentExperiment, progress, loading } = useWeeklyExperiment();

  useEffect(() => {
    const profileData = localStorage.getItem("user_profile");
    if (profileData) {
      setProfile(JSON.parse(profileData));
    }
  }, []);

  useEffect(() => {}, [currentExperiment, progress, loading, profile]);

  const avatarEmojiMap: Record<string, string> = {
    unicorn: "🦄",
    butterfly: "🦋",
    ladybug: "🐞",
    bunny: "🐰",
    cat: "🐱",
    dog: "🐶",
  };

  const ageDefaultTitles: Record<string, string> = {
    "4-5": "Küçük Bilim İnsanı",
    "6-7": "Meraklı Öğrenen",
    "8-9": "Deney Sever",
    "10-12": "Bilim Yolcusu",
  };

  return (
    <div className="min-h-screen bg-[#F8FEFB]">
      {/* Header */}
      <div className="relative bg-[#0D9488] px-6 pt-[60px] pb-10 mb-[30px] overflow-hidden">
        <div className="max-w-2xl mx-auto">
          <div className="relative z-10 flex flex-col items-center">
            {/* Icon Container with Float Animation */}
            <div className="w-[100px] h-[100px] bg-white/20 rounded-full flex items-center justify-center mb-4 relative animate-float">
              <span className="text-[52px]">
                {profile ? avatarEmojiMap[profile.avatar] || "🔬" : "🔬"}
              </span>
              <div className="absolute top-[5px] right-[5px] animate-pulse">
                <Sparkles size={20} color="#FFD700" />
              </div>
            </div>

            <h1 className="text-[28px] font-bold text-white mb-1">
              {profile?.nickname || "Küçük Bilim İnsanı"}
            </h1>
            <p className="text-[15px] text-white/90">
              {profile
                ? ageDefaultTitles[profile.ageGroup] || "Küçük Bilim İnsanı"
                : "Mikro dünyanın harikalarını keşfet!"}
            </p>
          </div>
        </div>

        {/* Decorative bubbles */}
        <div className="absolute w-20 h-20 bg-white/10 rounded-full top-5 -left-5" />
        <div className="absolute w-16 h-16 bg-white/10 rounded-full top-20 -right-2" />
        <div className="absolute w-10 h-10 bg-white/10 rounded-full bottom-[30px] left-[50px]" />
      </div>

      {/* Content */}
      <div className="px-5 -mt-5 max-w-2xl mx-auto pb-24">
        {/* This Week's Experiment */}
        <h2 className="text-lg font-bold text-[#1F2937] mb-3 mx-2">
          🧪 Bu Haftanın Deneyi
        </h2>

        {loading ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm mb-5">
            <div className="text-4xl mb-2 animate-pulse">🔬</div>
            <p className="text-sm text-[#6B7280]">Yükleniyor...</p>
          </div>
        ) : currentExperiment ? (
          <div className="bg-white rounded-3xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] mb-5">
            <div className="flex justify-between items-center mb-3">
              <span className="bg-[#0D9488] text-white text-xs font-bold px-3 py-1 rounded-full">
                Hafta {currentExperiment.weekNumber}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  currentExperiment.difficulty === "kolay"
                    ? "bg-[#D1FAE5] text-[#059669]"
                    : currentExperiment.difficulty === "orta"
                    ? "bg-[#FEF3C7] text-[#D97706]"
                    : "bg-[#FEE2E2] text-[#DC2626]"
                }`}
              >
                {currentExperiment.difficulty === "kolay"
                  ? "Kolay"
                  : currentExperiment.difficulty === "orta"
                  ? "Orta"
                  : "Zor"}
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#1F2937] mb-2">
              {(currentExperiment as any).childFriendly?.title ||
                currentExperiment.title}
            </h3>
            <p className="text-sm text-[#6B7280] leading-5 mb-3">
              {(currentExperiment as any).childFriendly?.description ||
                currentExperiment.description}
            </p>

            <div className="flex justify-between items-center">
              <div className="flex gap-4 text-[13px] text-[#6B7280]">
                <span>⏱️ {currentExperiment.estimatedTime}</span>
                <span>⭐ +{currentExperiment.points} XP</span>
              </div>
              <div className="w-9 h-9 bg-[#0D948815] rounded-full flex items-center justify-center">
                <ChevronRight size={20} className="text-[#0D9488]" />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm mb-5">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-sm text-[#6B7280]">Tüm deneyler tamamlandı!</p>
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-white rounded-2xl p-4 text-center shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="text-2xl mb-1">🧪</div>
            <div className="text-2xl font-bold text-[#1F2937]">
              {progress.totalExperimentsCompleted}
            </div>
            <div className="text-xs text-[#6B7280]">Deney</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 text-center shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="text-2xl mb-1">🏅</div>
            <div className="text-2xl font-bold text-[#1F2937]">
              {progress.badges.length}
            </div>
            <div className="text-xs text-[#6B7280]">Rozet</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 text-center shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-2xl font-bold text-[#1F2937]">
              {progress.streak}
            </div>
            <div className="text-xs text-[#6B7280]">Seri</div>
          </div>
        </div>

        {/* Progress Details Card */}
        <div className="bg-white rounded-3xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] mb-5">
          <h3 className="text-base font-bold text-[#1F2937] mb-3">
            📈 İlerleme Detayları
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-[#6B7280]">Toplam XP</span>
              <span className="text-sm font-semibold text-[#1F2937]">
                {progress.totalPoints} XP
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#6B7280]">Tamamlanan Deney</span>
              <span className="text-sm font-semibold text-[#1F2937]">
                {progress.totalExperimentsCompleted}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#6B7280]">Seri (Gün)</span>
              <span className="text-sm font-semibold text-[#1F2937]">
                {progress.streak}
              </span>
            </div>
          </div>
        </div>

        {/* Tip Card */}
        <div className="bg-[#F3E8FF] rounded-3xl p-6 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💡</span>
            <h3 className="text-[15px] font-semibold text-[#1F2937]">
              Bilim İpucu
            </h3>
          </div>
          <p className="text-sm text-[#6B7280] leading-5">
            Mikroskop kullanırken en düşük büyütmeden başla ve yavaşça artır. Bu
            şekilde numuneni daha kolay bulursun!
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={() => {
            if (currentExperiment) {
              navigate(`/experiment/${currentExperiment.id}`);
            }
          }}
          disabled={!currentExperiment}
          className="w-full bg-[#0D9488] text-white font-bold text-lg py-[18px] rounded-[32px] shadow-[0_2px_8px_rgba(13,148,136,0.12)] flex items-center justify-center gap-2 mb-8 hover:bg-[#0D9488]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-[22px] h-[22px]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          <span>Deneye Başla!</span>
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
