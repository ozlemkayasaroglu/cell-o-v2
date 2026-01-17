import { useNavigate } from "react-router-dom";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";
import { useState } from "react";

export default function Experiments({ childAge = 6 }) {
  const navigate = useNavigate();
  const { allExperiments, progress, loading } = useWeeklyExperiment();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FEFB] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🧪</div>
          <p className="text-base text-[#6B7280]">Deneyler hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  const completionRate =
    allExperiments.length === 0
      ? 0
      : (progress.totalExperimentsCompleted / allExperiments.length) * 100;

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
  // Hoparlör ikonlu buton
  const Speaker = ({ text }: { text: string }) => (
    <button
      type="button"
      aria-label="Sesli oku"
      className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      tabIndex={0}
    >
      <span role="img" aria-label="Sesli oku">
        🔊
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FEFB] px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT – Onboarding Hero */}
        <div className="lg:col-span-1 bg-gradient-to-br from-[#E0F7F1] to-[#B8F0E8] rounded-[32px] p-8 flex flex-col justify-between shadow-sm">
          <div>
            <h1 className="text-[28px] font-extrabold text-[#0F172A] mb-3">
              {isYoung && <Speaker text="Deneyler" />}
            </h1>

            <p className="text-[#475569] leading-relaxed mb-6">
              Her hafta yeni bir deneyle keşfet, öğren ve yıldızları topla ✨
              {isYoung && (
                <Speaker text="Her hafta yeni bir deneyle keşfet, öğren ve yıldızları topla" />
              )}
            </p>

            {/* Progress Card */}
            <div className="bg-white/70 rounded-2xl p-4">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>İlerleme</span>
                <span className="text-[#0D9488]">
                  {progress.totalExperimentsCompleted} / {allExperiments.length}
                </span>
              </div>

              <div className="w-full bg-white h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[length:300%_300%]
bg-gradient-to-r
from-[#F59E42]
via-[#14B8A6]
via-[#F472B6]
to-[#3B82F6] h-3 rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>

              <p className="text-xs text-[#6B7280] mt-3">
                Devam et! Yeni deneyler seni bekliyor 🚀
              </p>
            </div>
          </div>

          <img
            src="/experiments-illustration.png"
            alt=""
            className="mt-8 w-full max-w-xs mx-auto hidden lg:block"
          />
        </div>

        {/* RIGHT – Step / Experiment Cards */}
        <div className="lg:col-span-2 flex flex-col gap-5 mb-12">
          {allExperiments.length > 0 ? (
            allExperiments.map((exp, index) => {
              const isCompleted = exp.status === "completed";
              const isLocked = exp.status === "locked";

              return (
                <div
                  key={exp.id}
                  className={`bg-white rounded-[32px] p-6 shadow-sm transition ${
                    isLocked ? "opacity-50" : "hover:shadow-md"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-[#14B8A6] text-white text-xs font-bold px-4 py-1 rounded-full">
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

                  {/* Title */}
                  <h3 className="text-xl font-extrabold text-[#0F172A] mb-2">
                    {exp.title}
                    {isYoung && <Speaker text={exp.title || ""} />}
                  </h3>

                  <p className="text-sm text-[#475569] leading-relaxed mb-4">
                    {exp.description}
                    {isYoung && exp.description && (
                      <Speaker text={exp.description} />
                    )}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-sm text-[#64748B] mb-5">
                    <span>
                      ⏱️ {exp.estimatedTime}{" "}
                      {isYoung && <Speaker text={exp.estimatedTime || ""} />}
                    </span>
                    <span>
                      ⭐ +{exp.points} XP{" "}
                      {isYoung && <Speaker text={`Artı ${exp.points} XP`} />}
                    </span>

                    {isCompleted && (
                      <span className="font-semibold text-[#059669]">
                        ✓ Tamamlandı
                        {isYoung && <Speaker text="Tamamlandı" />}
                      </span>
                    )}

                    {isLocked && (
                      <span>
                        🔒 Kilitli {isYoung && <Speaker text="Kilitli" />}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    disabled={isLocked}
                    onClick={() => {
                      if (!isLocked) {
                        navigate(`/experiment/${exp.id}`);
                      }
                    }}
                    className={`w-full py-[18px] rounded-[32px] font-black transition ${
                      isLocked
                        ? "bg-rose-300 text-rose-100 cursor-not-allowed"
                        : isCompleted
                        ? "bg-gradient-to-br from-[#6EE7B7] to-[#38BDF8] text-white"
                        : "bg-[length:300%_300%] bg-gradient-to-r from-[#F59E42] via-[#14B8A6] via-[#F472B6] to-[#3B82F6] animate-gradient text-white "
                    }`}
                  >
                    {isLocked ? (
                      <>Kilitli{isYoung && <Speaker text="Kilitli" />}</>
                    ) : isCompleted ? (
                      <>Tekrar Yap{isYoung && <Speaker text="Tekrar Yap" />}</>
                    ) : (
                      <>
                        Deneye Başla 🚀
                        {isYoung && <Speaker text="Deneye Başla" />}
                      </>
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-[32px] p-10 text-center shadow-sm mb-12">
              <div className="text-6xl mb-4">🔬</div>
              <p className="text-base text-[#6B7280]">Henüz deney bulunmuyor</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
