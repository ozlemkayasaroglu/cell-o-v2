import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react"; // Animasyon için
import { categoryIcons } from "../types/experimentTypes";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";

export default function Progress({ childAge = 6 }) {
  const { allExperiments, progress, loading } = useWeeklyExperiment();

  const [recentBadge, setRecentBadge] = useState<{
    icon: string;
    name: string;
  } | null>(null);

  const level = Math.floor(progress.totalPoints / 100) + 1;
  const currentLevelXP = progress.totalPoints % 100;

  const completionRate =
    allExperiments.length === 0
      ? 0
      : (progress.totalExperimentsCompleted / allExperiments.length) * 100;

  // Microcopy yaşa göre
  const ageCopy =
    childAge <= 6
      ? "Harika gidiyorsun! Her deney senin için eğlenceli bir keşif."
      : childAge <= 9
      ? "Bilim yolculuğun hızla ilerliyor! Yeni deneyler seni bekliyor."
      : "Bilim becerilerin çok gelişti! Daha zorlu deneylere hazır ol.";

  // Achievements
  const achievements = [
    {
      id: 1,
      icon: "🔬",
      name: "İlk Keşif",
      unlocked: progress.totalExperimentsCompleted >= 1,
      desc: "1 deney tamamla",
      category: "progress",
    },
    {
      id: 2,
      icon: "🧸",
      name: "Meraklı Minik",
      unlocked: progress.totalExperimentsCompleted >= 2,
      desc: "2 deney tamamla",
      category: "progress",
    },
    {
      id: 3,
      icon: "🦋",
      name: "Doğa Kaşifi",
      unlocked: progress.totalExperimentsCompleted >= 4,
      desc: "4 deney tamamla",
      category: "progress",
    },
    {
      id: 4,
      icon: "🧪",
      name: "Deneyci Çocuk",
      unlocked: progress.totalExperimentsCompleted >= 6,
      desc: "6 deney tamamla",
      category: "progress",
    },
    {
      id: 5,
      icon: "🌟",
      name: "Yıldız Bilimci",
      unlocked: progress.totalExperimentsCompleted >= 8,
      desc: "8 deney tamamla",
      category: "progress",
    },
    {
      id: 6,
      icon: "🏅",
      name: "Başarı Rozeti",
      unlocked: progress.totalExperimentsCompleted >= 10,
      desc: "10 deney tamamla",
      category: "progress",
    },
    {
      id: 7,
      icon: "🔥",
      name: "Seri Kaşif",
      unlocked: progress.streak >= 3,
      desc: "3 hafta seri yap",
      category: "streak",
    },
    {
      id: 8,
      icon: "⚡",
      name: "Hızlı Başlangıç",
      unlocked: progress.totalExperimentsCompleted >= 2 && progress.streak >= 1,
      desc: "İlk haftanda 2 deney",
      category: "special",
    },
    {
      id: 9,
      icon: "💡",
      name: "Zihin Açıcı",
      unlocked: progress.totalPoints >= 300,
      desc: "300 XP kazan",
      category: "points",
    },
    {
      id: 10,
      icon: "🎯",
      name: "Hedefe Yakın",
      unlocked: completionRate >= 50,
      desc: "%50 tamamlama",
      category: "special",
    },
    {
      id: 11,
      icon: "🚀",
      name: "Roket Çocuk",
      unlocked: progress.totalPoints >= 600,
      desc: "600 XP kazan",
      category: "points",
    },
    {
      id: 12,
      icon: "👑",
      name: "Bilim Kahramanı",
      unlocked: progress.totalExperimentsCompleted >= 12,
      desc: "12 deney tamamla",
      category: "progress",
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  useEffect(() => {
    const newBadge = progress.badges[progress.badges.length - 1];
    if (newBadge) {
      setRecentBadge(newBadge);
      const timer = setTimeout(() => setRecentBadge(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [progress.badges]);

  // Sesli okuma fonksiyonu
  const speak = (text: string) => {
    if (window.speechSynthesis) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = "tr-TR";
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  };
  const isYoung = childAge <= 7;

  // Hoparlör ikonlu buton (tekrar kullanılabilir)
  const Speaker = ({ text }: { text: string }) => (
    <button
      type="button"
      aria-label="Sesli oku"
      className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
      onClick={e => { e.stopPropagation(); speak(text); }}
      tabIndex={0}
    >
      <span role="img" aria-label="Sesli oku">🔊</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FEFB] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🧪</div>
          <p className="text-base text-[#6B7280]">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FEFB] px-4 py-10 relative">
      {/* Rozet Popup */}
      <Transition
        show={!!recentBadge}
        as="div"
        enter="transition transform duration-500"
        enterFrom="opacity-0 scale-75"
        enterTo="opacity-100 scale-100"
        leave="transition transform duration-300"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-75"
        className="absolute top-20 right-5 z-50"
      >
        {recentBadge && (
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-xl p-4 shadow-lg flex items-center gap-3">
            <span className="text-3xl">{recentBadge.icon}</span>
            <div>
              <p className="font-bold text-sm">Yeni Rozet Kazandın!</p>
              <p className="text-xs">{recentBadge.name}</p>
            </div>
          </div>
        )}
      </Transition>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT – Profile + Progress + Streak */}
        <div className="lg:col-span-1 bg-gradient-to-br from-[#E0F7F1] to-[#B8F0E8] rounded-[32px] p-8 flex flex-col justify-between shadow-sm">
          <div>
            <h1 className="text-[28px] font-extrabold text-[#0F172A] mb-3"></h1>
            <p className="text-[#475569] mb-6">{ageCopy}</p>

            {/* XP Card */}
            <div className="bg-white/70 rounded-2xl p-4 mb-6">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>XP</span>
                <span className="text-[#0D9488]">
                  {progress.totalPoints} XP
                </span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[length:300%_300%] bg-gradient-to-r from-[#F59E42] via-[#14B8A6] via-[#F472B6] to-[#3B82F6] h-3 rounded-full transition-all animate-gradient"
                  style={{ width: `${currentLevelXP}%` }}
                />
              </div>
              <p className="text-xs text-[#6B7280] mt-2 text-center">
                Seviye {level + 1} için {100 - currentLevelXP} XP daha 🚀
              </p>
            </div>

            {/* Weekly Streak */}
            <div className="bg-white/70 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span>Haftalık Seri</span>
                <span className="text-[#0D9488] font-bold">
                  {progress.streak} 🔥
                </span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#14B8A6] h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(progress.streak * 14, 100)}%` }}
                />
              </div>
              <p className="text-xs text-[#6B7280] mt-2 text-center">
                Bu hafta kesintisiz devam et!
              </p>
            </div>

            {/* Weekly Completion */}
            <div className="bg-white/70 rounded-2xl p-4">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>Deney Tamamlama</span>
                <span className="text-[#0D9488]">
                  {progress.totalExperimentsCompleted} / {allExperiments.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[length:300%_300%] bg-gradient-to-r from-[#F59E42] via-[#14B8A6] via-[#F472B6] to-[#3B82F6] h-3 rounded-full transition-all animate-gradient"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-xs text-[#6B7280] mt-2 text-center">
                Devam et! Yeni deneyler seni bekliyor 🚀
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT – Achievements + Parent Summary */}
        <div className="lg:col-span-2 flex flex-col gap-5 mb-12">
          {/* Stats Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-2xl font-bold text-blue-700">{level}</p>
              <p className="text-xs text-blue-600">Seviye</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-2xl font-bold text-green-700">
                {progress.totalExperimentsCompleted}
              </p>
              <p className="text-xs text-green-600">Deney</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">⭐</div>
              <p className="text-2xl font-bold text-orange-700">
                {progress.totalPoints}
              </p>
              <p className="text-xs text-orange-600">Toplam XP</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2">🎖️</div>
              <p className="text-2xl font-bold text-purple-700">
                {unlockedCount}
              </p>
              <p className="text-xs text-purple-600">Rozet</p>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-[#1F2937] mb-4">
              🏆 Başarılar ({unlockedCount}/{achievements.length})
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`text-center p-3 rounded-2xl transition-all duration-300 ${
                    a.unlocked
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 hover:scale-105 cursor-pointer"
                      : "bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      a.unlocked
                        ? "bg-gradient-to-br from-yellow-100 to-orange-100 shadow-md"
                        : "bg-gray-100 grayscale opacity-50"
                    }`}
                  >
                    <span
                      className={`text-3xl ${
                        a.unlocked ? "animate-bounce" : ""
                      }`}
                    >
                      {a.icon}
                    </span>
                  </div>
                  <p
                    className={`text-xs font-semibold mb-1 ${
                      a.unlocked ? "text-[#1F2937]" : "text-gray-400"
                    }`}
                  >
                    {a.name}
                  </p>
                  <p
                    className={`text-[10px] ${
                      a.unlocked ? "text-[#6B7280]" : "text-gray-300"
                    }`}
                  >
                    {a.desc}
                  </p>
                  {a.unlocked && (
                    <div className="mt-2">
                      <span className="inline-block bg-green-100 text-green-700 text-[9px] px-2 py-1 rounded-full font-semibold">
                        ✓ Kazanıldı
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Parent Summary */}
          <div className="bg-gradient-to-br from-[#F3E8FF] to-[#E9D5FF] rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1F2937] mb-4 flex items-center gap-2">
              👨‍👩‍👧 Bugün Ne Öğrendi?
            </h3>
            {/* Son tamamlanan deney özeti */}
            {allExperiments.length > 0 && allExperiments.some((exp) => exp.status === "completed") && (
              (() => {
                const lastCompleted = [...allExperiments].reverse().find((exp) => exp.status === "completed");
                if (!lastCompleted) return null;
                return (
                  <div className="mb-6 p-4 bg-green-100/60 border border-green-200 rounded-2xl flex items-center gap-4">
                    <div className="text-4xl">{categoryIcons[lastCompleted.category as keyof typeof categoryIcons] || "🔬"}</div>
                    <div>
                      <p className="font-bold text-[#166534] text-base mb-1">
                        Son Tamamlanan Deney: {lastCompleted.title}
                        {isYoung && (
                          <span className="inline-block align-middle">
                            <Speaker text={`Son Tamamlanan Deney: ${lastCompleted.title}`} />
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-green-900 mb-1">
                        {lastCompleted.description?.substring(0, 100)}...
                        {isYoung && lastCompleted.description && (
                          <Speaker text={lastCompleted.description.substring(0, 100)} />
                        )}
                      </p>
                      {lastCompleted.expectedResults && (
                        <ul className="list-disc list-inside text-xs text-green-800">
                          {lastCompleted.expectedResults.slice(0, 2).map((result, i) => (
                            <li key={i}>{result}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })()
            )}
            {/* Son 3 deney kartları */}
            {allExperiments.length > 0 ? (
              <div className="space-y-4">
                {allExperiments.slice(-3).map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/80 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-[#1F2937] mb-1">
                          {idx + 1}. {exp.title}
                          {isYoung && (
                            <Speaker text={exp.title || ""} />
                          )}
                        </p>
                        <p className="text-xs text-[#6B7280] mb-2">
                          {exp.description?.substring(0, 80)}...
                          {isYoung && exp.description && (
                            <Speaker text={exp.description.substring(0, 80)} />
                          )}
                        </p>
                        {exp.status === "completed" && exp.expectedResults && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-2">
                            <p className="text-xs text-green-700 font-semibold mb-1 flex items-center">
                              Deney Sonucu:
                              {isYoung && <Speaker text="Deney Sonucu" />}
                            </p>
                            <ul className="list-disc list-inside text-xs text-green-800">
                              {exp.expectedResults.slice(0, 2).map((result, i) => (
                                <li key={i} className="flex items-center">
                                  {result}
                                  {isYoung && <Speaker text={result || ""} />}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              exp.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : exp.status === "in_progress"
                                ? "bg-yellow-100 text-yellow-700"
                                : exp.status === "available"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {exp.status === "completed"
                              ? "✅ Tamamlandı"
                              : exp.status === "in_progress"
                              ? "⏳ Devam Ediyor"
                              : exp.status === "available"
                              ? "🕒 Başlamadı"
                              : "🔒 Kilitli"}
                          </span>
                          {exp.points && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                              +{exp.points} XP
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-3xl ml-3">
                        {categoryIcons[
                          exp.category as keyof typeof categoryIcons
                        ] || "🔬"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">🔬</div>
                <p className="text-[#6B7280] text-sm">
                  Henüz deney bulunmuyor. İlk deneye başla!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
