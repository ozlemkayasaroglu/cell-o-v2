import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";

export default function Experiments() {
  const navigate = useNavigate();
  const { allExperiments, progress, loading } = useWeeklyExperiment();

  useEffect(() => {}, [allExperiments, progress, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FDF9] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🔬</div>
          <p className="text-base text-[#6B7280]">Deneyler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FDF9]">
      {/* Header */}
      <div className="bg-[#0D9488] pt-[60px] pb-[30px] px-5 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-3">🧪</div>
          <h1 className="text-[26px] font-bold text-white mb-1">
            Haftalık Deneyler
          </h1>
          <p className="text-sm text-white/90">
            Bilim dünyasını keşfetmeye hazır mısın?
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 max-w-2xl mx-auto pb-24">
        {/* Progress Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-[#1F2937]">
              İlerleme
            </span>
            <span className="text-sm font-bold text-[#0D9488]">
              {progress.totalExperimentsCompleted} / {allExperiments.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-[#0D9488] h-3 rounded-full transition-all"
              style={{
                width: `${
                  (progress.totalExperimentsCompleted / allExperiments.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Experiments List */}
        {allExperiments.length > 0 ? (
          <div className="space-y-3">
            {allExperiments.map((exp, index) => {
              const isCompleted = exp.status === "completed";
              const isAvailable = exp.status === "available";
              const isLocked = exp.status === "locked";

              return (
                <div
                  key={exp.id}
                  className={`bg-white rounded-2xl p-5 shadow-sm ${
                    isLocked ? "opacity-50" : ""
                  }`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-[#0D9488] text-white text-xs font-bold px-3 py-1 rounded-full">
                      Hafta {index + 1}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        exp.difficulty === "kolay"
                          ? "bg-[#D1FAE5] text-[#059669]"
                          : exp.difficulty === "orta"
                          ? "bg-[#FEF3C7] text-[#D97706]"
                          : "bg-[#FEE2E2] text-[#DC2626]"
                      }`}
                    >
                      {exp.difficulty === "kolay"
                        ? "Kolay"
                        : exp.difficulty === "orta"
                        ? "Orta"
                        : "Zor"}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-[#1F2937] mb-2">
                    {(exp as any).childFriendly?.title || exp.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-5 mb-3">
                    {(exp as any).childFriendly?.description || exp.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-4 text-[13px] text-[#6B7280]">
                      <span>⏱️ {exp.estimatedTime}</span>
                      <span>⭐ +{exp.points} XP</span>
                    </div>
                    {isLocked && (
                      <span className="text-xs text-[#6B7280]">🔒 Kilitli</span>
                    )}
                    {isCompleted && (
                      <span className="text-xs text-[#059669]">
                        ✓ Tamamlandı
                      </span>
                    )}
                  </div>

                  {/* Button */}
                  <button
                    disabled={isLocked}
                    onClick={() => {
                      if (!isLocked) {
                        navigate(`/experiment/${exp.id}`);
                      }
                    }}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
                      isLocked
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : isCompleted
                        ? "bg-[#D1FAE5] text-[#059669]"
                        : "bg-[#0D9488] text-white hover:bg-[#0D9488]/90"
                    }`}
                  >
                    {isLocked
                      ? "Kilitli"
                      : isCompleted
                      ? "Tekrar Aç"
                      : "Deneye Başla!"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <div className="text-6xl mb-4">🔬</div>
            <p className="text-base text-[#6B7280]">Henüz deney bulunamadı!</p>
          </div>
        )}
      </div>
    </div>
  );
}
