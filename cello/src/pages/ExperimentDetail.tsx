import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";
import type { WeeklyExperiment } from "../types/experimentTypes";

// Mikroskop büyütme ifadelerini temizle (20x, 40x, 100x vb.)
function removeMagnification(text: string): string {
  return text
    .replace(/\b\d{1,3}x\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\(\s*\)/g, "")
    .trim();
}

export default function ExperimentDetail() {
  const { experimentId } = useParams<{ experimentId: string }>();
  const navigate = useNavigate();
  const { allExperiments, completeExperiment } = useWeeklyExperiment();
  const [experiment, setExperiment] = useState<WeeklyExperiment | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSurvey, setShowSurvey] = useState(false);
  const [surveyAnswers, setSurveyAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

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
          <p className="text-base text-[#6B7280]">Deney bulunamadı...</p>
          <button
            onClick={() => navigate("/experiments")}
            className="mt-4 text-[#0D9488] font-semibold"
          >
            ← Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const handleComplete = async () => {
    // Cevapları kontrol et
    const results = checkAnswers();
    const correct = results.filter((r) => r.isCorrect).length;
    setCorrectCount(correct);

    const result = await completeExperiment(experiment.id, {
      notes: `Doğru: ${correct}/${
        experiment.observationGuide.length
      } | ${surveyAnswers.join(" | ")}`,
      rating: 5,
    });

    if (result.success) {
      setShowConfetti(true);
      setTimeout(() => {
        navigate("/experiments");
      }, 3000);
    }
  };

  const handleSubmitSurvey = () => {
    // Sonuçları göster
    setShowResults(true);
  };

  const checkAnswers = () => {
    // expectedResults ile cevapları karşılaştır
    return experiment.observationGuide.map((question, index) => {
      const answer = surveyAnswers[index]?.toLowerCase() || "";
      const lowerQ = question.toLowerCase();

      // expectedResults'tan ilgili sonucu bul
      const relatedResult = experiment.expectedResults.find((result) => {
        const lowerR = result.toLowerCase();
        // Soru ve sonuç arasında anahtar kelime eşleşmesi
        if (lowerQ.includes("şekil")) {
          return lowerR.includes("şekil");
        }
        if (lowerQ.includes("renk")) {
          return lowerR.includes("renk");
        }
        if (lowerQ.includes("hücre duvar")) {
          return lowerR.includes("duvar");
        }
        if (lowerQ.includes("çekirdek")) {
          return lowerR.includes("çekirdek");
        }
        if (lowerQ.includes("boyut") || lowerQ.includes("kadar")) {
          return lowerR.includes("büyük") || lowerR.includes("küçük");
        }
        if (lowerQ.includes("hareket")) {
          return lowerR.includes("hareket");
        }
        return false;
      });

      if (!relatedResult) {
        return { isCorrect: true, feedback: "Harika gözlem!" }; // Eşleşme yoksa doğru say
      }

      const lowerResult = relatedResult.toLowerCase();

      // Cevap kontrolü
      let isCorrect = false;
      let feedback = "";

      // Şekil kontrolü
      if (lowerQ.includes("şekil")) {
        if (
          (lowerResult.includes("dikdörtgen") &&
            answer.includes("dikdörtgen")) ||
          (lowerResult.includes("yuvarlak") && answer.includes("yuvarlak")) ||
          (lowerResult.includes("düzensiz") && answer.includes("düzensiz"))
        ) {
          isCorrect = true;
          feedback = "Doğru! Şekli doğru gözlemledin.";
        } else {
          feedback = `Beklenen: ${relatedResult}`;
        }
      }
      // Evet/Hayır kontrolü
      else if (
        lowerQ.includes("görebiliyor musun") ||
        lowerQ.includes("var mı")
      ) {
        if (
          (lowerResult.includes("göreceksin") ||
            lowerResult.includes("olacak")) &&
          answer.includes("evet")
        ) {
          isCorrect = true;
          feedback = "Doğru! Onu görebildin.";
        } else if (lowerResult.includes("yok") && answer.includes("hayır")) {
          isCorrect = true;
          feedback = "Doğru! Onu görememen normal.";
        } else {
          feedback = `Beklenen: ${relatedResult}`;
        }
      }
      // Genel kontrol
      else {
        // Basit kelime eşleşmesi
        const keywords = lowerResult.split(" ").filter((w) => w.length > 3);
        const matchCount = keywords.filter((k) => answer.includes(k)).length;
        if (matchCount > 0) {
          isCorrect = true;
          feedback = "Harika gözlem!";
        } else {
          feedback = `Beklenen: ${relatedResult}`;
        }
      }

      return { isCorrect, feedback };
    });
  };

  const handleSurveyAnswer = (index: number, answer: string) => {
    const newAnswers = [...surveyAnswers];
    newAnswers[index] = answer;
    setSurveyAnswers(newAnswers);
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

  // Sonuçlar gösteriliyorsa
  if (showResults) {
    const results = checkAnswers();
    const totalQuestions = experiment.observationGuide.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-[#F0FDF9] pb-24">
        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/20">
            <div className="bg-white rounded-3xl p-8 text-center animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-[#1F2937]">Tebrikler!</h2>
              <p className="text-[#6B7280] mt-2">Deney tamamlandı!</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-[#10B981] pt-[60px] pb-6 px-5">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? "🌟" : percentage >= 60 ? "👍" : "💪"}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Sonuçların Hazır!
            </h1>
            <p className="text-lg text-white/90">
              {correctCount} / {totalQuestions} Doğru ({percentage}%)
            </p>
          </div>
        </div>

        {/* Results Content */}
        <div className="p-5 max-w-2xl mx-auto">
          {/* Score Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm mb-5 text-center">
            <div className="text-5xl mb-3">
              {percentage >= 80 ? "🏆" : percentage >= 60 ? "⭐" : "📚"}
            </div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">
              {percentage >= 80
                ? "Mükemmel Gözlem!"
                : percentage >= 60
                ? "Harika İş Çıkardın!"
                : "İyi Bir Başlangıç!"}
            </h2>
            <p className="text-sm text-[#6B7280]">
              {percentage >= 80
                ? "Bilim insanı gibi gözlem yaptın!"
                : percentage >= 60
                ? "Gözlem becerilerini geliştiriyorsun!"
                : "Pratik yaparak daha iyi olacaksın!"}
            </p>
          </div>

          {/* Detailed Results */}
          <div className="space-y-3 mb-6">
            {experiment.observationGuide.map((question, index) => {
              const result = results[index];
              const answer = surveyAnswers[index] || "Cevap verilmedi";

              return (
                <div
                  key={index}
                  className={`rounded-3xl p-5 shadow-sm ${
                    result.isCorrect ? "bg-[#D1FAE5]" : "bg-[#FEE2E2]"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xl ${
                        result.isCorrect ? "bg-[#10B981]" : "bg-[#EF4444]"
                      }`}
                    >
                      {result.isCorrect ? "✓" : "✗"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1F2937] mb-1">
                        {removeMagnification(question)}
                      </p>
                      <p className="text-sm text-[#6B7280] mb-2">
                        Senin cevabın: <strong>{answer}</strong>
                      </p>
                      <p
                        className={`text-xs ${
                          result.isCorrect ? "text-[#059669]" : "text-[#DC2626]"
                        }`}
                      >
                        {result.feedback}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            className="w-full bg-[#10B981] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#059669] transition"
          >
            <span>Deneyi Tamamla ve Kaydet</span>
            <span>🎉</span>
          </button>
        </div>
      </div>
    );
  }

  // Anket gösteriliyorsa
  if (showSurvey) {
    // Basit çoktan seçmeli seçenekler
    const getOptionsForQuestion = (question: string): string[] => {
      const lowerQ = question.toLowerCase();

      // Şekil soruları
      if (lowerQ.includes("şekil") || lowerQ.includes("nasıl görün")) {
        return ["Yuvarlak", "Dikdörtgen", "Düzensiz", "Üçgen", "Diğer"];
      }

      // Renk soruları
      if (lowerQ.includes("renk") || lowerQ.includes("ne renk")) {
        return ["Yeşil", "Mavi", "Kırmızı", "Sarı", "Şeffaf", "Diğer"];
      }

      // Boyut soruları
      if (
        lowerQ.includes("boyut") ||
        lowerQ.includes("ne kadar") ||
        lowerQ.includes("büyük")
      ) {
        return ["Çok küçük", "Küçük", "Orta", "Büyük", "Çok büyük"];
      }

      // Hareket soruları
      if (lowerQ.includes("hareket") || lowerQ.includes("nasıl hareket")) {
        return ["Hızlı", "Yavaş", "Hareket etmiyor", "Titreşiyor", "Dönerek"];
      }

      // Evet/Hayır soruları
      if (
        lowerQ.includes("görebiliyor musun") ||
        lowerQ.includes("var mı") ||
        lowerQ.includes("bulabildin mi")
      ) {
        return [
          "Evet, gördüm",
          "Hayır, göremedim",
          "Biraz gördüm",
          "Emin değilim",
        ];
      }

      // Sayı soruları
      if (lowerQ.includes("kaç") || lowerQ.includes("sayı")) {
        return [
          "1-5 arası",
          "5-10 arası",
          "10-20 arası",
          "20'den fazla",
          "Sayamadım",
        ];
      }

      // Genel sorular
      return ["Çok iyi", "İyi", "Orta", "Zor", "Çok zor"];
    };

    return (
      <div className="min-h-screen bg-[#F0FDF9] pb-24">
        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/20">
            <div className="bg-white rounded-3xl p-8 text-center animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-[#1F2937]">Tebrikler!</h2>
              <p className="text-[#6B7280] mt-2">Deney tamamlandı!</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-[#0D9488] pt-[60px] pb-6 px-5">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-bold text-white mb-2">
              🔍 Gözlem Anketi
            </h1>
            <p className="text-sm text-white/90">
              Deneyinde neler gözlemledin? Sorularımızı cevaplayarak paylaş!
            </p>
          </div>
        </div>

        {/* Survey Content */}
        <div className="p-5 max-w-2xl mx-auto">
          <div className="space-y-4 mb-6">
            {experiment.observationGuide.map((question, index) => {
              const options = getOptionsForQuestion(question);
              const selectedAnswer = surveyAnswers[index];

              return (
                <div key={index} className="bg-white rounded-3xl p-5 shadow-sm">
                  <div className="mb-3">
                    <span className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#0D9488] text-white rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      <span>{removeMagnification(question)}</span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    {options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSurveyAnswer(index, option)}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition ${
                          selectedAnswer === option
                            ? "border-[#0D9488] bg-[#0D9488]/10 text-[#0D9488] font-semibold"
                            : "border-gray-200 bg-white text-[#1F2937] hover:border-[#0D9488]/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswer === option
                                ? "border-[#0D9488] bg-[#0D9488]"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedAnswer === option && (
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
                            )}
                          </div>
                          <span className="text-sm">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Complete Button */}
          <button
            onClick={handleSubmitSurvey}
            className="w-full bg-[#10B981] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#059669] transition"
          >
            <span>Cevapları Kontrol Et</span>
            <span>✓</span>
          </button>

          <p className="text-xs text-[#6B7280] text-center mt-3">
            💡 Sorular opsiyoneldir, istersen boş bırakabilirsin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FDF9] pb-24">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-3xl p-8 text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-[#1F2937]">Tebrikler!</h2>
            <p className="text-[#6B7280] mt-2">Deney tamamlandı!</p>
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
            <span>Geri</span>
          </button>
          <h1 className="text-xl font-bold text-white mb-2">
            {(experiment as any).childFriendly?.title || experiment.title}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/90">
              Adım {currentStep + 1} / {experiment.steps.length}
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
              <span>Malzemeler</span>
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
                      <p className="text-xs text-[#6B7280]">Opsiyonel</p>
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
              <span>Güvenlik Notları</span>
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
            <h2 className="text-lg font-bold text-[#1F2937]">Adım</h2>
          </div>

          <p className="text-base text-[#1F2937] leading-relaxed mb-4">
            {removeMagnification(currentStepData.instruction)}
          </p>

          {currentStepData.tip && (
            <div className="bg-[#FEF3C7] rounded-xl p-4 flex gap-3">
              <span className="text-xl">💡</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#92400E] mb-1">
                  İpucu
                </p>
                <p className="text-sm text-[#78350F]">
                  {removeMagnification(currentStepData.tip)}
                </p>
              </div>
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
              <span>Beklenen Sonuçlar</span>
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
              <span>Önceki</span>
            </button>
          )}

          {currentStep < experiment.steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex-1 bg-[#0D9488] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#0D9488]/90 transition"
            >
              <span>Sonraki</span>
              <span>→</span>
            </button>
          ) : (
            <button
              onClick={handleFinishSteps}
              className="flex-1 bg-[#10B981] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#059669] transition"
            >
              <span>Gözlem Anketine Geç</span>
              <span>📝</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
