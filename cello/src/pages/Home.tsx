import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";

export default function Home() {
  const navigate = useNavigate();
  const { currentExperiment, progress, loading } = useWeeklyExperiment();

  const [profile, setProfile] = useState<{
    avatar: string;
    nickname: string;
    ageGroup: string;
  } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("user_profile");
    if (data) setProfile(JSON.parse(data));
  }, []);

  const avatarEmojiMap: Record<string, string> = {
    unicorn: "🦄",
    butterfly: "🦋",
    ladybug: "🐞",
    bunny: "🐰",
    cat: "🐱",
    dog: "🐶",
  };

  function renderColorfulNickname(nickname: string) {
    const colors = [
      "#F59E42",
      "#14B8A6",
      "#F472B6",
      "#3B82F6",
      "#F59E42",
      "#14B8A6",
      "#F472B6",
      "#3B82F6",
      "#F59E42",
      "#14B8A6",
      "#F472B6",
      "#3B82F6",
    ];
    return (
      <span>
        {nickname.split("").map((char, i) => (
          <span
            key={i}
            style={{
              color: colors[i % colors.length],
              fontFamily: "Fredoka",
              fontWeight: "bold",
            }}
          >
            {char}
          </span>
        ))}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FEFB] px-4 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* HERO */}
        <div className="bg-gradient-to-br from-[#E0F7F1] to-[#B8F0E8] rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="text-[72px] animate-float">
            {profile ? avatarEmojiMap[profile.avatar] : "🔬"}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mb-2">
              Merhaba{" "}
              {renderColorfulNickname(profile?.nickname || "Bilim Kaşifi")}{" "}
              👋
            </h1>
            <p className="text-[#475569] mb-4">Bugün keşfetmeye hazır mısın?</p>
          </div>
        </div>

        {/* CURRENT EXPERIMENT */}
        <div>
          {loading ? (
            <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
              <div className="text-5xl mb-3 animate-pulse">🧪</div>
              <p className="text-sm text-[#6B7280]">Hazırlanıyor...</p>
            </div>
          ) : currentExperiment ? (
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="bg-[#14B8A6] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Hafta {currentExperiment.weekNumber}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D1FAE5] text-[#059669]">
                  {currentExperiment.difficulty}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-[#0F172A] mb-2">
                {(currentExperiment as any).childFriendly?.title ||
                  currentExperiment.title}
              </h3>

              <p className="text-sm text-[#475569] mb-4">
                {(currentExperiment as any).childFriendly?.description ||
                  currentExperiment.description}
              </p>

              <div className="flex justify-between items-center mb-5">
                <div className="flex gap-4 text-sm text-[#64748B]">
                  <span>⏱️ {currentExperiment.estimatedTime}</span>
                  <span>⭐ +{currentExperiment.points} XP</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/experiment/${currentExperiment.id}`)}
                className="w-full py-4 rounded-full bg-[length:300%_300%]
    bg-gradient-to-r
    from-[#F59E42]
    via-[#14B8A6]
    via-[#F472B6]
    to-[#3B82F6]
    animate-gradient text-white font-black text-lg transition"
              >
                Deneye Başla 🚀
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
              <div className="text-6xl mb-3">🎉</div>
              <p className="text-base text-[#6B7280]">
                Tüm deneyleri tamamladın!
              </p>
            </div>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl mb-1">🧪</div>
            <div className="text-2xl font-bold">
              {progress.totalExperimentsCompleted}
            </div>
            <p className="text-xs text-[#6B7280]">Deney</p>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl mb-1">🏅</div>
            <div className="text-2xl font-bold">{progress.badges.length}</div>
            <p className="text-xs text-[#6B7280]">Rozet</p>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-2xl font-bold">{progress.streak}</div>
            <p className="text-xs text-[#6B7280]">Seri</p>
          </div>
        </div>

        {/* TIP */}
        <div className="bg-gradient-to-br from-[#F3E8FF] to-[#E9D5FF] rounded-3xl p-6 text-center mb-14">
          <div className="text-[40px] mb-2">💡</div>
          <h3 className="text-lg font-bold mb-1">Bilim İpucu</h3>
          <p className="text-sm text-[#6B7280]">
            Küçük adımlar büyük keşiflere götürür.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
