import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";
import type { WeeklyExperiment } from "../types/experimentTypes";

/* ---------- Helpers ---------- */

function cleanText(text?: string) {
  if (!text) return "";
  return text
    .replace(/\b\d{1,3}x\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\(\s*\)/g, "")
    .trim();
}

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(cleanText(text));
  u.lang = "tr-TR";
  u.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

/* ---------- UI Blocks ---------- */

function SectionCard({
  title,
  icon,
  onSpeak,
  children,
  className,
}: {
  title: string;
  icon: string;
  onSpeak?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-3xl p-6 shadow-sm ${className ?? ""}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-lg font-extrabold text-[#0F172A]">{title}</h2>
        {onSpeak && (
          <button
            onClick={onSpeak}
            className="ml-auto text-xl hover:scale-110 transition"
          >
            🔊
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

/* ---------- Main ---------- */

export default function ExperimentDetail() {
  const { experimentId } = useParams();
  const navigate = useNavigate();
  const { allExperiments, completeExperiment } = useWeeklyExperiment();

  const [experiment, setExperiment] = useState<WeeklyExperiment | null>(null);
  const [step, setStep] = useState(0);
  const [showSurvey, setShowSurvey] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [ageGroup, setAgeGroup] = useState<string | null>(null);

  useEffect(() => {
    const profile = localStorage.getItem("user_profile");
    if (profile) setAgeGroup(JSON.parse(profile).ageGroup ?? null);
  }, []);

  useEffect(() => {
    const exp = allExperiments.find((e) => e.id === experimentId);
    if (!exp) return;
    setExperiment(exp);
    setAnswers(new Array(exp.observationGuide.length).fill(""));
  }, [experimentId, allExperiments]);

  if (!experiment) return null;

  const isYoung = ageGroup === "4-5" || ageGroup === "6-7";
  const current = experiment.steps[step];

  /* ---------- Survey ---------- */

  if (showSurvey) {
    return (
      <div className="min-h-screen bg-[#F8FEFB] flex items-center justify-center px-4">
        <div className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-xl">
          <h1 className="text-2xl font-extrabold mb-6 text-center">
            Deney Sonu Anketi 📋
          </h1>

          {experiment.observationGuide.map((q, i) => (
            <div key={i} className="mb-5">
              <p className="font-semibold mb-2">
                {i + 1}. {cleanText(q.text ?? q)}
              </p>
              {!isYoung && (
                <input
                  className="w-full border-2 rounded-xl px-4 py-3"
                  value={answers[i]}
                  onChange={(e) => {
                    const copy = [...answers];
                    copy[i] = e.target.value;
                    setAnswers(copy);
                  }}
                />
              )}
            </div>
          ))}

          <button
            onClick={async () => {
              await completeExperiment(experiment.id, {
                notes: answers.join(" | "),
                rating: 5,
              });
              navigate("/experiments");
            }}
            className="w-full mt-6 bg-[length:300%_300%]
    bg-gradient-to-r
    from-[#F59E42]
    via-[#14B8A6]
    via-[#F472B6]
    to-[#3B82F6]
    animate-gradient text-white font-black py-4 rounded-full hover:scale-105 transition"
          >
            Deneyi Tamamla ✓
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Main Flow ---------- */

  return (
    <div className="min-h-screen bg-[#F8FEFB] px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT – Progress / Illustration */}
        <div className="bg-gradient-to-br from-[#E0F7F1] to-[#B8F0E8] p-8 flex flex-col justify-between">
          <button
            onClick={() => navigate("/experiments")}
            className="text-sm font-bold text-[#0F172A]"
          >
            ← Deneylere Dön
          </button>

          <div className="mt-8">
            <h1 className="text-3xl font-extrabold mb-3">{experiment.title}</h1>
            <p className="text-[#475569] mb-6">
              Adım {step + 1} / {experiment.steps.length}
            </p>

            <div className="w-full bg-white/40 h-2 rounded-full">
              <div
                className="bg-[#14B8A6] h-2 rounded-full transition-all"
                style={{
                  width: `${((step + 1) / experiment.steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <img
            src="/experiment-illustration.png"
            alt=""
            className="mt-10 w-full max-w-sm mx-auto hidden md:block"
          />
        </div>

        {/* RIGHT – Content */}
        <div className="p-8 flex flex-col gap-6">
          {step === 0 && (
            <SectionCard
              title="Gerekli Malzemeler"
              icon="📦"
              onSpeak={
                isYoung
                  ? () =>
                      speak(experiment.materials.map((m) => m.name).join(", "))
                  : undefined
              }
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {experiment.materials.map((m, i) => (
                  <div
                    key={i}
                    className="flex gap-2 bg-[#F8FEFB] p-2 rounded-2xl"
                  >
                    <span className="text-md">{m.icon}</span>
                    <div>
                      <p className="text-sm">{m.name}</p>
                      {m.optional && (
                        <p className="text-xs text-gray-500">İsteğe bağlı</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
          <div className="border-2 border-t border-[#E0F7F1]/60"></div>
          <SectionCard
            title={`Adım ${step + 1}`}
            className="pt-2 "
            icon="🧪"
            onSpeak={isYoung ? () => speak(current.instruction) : undefined}
          >
            <p className="mb-4 text-[#334155]">
              {cleanText(current.instruction)}
            </p>

            {current.tip && (
              <div className="bg-[#FEF3C7] p-4 rounded-2xl">
                <p className="font-bold mb-1">💡 İpucu</p>
                <p>{cleanText(current.tip)}</p>
              </div>
            )}
          </SectionCard>

          <div className="flex gap-3 mt-auto">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 bg-gray-200 py-4 rounded-full font-bold"
              >
                ← Önceki
              </button>
            )}

            {step < experiment.steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 bg-[length:300%_300%]
    bg-gradient-to-r
    from-[#F59E42]
    via-[#14B8A6]
    via-[#F472B6]
    to-[#3B82F6]
    animate-gradient text-white py-4 rounded-full font-black hover:scale-105 transition"
              >
                Sonraki →
              </button>
            ) : (
              <button
                onClick={() => setShowSurvey(true)}
                className="flex-1 bg-[length:300%_300%]
    bg-gradient-to-r
    from-[#F59E42]
    via-[#14B8A6]
    via-[#F472B6]
    to-[#3B82F6]
    animate-gradient text-white py-4 rounded-full font-black hover:scale-105 transition"
              >
                Ankete Geç 📝
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
