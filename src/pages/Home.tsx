import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeeklyExperiment } from "../hooks/useWeeklyExperiment";
import TabNavigation from "../components/TabNavigation";

export default function Home() {
  const navigate = useNavigate();
  const { currentExperiment, progress, loading, allExperiments } = useWeeklyExperiment();

  const [profile, setProfile] = useState<{
    avatar: string;
    nickname: string;
    ageGroup: string;
  } | null>(null);

  const [randomExperimentIndex, setRandomExperimentIndex] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem("user_profile");
    if (data) setProfile(JSON.parse(data));
  }, []);

  useEffect(() => {
    if (allExperiments.length > 0) {
      const randomIndex = Math.floor(Math.random() * allExperiments.length);
      setRandomExperimentIndex(randomIndex);
    }
  }, [allExperiments]);

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

  const isYoung =
    profile && (profile.ageGroup === "4-5" || profile.ageGroup === "6-7");
  const Speaker = ({ text }: { text: string }) => (
    <span
      role="button"
      aria-label="Sesli oku"
      className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none cursor-pointer"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        if (window.speechSynthesis) {
          const utter = new window.SpeechSynthesisUtterance(text);
          utter.lang = "tr-TR";
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utter);
        }
      }}
    >
      <span role="img" aria-label="Sesli oku">
        🔊
      </span>
    </span>
  );

  // Bilim insanları verisi
  const scientists = [
    {
      name: "El-Cezeri",
      quote:
        "Mekanik sanatlar, teorik bilgiden daha üstündür çünkü somut eserler ortaya koyar.",
      info: "Sibernetiğin kurucusu, 50'den fazla makine tasarladı",
    },
    {
      name: "Mustafa Kemal Atatürk",
      quote:
        "Geometri kitabı yazarak terimleri Türkçeleştirdim. Bilim, milli bir meseledir.",
      info: "Geometri terimleri (açı, üçgen, dikdörtgen vb.) Atatürk tarafından Türkçeleştirildi",
    },
    {
      name: "İbn-i Sina",
      quote:
        "Bilim, insanı şüpheden yakîne, cehaletten bilgiye götüren yoldur.",
      info: "Tıp Kanunu kitabı 600 yıl boyunca Avrupa'da ders kitabı olarak okutuldu",
    },
    {
      name: "Uluğ Bey",
      quote: "Gökyüzünü anlamak, kainatın sırlarını çözmektir.",
      info: "Semerkant'ta kurduğu rasathanede 1018 yıldızı kaydetti",
    },
    {
      name: "Fatma El-Fihri",
      quote:
        "Bilgi, insanın en değerli mirasıdır ve onu yaymak en büyük ibadettir.",
      info: "Dünyanın ilk üniversitesi kabul edilen Kayruvan Üniversitesi'ni kuran kadın",
    },
    {
      name: "Hypatia",
      quote: "Doğruyu söylemek tehlikeliyse, susmak daha da tehlikelidir.",
      info: "İskenderiye'de matematik ve astronomi üzerine ders veren ilk kadın filozof ve bilim insanlarından",
    },
    {
      name: "İbn-i Haldun",
      quote: "Coğrafya kaderdir.",
      info: "Mukaddime adlı eseriyle tarih felsefesi ve sosyolojinin temellerini atan düşünür",
    },
    {
      name: "İbn-i Battuta",
      quote: "Yolculuk; önyargıları, dar görüşlülüğü ve cehaleti yok eder.",
      info: "14. yüzyılda 120.000 km'yi aşan, Afrika'dan Çin'e uzanan seyahatleriyle ünlü gezgin",
    },
    {
      name: "Nana Esma",
      quote: "Yönetmek, adaletle hükmetmek ve bilgelikle karar vermektir.",
      info: "19. yüzyılda Batı Afrika'da (günümüz Nijeryası) eğitim ve diplomatik becerileriyle tanınan bir aristokrat ve yönetici",
    },
    {
      name: "Biruni",
      quote:
        "Bilim, şüphe ile başlar, araştırma ile ilerler, gerçek ile son bulur.",
      info: "Astronomi, matematik, coğrafya ve kültürler tarihi alanlarında çığır açan çalışmalar yapan bilim insanı",
    },
    {
      name: "Cabir bin Hayyan",
      quote: "Kimyanın amacı, hastalıkları iyileştirmek ve ömrü uzatmaktır.",
      info: "Modern kimyanın babası, deneysel yöntemi kimya laboratuvarlarına sokan simyacı",
    },
    {
      name: "Dineveri",
      quote: "Bitkileri tanımak, doğanın dilini öğrenmektir.",
      info: "Botanik, astronomi ve tarih alanında eserler veren, 'Kitab'ün Nebat' (Bitkiler Kitabı) yazarı",
    },
    {
      name: "Farabi",
      quote: "Bilgelik, erdemlerin en yücesidir.",
      info: "İkinci Öğretmen (Muallim-i Sani) olarak anılan, siyaset felsefesi ve müzik teorisi üzerine önemli eserler veren filozof",
    },
    {
      name: "İbn-ül Heysem",
      quote: "Gerçeği aramak kendi başına çok değerlidir.",
      info: "Modern optiğin babası, Kitab el-Menazir (Optik Kitabı) yazarı, deneysel bilim metodunun öncüsü",
    },
    {
      name: "İbn Nefis",
      quote: "Vücudun sırları, onun en ince yapılarında gizlidir.",
      info: "Küçük kan dolaşımını ilk kez doğru tanımlayan hekim ve anatomist",
    },
    {
      name: "Meryem el-İcliyye (el-Usturlabi)",
      quote: "Yıldızların hareketi, zamanın ve kaderin şifresidir.",
      info: "10. yüzyılda Halep'te usturlap (gök ölçüm aleti) yapımında uzmanlaşmış bir bilim insanı",
    },
    {
      name: "Jose Rizal",
      quote: "Kalem, kılıçtan daha keskindir.",
      info: "Filipinler'in ulusal kahramanı, doktor, yazar ve sömürge karşıtı aydın",
    },
    {
      name: "Mimar Sinan",
      quote: "İlim, tecrübe ve sabır ile taş konuşur, kubbe uçar.",
      info: "Osmanlı İmparatorluğu'nun baş mimarı, 81 cami, 51 medrese dahil yüzlerce eserin yaratıcısı",
    },
    {
      name: "Piri Reis",
      quote: "Denizler, bilinmeyen diyarlara açılan kapılardır.",
      info: "Osmanlı denizcisi ve kartografı, 1513 tarihli dünya haritası ve Kitab-ı Bahriye eserleriyle tanınır",
    },
    {
      name: "Razi",
      quote: "Hakikat, şüphe ve araştırma ile bulunur.",
      info: "Çiçek ve kızamık hastalıklarını ilk kez ayıran, kimya ve tıp alanında öncü bilim insanı",
    },
    {
      name: "Ziryab",
      quote: "Zevk, bilgi ve zarafet hayatı güzelleştirir.",
      info: "9. yüzyılda Endülüs'te müzik, yemek kültürü, moda ve davranış kurallarını dönüştüren bilge ve müzisyen",
    },
    {
      name: "Ada Lovelace",
      quote:
        "Analitik Motor, yalnızca sayıları değil, sembolleri de işleyebilir.",
      info: "Dünyanın ilk bilgisayar programcısı, Charles Babbage'ın Analitik Makinesi için algoritma yazdı",
    },
    {
      name: "Charles Darwin",
      quote:
        "Hayatta kalan, en güçlü ya da en zeki olan değil, değişime en iyi uyum sağlayandır.",
      info: "Doğal seçilim yoluyla evrim teorisini ortaya koyan doğa bilimci",
    },
    {
      name: "Lubna",
      quote: "Kütüphane, bir medeniyetin hafızasıdır.",
      info: "10. yüzyıl Endülüs'ünde, Kurtuba Halifesi'nin kütüphaneci ve katibi olan, matematik ve edebiyat alim kadını",
    },
    {
      name: "Mary Anning",
      quote: "Her taş, dünyanın kadim bir hikayesini saklar.",
      info: "Fosil bilimi (paleontoloji) öncüsü, ilk eksiksiz İhtiyozor ve Plesiyozor fosillerini keşfetti",
    },
    {
      name: "Matrakçı Nasuh",
      quote: "Kalem ve kılıç, devletin iki temel direğidir.",
      info: "Matematikçi, tarihçi, minyatürcü ve silahşor; şehir minyatürleri ve silah sporları kitabıyla tanınır",
    },
    {
      name: "Zehravi",
      quote: "Cerrahi, tıbbın en zor ve en kesin sanatıdır.",
      info: "Endülüslü cerrah, modern cerrahinin öncüsü, 200'den fazla cerrahi aletin çizimlerini yaptı",
    },
    {
      name: "İbn Tufeyl",
      quote:
        "Hakikate, yalnız başına düşünerek ve gözlemleyerek de ulaşılabilir.",
      info: "Hay bin Yakzan adlı felsefi romanın yazarı, insan aklının ve gözlemin gücünü anlattı",
    },
  ];

  // Rastgele bilim insanı (her ana sayfa açılışında değişir)
  const scientistOfTheDay =
    scientists[Math.floor(Math.random() * scientists.length)];

  // Başarılar tipi
  type Achievement = {
    id: string;
    icon: string;
    name: string;
    desc: string;
    unlocked: boolean;
  };

  // Başarılar verisi (örnek). Gerçek veriyi backend veya localStorage'dan alabilirsiniz.
  const achievements: Achievement[] = [
    {
      id: "a1",
      icon: "🏅",
      name: "İlk Deney",
      desc: "İlk deneyi tamamla",
      unlocked: !!progress && progress.totalExperimentsCompleted > 0,
    },
    {
      id: "a2",
      icon: "🔬",
      name: "Meraklı",
      desc: "3 deneyi tamamla",
      unlocked: !!progress && progress.totalExperimentsCompleted >= 3,
    },
    {
      id: "a3",
      icon: "🌟",
      name: "Hafta Şampiyonu",
      desc: "Haftalık hedefi tamamla (7 gün üst üste deney yap)",
      unlocked: !!progress && progress.streak >= 7,
    },
    {
      id: "a4",
      icon: "🚀",
      name: "Keşif",
      desc: "5 deneyi tamamla",
      unlocked: !!progress && progress.totalExperimentsCompleted >= 5,
    },
    {
      id: "a5",
      icon: "📚",
      name: "Bilge",
      desc: "10 deneyi tamamla",
      unlocked: !!progress && progress.totalExperimentsCompleted >= 10,
    },
    {
      id: "a6",
      icon: "🎉",
      name: "Tamamlayıcı",
      desc: "Tüm haftaları tamamla (currentWeek >= 12)",
      unlocked: !!progress && progress.currentWeek >= 12,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const handleTabChange = (tab: "home" | "experiments" | "progress") => {
    if (tab === "home") {
      // already on home
    } else if (tab === "experiments") {
      navigate("/experiments");
    } else if (tab === "progress") {
      navigate("/progress");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FEFB] pb-[70px]">
      <section className="flex-1 flex flex-col items-center justify-center mt-10">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          {/* HERO */}
          <div className="bg-gradient-to-br from-[#E0F7F1] to-[#B8F0E8] rounded-[32px] p-8 shadow-md flex flex-col md:flex-row items-center gap-6">
            <div className="text-[72px] animate-float">
              {profile ? avatarEmojiMap[profile.avatar] : "🔬"}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mb-2">
                Merhaba{" "}
                {renderColorfulNickname(profile?.nickname || "Bilim Kaşifi")}{" "}
                {isYoung && (
                  <Speaker text={profile?.nickname || "Bilim Kaşifi"} />
                )}{" "}
                👋
              </h1>
              <p className="text-[#475569] mb-4">
                Bugün keşfetmeye hazır mısın?
                {isYoung && <Speaker text="Bugün keşfetmeye hazır mısın?" />}
              </p>
            </div>
          </div>

          {/* CURRENT EXPERIMENT */}
          <div>
            {loading ? (
              <div className="bg-white rounded-3xl p-10 text-center shadow-md">
                <div className="text-5xl mb-3 animate-pulse">🧪</div>
                <p className="text-sm text-[#6B7280]">Hazırlanıyor...</p>
              </div>
            ) : currentExperiment ? (
              <div className="bg-white rounded-3xl p-6 shadow-xl">
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
                  {isYoung && (
                    <Speaker
                      text={
                        (currentExperiment as any).childFriendly?.title ||
                        currentExperiment.title ||
                        ""
                      }
                    />
                  )}
                </h3>
                <p className="text-sm text-[#475569] mb-4">
                  {(currentExperiment as any).childFriendly?.description ||
                    currentExperiment.description}
                  {isYoung && (
                    <Speaker
                      text={
                        (currentExperiment as any).childFriendly?.description ||
                        currentExperiment.description ||
                        ""
                      }
                    />
                  )}
                </p>

                <div className="flex justify-between items-center mb-5">
                  <div className="flex gap-4 text-sm text-[#64748B]">
                    <span>
                      ⏱️ {currentExperiment.estimatedTime}{" "}
                      {isYoung && (
                        <Speaker text={currentExperiment.estimatedTime || ""} />
                      )}
                    </span>
                    <span>
                      ⭐ +{currentExperiment.points} XP{" "}
                      {isYoung && (
                        <Speaker text={`Artı ${currentExperiment.points} XP`} />
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(`/experiment/${currentExperiment.id}`)
                  }
                  className="w-full py-4 rounded-full bg-[length:300%_300%]
    bg-gradient-to-r
    from-[#F59E42]
    via-[#14B8A6]
    via-[#F472B6]
    to-[#3B82F6]
    animate-gradient text-white font-black text-lg transition"
                >
                  Deneye Başla 🚀
                  {isYoung && <Speaker text="Deneye Başla" />}
                </button>
              </div>
            ) : allExperiments.length > 0 ? (
              <div className="bg-white rounded-3xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-[#14B8A6] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Rastgele Deney
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D1FAE5] text-[#059669]">
                    {allExperiments[randomExperimentIndex]?.difficulty || "Kolay"}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-[#0F172A] mb-2">
                  {(allExperiments[randomExperimentIndex] as any)?.childFriendly?.title ||
                    allExperiments[randomExperimentIndex]?.title}
                  {isYoung && (
                    <Speaker
                      text={
                        (allExperiments[randomExperimentIndex] as any)?.childFriendly?.title ||
                        allExperiments[randomExperimentIndex]?.title ||
                        ""
                      }
                    />
                  )}
                </h3>
                <p className="text-sm text-[#475569] mb-4">
                  {(allExperiments[randomExperimentIndex] as any)?.childFriendly?.description ||
                    allExperiments[randomExperimentIndex]?.description}
                  {isYoung && (
                    <Speaker
                      text={
                        (allExperiments[randomExperimentIndex] as any)?.childFriendly?.description ||
                        allExperiments[randomExperimentIndex]?.description ||
                        ""
                      }
                    />
                  )}
                </p>

                <div className="flex justify-between items-center mb-5">
                  <div className="flex gap-4 text-sm text-[#64748B]">
                    <span>
                      ⏱️ {allExperiments[randomExperimentIndex]?.estimatedTime || "15 dk"}{" "}
                      {isYoung && (
                        <Speaker text={allExperiments[randomExperimentIndex]?.estimatedTime || "15 dk"} />
                      )}
                    </span>
                    <span>
                      ⭐ +{allExperiments[randomExperimentIndex]?.points || 10} XP{" "}
                      {isYoung && (
                        <Speaker text={`Artı ${allExperiments[randomExperimentIndex]?.points || 10} XP`} />
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(`/experiment/${allExperiments[randomExperimentIndex]?.id}`)
                  }
                  className="w-full py-4 rounded-full bg-[length:300%_300%]
    bg-gradient-to-r
    from-[#F59E42]
    via-[#14B8A6]
    via-[#F472B6]
    to-[#3B82F6]
    animate-gradient text-white font-black text-lg transition"
                >
                  Deneye Göz At 👀
                  {isYoung && <Speaker text="Deneye Göz At" />}
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

          {/* Achievements */}
          <div className="bg-white rounded-[32px] p-6 shadow-md mb-6">
            <h3 className="text-lg font-bold text-[#1F2937] mb-4">
              🏆 Başarılar ({unlockedCount}/{achievements.length})
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {achievements.slice(0, 6).map((a) => (
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

          {/* DİĞER MERAKLI ÇOCUKLAR */}
          <div className="bg-gradient-to-br from-[#F3E8FF] to-[#E9D5FF] rounded-3xl p-6 text-center mb-14 shadow-md">
            <div className="flex justify-center items-center flex-col">
              <h3 className="text-lg font-bold mb-1 ">
                Diğer Meraklı Çocuklar Büyüdü ve Neler Yaptı?
                {isYoung && (
                  <Speaker text="Diğer Meraklı Çocuklar Büyüdü ve Neler Yaptı?" />
                )}
              </h3>
              <span className="font-bold text-[#7C3AED] text-lg">
                {scientistOfTheDay.name}
                {isYoung && <Speaker text={scientistOfTheDay.name} />}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-[#D8B4FE]">
              <div className="max-w-full bg-white/50 rounded-xl p-3 mx-auto ">
                <p className="text-md text-[#4B5563] mt-1 italic">
                  "{scientistOfTheDay.quote}"
                  {isYoung && <Speaker text={scientistOfTheDay.quote} />}
                </p>
                <div className="text-sm text-[#6B7280] mt-1">
                  {scientistOfTheDay.info}
                  {isYoung && <Speaker text={scientistOfTheDay.info} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="w-full py-4 bg-[#E0F7F1] text-center text-xs text-[#64748B]">
        © {new Date().getFullYear()} Cell-o. Tüm hakları saklıdır.
      </footer>
      <TabNavigation activeTab="home" onTabChange={handleTabChange} />
    </main>
  );
}
