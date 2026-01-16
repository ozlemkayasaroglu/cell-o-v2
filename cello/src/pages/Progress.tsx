import { useEffect } from "react";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";

export default function Progress() {
  const { progress, loading } = useWeeklyExperiment();

  useEffect(() => {}, [progress, loading]);

  const level = Math.floor(progress.totalPoints / 100) + 1;
  const currentLevelXP = progress.totalPoints % 100;

  const achievements = [
    {
      id: 1,
      icon: "🔬",
      name: "İlk Deney",
      unlocked: progress.totalExperimentsCompleted >= 1,
      desc: "1 deney tamamla",
    },
    {
      id: 2,
      icon: "🧪",
      name: "Meraklı",
      unlocked: progress.totalExperimentsCompleted >= 3,
      desc: "3 deney tamamla",
    },
    {
      id: 3,
      icon: "🧫",
      name: "Bilim İnsanı",
      unlocked: progress.totalExperimentsCompleted >= 5,
      desc: "5 deney tamamla",
    },
    {
      id: 4,
      icon: "🏆",
      name: "Araştırmacı",
      unlocked: progress.totalExperimentsCompleted >= 8,
      desc: "8 deney tamamla",
    },
    {
      id: 5,
      icon: "💎",
      name: "Uzman",
      unlocked: progress.totalExperimentsCompleted >= 10,
      desc: "10 deney tamamla",
    },
    {
      id: 6,
      icon: "👑",
      name: "Profesör",
      unlocked: progress.totalExperimentsCompleted >= 12,
      desc: "12 deney tamamla",
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FDF9] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📈</div>
          <p className="text-base text-[#6B7280]">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FDF9]">
      {/* Header */}
      <div className="bg-[#F59E0B] pt-[60px] pb-5 px-5">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="text-[40px]">📈</div>
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">İlerleme</h1>
              <p className="text-[13px] text-black/60 mt-0.5">
                Başarılarını takip et
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 max-w-2xl mx-auto pb-24">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm mb-5">
          <div className="flex items-center mb-5">
            <div className="w-[72px] h-[72px] bg-[#0D9488]/20 rounded-full flex items-center justify-center mr-4">
              <span className="text-[40px]">🧑‍🔬</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#1F2937]">
                Küçük Bilim İnsanı
              </h2>
              <p className="text-[15px] text-[#0D9488] font-semibold mt-1">
                Seviye {level}
              </p>
            </div>
          </div>

          {/* XP Progress */}
          <div className="bg-[#F0FDF9] rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#6B7280]">Deneyim Puanı</span>
              <span className="text-base font-bold text-[#0D9488]">
                {progress.totalPoints} XP
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                className="bg-[#0D9488] h-4 rounded-full transition-all"
                style={{ width: `${currentLevelXP}%` }}
              />
            </div>
            <p className="text-xs text-[#6B7280] text-center">
              Seviye {level + 1} için {100 - currentLevelXP} XP daha
            </p>
          </div>
        </div>

        {/* Stats */}
        <h3 className="text-lg font-bold text-[#1F2937] mb-3 mx-2">
          📊 İstatistikler
        </h3>
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl mb-1">🧪</div>
            <div className="text-2xl font-bold text-[#1F2937]">
              {progress.totalExperimentsCompleted}
            </div>
            <div className="text-xs text-[#6B7280]">Deney</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl mb-1">🏅</div>
            <div className="text-2xl font-bold text-[#1F2937]">
              {progress.badges.length}
            </div>
            <div className="text-xs text-[#6B7280]">Rozet</div>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-2xl font-bold text-[#1F2937]">
              {progress.streak}
            </div>
            <div className="text-xs text-[#6B7280]">Seri</div>
          </div>
        </div>

        {/* Achievements */}
        <h3 className="text-lg font-bold text-[#1F2937] mb-3 mx-2">
          🏆 Başarılar ({unlockedCount}/{achievements.length})
        </h3>
        <div className="bg-white rounded-3xl p-5 shadow-sm mb-5">
          <div className="grid grid-cols-3 gap-5">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="text-center">
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    achievement.unlocked
                      ? "bg-[#F59E0B]/20"
                      : "bg-gray-100 grayscale"
                  }`}
                >
                  <span className="text-3xl">{achievement.icon}</span>
                </div>
                <p
                  className={`text-xs font-semibold mb-1 ${
                    achievement.unlocked ? "text-[#1F2937]" : "text-gray-400"
                  }`}
                >
                  {achievement.name}
                </p>
                <p
                  className={`text-[10px] ${
                    achievement.unlocked ? "text-[#6B7280]" : "text-gray-300"
                  }`}
                >
                  {achievement.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Earned Badges */}
        {progress.badges.length > 0 && (
          <>
            <h3 className="text-lg font-bold text-[#1F2937] mb-3 mx-2">
              🎖️ Kazanılan Rozetler
            </h3>
            <div className="bg-white rounded-3xl p-5 shadow-sm mb-5">
              {progress.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center py-3 border-b border-gray-100 last:border-0"
                >
                  <span className="text-4xl mr-4">{badge.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-[#1F2937]">
                      {badge.name}
                    </h4>
                    <p className="text-[13px] text-[#6B7280] mt-0.5">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Motivation Card */}
        <div className="bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] rounded-3xl p-6 text-center">
          <div className="text-[40px] mb-3">💪</div>
          <h3 className="text-lg font-bold text-[#1F2937] mb-2">Devam Et!</h3>
          <p className="text-sm text-[#6B7280] leading-5">
            Her deney seni bir adım daha yaklaştırıyor. Bilim Ustası olmak için
            keşfetmeye devam et!
          </p>
        </div>
      </div>
    </div>
  );
}
