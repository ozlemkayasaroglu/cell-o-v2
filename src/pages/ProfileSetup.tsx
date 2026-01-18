import { useState } from "react";
import { useNavigate } from "react-router-dom";

const avatars = [
  { id: "unicorn", emoji: "🦄" },
  { id: "butterfly", emoji: "🦋" },
  { id: "ladybug", emoji: "🐞" },
  { id: "bunny", emoji: "🐰" },
  { id: "cat", emoji: "🐱" },
  { id: "dog", emoji: "🐶" },
];

const ageGroups = [
  { id: "4-5", label: "4-5 yaş", emoji: "🫘" },
  { id: "6-7", label: "6-7 yaş", emoji: "🌱" },
  { id: "8-9", label: "8-9 yaş", emoji: "🌿" },
  { id: "10-12", label: "10-12 yaş", emoji: "🌳" },
];

const getDefaultNickname = (ageId: string) => {
  switch (ageId) {
    case "4-5":
      return "Minik Kaşif";
    case "6-7":
      return "Bilimci Çocuk";
    case "8-9":
      return "Genç Mucit";
    case "10-12":
      return "Küçük Bilim İnsanı";
    default:
      return "Minik Kaşif";
  }
};

export default function ProfileSetup() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("unicorn");
  const [selectedAge, setSelectedAge] = useState("8-9");

  const handleContinue = () => {
    const profile = {
      nickname: nickname.trim() || getDefaultNickname(selectedAge),
      avatar: selectedAvatar,
      ageGroup: selectedAge,
      createdAt: new Date().toISOString(),
      totalPoints: 0,
      completedExperiments: [],
      badges: [],
      currentStreak: 0,
    };

    localStorage.setItem("user_profile", JSON.stringify(profile));
    localStorage.setItem("profile_completed", "true");
    navigate("/home");
  };

  const avatarEmoji = avatars.find((a) => a.id === selectedAvatar)?.emoji;

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
    <div className="min-h-screen bg-[#F8FEFB] flex items-center justify-center px-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT – Preview / Illustration */}
        <div className="bg-gradient-to-br from-[#E0F7F1] to-[#B8F0E8] flex flex-col items-center justify-center p-10 text-center">
          <img src="/logo.png" alt="Cell-o" className="w-28 mb-6" />

          <div className="text-[72px] mb-3">{avatarEmoji}</div>

          <h2 className="text-2xl font-extrabold text-[#0F172A] mb-1">
            {renderColorfulNickname(
              nickname.trim() || getDefaultNickname(selectedAge),
            )}
          </h2>

          <p className="text-[#475569]">
            {ageGroups.find((a) => a.id === selectedAge)?.label}
          </p>
        </div>

        {/* RIGHT – Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-2">
            Profilini Oluştur
          </h1>

          <p className="text-[#475569] mb-8 max-w-md">
            Sana özel deneyleri hazırlayabilmemiz için birkaç adım yeterli.
          </p>

          {/* Nickname */}
          <div className="mb-6">
            <label className="font-semibold mb-2 block">Takma Ad</label>
            <input
              type="text"
              placeholder="Takma adını yaz"
              value={nickname}
              maxLength={20}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full rounded-2xl border-2 border-gray-100 px-4 py-3 focus:outline-none focus:border-[#14B8A6]"
            />
          </div>

          {/* Avatar */}
          <div className="mb-6">
            <label className="font-semibold mb-2 block">Avatar Seç</label>
            <div className="grid grid-cols-6 gap-2">
              {avatars.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAvatar(a.id)}
                  className={`aspect-square rounded-2xl text-3xl flex items-center justify-center border-2 transition ${
                    selectedAvatar === a.id
                      ? "border-[#14B8A6] bg-[#ECFEFF]"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  {a.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Age Group */}
          <div className="mb-8">
            <label className="font-semibold mb-2 block">Yaş Grubu</label>
            <div className="grid grid-cols-2 gap-3">
              {ageGroups.map((age) => (
                <button
                  key={age.id}
                  onClick={() => setSelectedAge(age.id)}
                  className={`py-4 rounded-2xl flex flex-col items-center border-2 transition ${
                    selectedAge === age.id
                      ? "border-[#14B8A6] bg-[#ECFEFF]"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <span className="text-3xl">{age.emoji}</span>
                  <span className="text-sm font-semibold mt-1">
                    {age.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleContinue}
            className="
    inline-flex items-center justify-center gap-3
    bg-[length:300%_300%]
    bg-gradient-to-r
    from-[#F59E42]
    via-[#14B8A6]
    via-[#F472B6]
    to-[#3B82F6]
    animate-gradient
    text-white font-black text-lg
    px-8 py-4 rounded-full
    shadow-lg
    hover:scale-105
    transition-all duration-300
    active:scale-95
    w-full md:w-fit
  "
          >
            Deneylere Başla 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
