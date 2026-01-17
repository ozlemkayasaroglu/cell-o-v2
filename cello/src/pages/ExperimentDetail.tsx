import { getLang, t } from "../i18n";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";
import type { WeeklyExperiment } from "../types/experimentTypes";

// Mikroskop büyütme ifadelerini temizle (20x, 40x, 100x vb.)
function removeMagnification(text: string | undefined): string {
  if (!text) return "";
  return text
    .replace(/\b\d{1,3}x\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\(\s*\)/g, "")
    .trim();
}

// Türkçe metin okuma (text-to-speech)
function speakQuestion(question: string): void {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(
      removeMagnification(question)
    );
    utterance.lang = "tr-TR";
    utterance.rate = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }
}

export default function ExperimentDetail() {
  const { experimentId } = useParams<{ experimentId: string }>();
  const navigate = useNavigate();
  const { allExperiments, completeExperiment } = useWeeklyExperiment();
  const [experiment, setExperiment] = useState<WeeklyExperiment | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyAnswers, setSurveyAnswers] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [ageGroup, setAgeGroup] = useState<string | null>(null);

  useEffect(() => {
    // Yaş grubu bilgisini al
    const profileData = localStorage.getItem("user_profile");
    if (profileData) {
      const profile = JSON.parse(profileData);
      setAgeGroup(profile.ageGroup || null);
    }
  }, []);

  useEffect(() => {
    const exp = allExperiments.find((e) => e.id === experimentId);
    if (exp) {
      setExperiment(exp);
      // Anket cevaplarını başlat
      setSurveyAnswers(new Array(exp.observationGuide.length).fill(""));
    }
  }, [experimentId, allExperiments]);

  if (!experiment) {
    return (
      <div className="min-h-screen bg-[#F0FDF9] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔬</div>
          <p className="text-base text-[#6B7280]">{t("not_found")}</p>
          <button
            onClick={() => navigate("/experiments")}
            className="mt-4 text-[#0D9488] font-semibold"
          >
            {t("back")}
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitSurvey = async () => {
    // Cevapları kaydet ve deneyi tamamla
    const result = await completeExperiment(experiment.id, {
      notes: `Gözlem cevapları: ${surveyAnswers.join(" | ")}`,
      rating: 5,
    });

    if (result.success) {
      setShowConfetti(true);
      setTimeout(() => {
        navigate("/experiments");
      }, 3000);
    }
  };

  const handleFinishSteps = () => {
    // Adımlar bitti, anketi göster
    setShowSurvey(true);
  };

  const nextStep = () => {
    if (currentStep < experiment.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = experiment.steps[currentStep];

  // Anket gösteriliyorsa
  if (showSurvey) {
    return (
      <div className="min-h-screen bg-[#F0FDF9] pb-24">
        <div className="max-w-2xl mx-auto px-2 pt-4">
          {/* LanguageSwitcher kaldırıldı */}
        </div>
        {/* Success Message */}
        {showConfetti && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/20">
            <div className="bg-white rounded-3xl p-8 text-center animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-[#1F2937]">
                {t("congrats")}
              </h2>
              <p className="text-[#6B7280] mt-2">{t("experiment_completed")}</p>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="bg-[#0D9488] pt-[60px] pb-6 px-5">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-bold text-white mb-2">
              {t("survey_title")}
            </h1>
            <p className="text-sm text-white/90">{t("survey_desc")}</p>
          </div>
        </div>
        {/* Survey Content */}
        <div className="p-5 max-w-2xl mx-auto">
          <div className="space-y-4 mb-6">
            {/* 4-5, 6-7 yaş grupları için: Sorular madde madde gösterilir */}
            {(ageGroup === "4-5" || ageGroup === "6-7") && (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#0D9488] mb-4 flex items-center gap-2">
                  <span>📋</span>
                  <span>{t("survey_questions")}</span>
                  <button
                    onClick={() =>
                      speakQuestion(experiment.observationGuide.join(". "))
                    }
                    className="ml-auto text-xl hover:scale-110 transition"
                    title={t("read_all_questions")}
                  >
                    🔊
                  </button>
                </h2>
                <ul className="space-y-3">
                  {experiment.observationGuide.map((question, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-[#14B8A6] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                        {index + 1}
                      </span>
                      <span className="text-sm text-[#1F2937] leading-relaxed mt-1 flex-1">
                        {removeMagnification(question)}
                      </span>
                      <button
                        onClick={() => speakQuestion(question)}
                        className="flex-shrink-0 text-lg hover:scale-110 transition"
                        title={t("read_question")}
                      >
                        🔊
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* 8-9, 10-12 yaş grupları veya profil yoksa: Input alanları */}
            {(ageGroup === "8-9" ||
              ageGroup === "10-12" ||
              ageGroup === null) &&
              experiment.observationGuide.map((question, index) => (
                <div key={index} className="bg-white rounded-3xl p-5 shadow-sm">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="w-8 h-8 bg-[#0D9488] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm font-bold text-[#1F2937] leading-relaxed">
                        {removeMagnification(question)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t("write_answer")}
                      value={surveyAnswers[index] || ""}
                      onChange={(e) => {
                        const newAnswers = [...surveyAnswers];
                        newAnswers[index] = e.target.value;
                        setSurveyAnswers(newAnswers);
                      }}
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0D9488]"
                    />
                  </div>
                </div>
              ))}
          </div>
          {/* Complete Button */}
          <button
            onClick={handleSubmitSurvey}
            className="w-full bg-[#10B981] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#059669] transition"
          >
            <span>{t("complete_experiment")}</span>
            <span>✓</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FDF9] pb-24">
      <div className="max-w-2xl mx-auto px-2 pt-4">
        {/* LanguageSwitcher kaldırıldı */}
      </div>
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-3xl p-8 text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-[#1F2937]">
              {t("congrats")}
            </h2>
            <p className="text-[#6B7280] mt-2">{t("experiment_completed")}</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-[#0D9488] pt-[60px] pb-6 px-5 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate("/experiments")}
            className="text-white mb-4 flex items-center gap-2"
          >
            <span>←</span>
            <span>{t("back")}</span>
          </button>
          <h1 className="text-xl font-bold text-white mb-2">
            {(experiment as any).childFriendly?.title || experiment.title}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/90">
              {t("step")} {currentStep + 1} / {experiment.steps.length}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mt-3">
            <div
              className="bg-white h-2 rounded-full transition-all"
              style={{
                width: `${
                  ((currentStep + 1) / experiment.steps.length) * 100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-5 max-w-2xl mx-auto">
        {/* Malzemeler (İlk adımda göster) */}
        {currentStep === 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-sm mb-5">
            <h2 className="text-lg font-bold text-[#1F2937] mb-4 flex items-center gap-2">
              <span>📦</span>
              <span>{t("materials")}</span>
              {(ageGroup === "4-5" || ageGroup === "6-7") && (
                <button
                  onClick={() =>
                    speakQuestion(
                      experiment.materials.map((m) => m.name).join(", ")
                    )
                  }
                  className="ml-auto text-xl hover:scale-110 transition"
                  title={t("read_materials")}
                >
                  🔊
                </button>
              )}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {experiment.materials.map((material, index) => (
                <div
                  key={index}
                  className="bg-[#F0FDF9] rounded-xl p-3 flex items-center gap-3"
                >
                  <span className="text-2xl">{material.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1F2937]">
                      {material.name}
                    </p>
                    {material.optional && (
                      <p className="text-xs text-[#6B7280]">{t("optional")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Güvenlik Notları (İlk adımda göster) */}
        {currentStep === 0 && experiment.safetyNotes && (
          <div className="bg-[#FEF2F2] rounded-3xl p-5 shadow-sm mb-5 border-2 border-[#FCA5A5]">
            <h2 className="text-lg font-bold text-[#DC2626] mb-3 flex items-center gap-2">
              <span>⚠️</span>
              <span>{t("safety_notes")}</span>
              {(ageGroup === "4-5" || ageGroup === "6-7") && (
                <button
                  onClick={() =>
                    speakQuestion((experiment.safetyNotes || []).join(". "))
                  }
                  className="ml-auto text-xl hover:scale-110 transition"
                  title={t("read_safety")}
                >
                  🔊
                </button>
              )}
            </h2>
            <ul className="space-y-2">
              {experiment.safetyNotes.map((note, index) => (
                <li key={index} className="text-sm text-[#991B1B] flex gap-2">
                  <span>•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Mevcut Adım */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#0D9488] rounded-full flex items-center justify-center text-white font-bold text-xl">
              {currentStep + 1}
            </div>
            <h2 className="text-lg font-bold text-[#1F2937]">{t("step")}</h2>
            {(ageGroup === "4-5" || ageGroup === "6-7") && (
              <button
                onClick={() => speakQuestion(currentStepData.instruction)}
                className="ml-auto text-xl hover:scale-110 transition"
                title={t("read_step")}
              >
                🔊
              </button>
            )}
          </div>
          <p className="text-base text-[#1F2937] leading-relaxed mb-4">
            {removeMagnification(currentStepData.instruction)}
          </p>
          {currentStepData.tip && (
            <div className="bg-[#FEF3C7] rounded-xl p-4 flex gap-3">
              <span className="text-xl">💡</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#92400E] mb-1">
                  {t("tip")}
                </p>
                <p className="text-sm text-[#78350F]">
                  {removeMagnification(currentStepData.tip)}
                </p>
              </div>
              {(ageGroup === "4-5" || ageGroup === "6-7") &&
                currentStepData.tip && (
                  <button
                    onClick={() => speakQuestion(currentStepData.tip ?? "")}
                    className="flex-shrink-0 text-lg hover:scale-110 transition"
                    title={t("read_tip")}
                  >
                    🔊
                  </button>
                )}
            </div>
          )}
          {currentStepData.duration && (
            <div className="mt-4 flex items-center gap-2 text-sm text-[#6B7280]">
              <span>⏱️</span>
              <span>{currentStepData.duration}</span>
            </div>
          )}
        </div>
        {/* Beklenen Sonuçlar (Son adımda göster) */}
        {currentStep === experiment.steps.length - 1 && (
          <div className="bg-[#DBEAFE] rounded-3xl p-5 shadow-sm mb-5">
            <h2 className="text-lg font-bold text-[#1E40AF] mb-3 flex items-center gap-2">
              <span>🔍</span>
              <span>{t("expected_results")}</span>
              {(ageGroup === "4-5" || ageGroup === "6-7") && (
                <button
                  onClick={() =>
                    speakQuestion(experiment.expectedResults.join(". "))
                  }
                  className="ml-auto text-xl hover:scale-110 transition"
                  title={t("read_results")}
                >
                  🔊
                </button>
              )}
            </h2>
            <ul className="space-y-2">
              {experiment.expectedResults.map((result, index) => (
                <li key={index} className="text-sm text-[#1E3A8A] flex gap-2">
                  <span>✓</span>
                  <span>{removeMagnification(result)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="flex-1 bg-gray-200 text-[#1F2937] font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-300 transition"
            >
              <span>←</span>
              <span>{t("previous")}</span>
            </button>
          )}
          {currentStep < experiment.steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex-1 bg-[#0D9488] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#0D9488]/90 transition"
            >
              <span>{t("next")}</span>
              <span>→</span>
            </button>
          ) : (
            <button
              onClick={handleFinishSteps}
              className="flex-1 bg-[#10B981] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#059669] transition"
            >
              <span>{t("go_to_survey")}</span>
              <span>📝</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
