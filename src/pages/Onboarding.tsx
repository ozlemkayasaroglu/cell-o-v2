import { useNavigate } from "react-router-dom";
import AppFooter from "../components/AppFooter";

export default function Onboarding() {
  const navigate = useNavigate();

  const handleStart = () => {
    localStorage.setItem("onboarding_completed", "true");
    navigate("/profile-setup");
  };

  return (
    <div className="min-h-screen justify-between">
      <div className="min-h-screen bg-[#F8FEFB] flex items-center justify-center px-4">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* LEFT – Illustration */}
          <div className="relative flex items-center justify-center bg-gradient-to-br from-[#E0F7F1] to-[#B8F0E8] p-8 md:p-12">
            <img
              src="/onboarding.png"
              alt="Cell-o onboarding"
              className="w-full max-w-sm md:max-w-md object-contain rounded-2xl "
            />
          </div>

          {/* RIGHT – Content */}
          <div className="flex flex-col justify-center p-8 md:p-12 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight mb-4 font-baloo">
              Bilim artık <br className="hidden md:block" />
              çok{" "}
              <span>
                <span style={{ color: "#F59E42", fontFamily: "Fredoka" }}>
                  k
                </span>
                <span
                  style={{
                    color: "#14B8A6",
                    fontFamily: "Fredoka",
                  }}
                >
                  e
                </span>
                <span style={{ color: "#F472B6", fontFamily: "Fredoka" }}>
                  y
                </span>
                <span style={{ color: "#3B82F6", fontFamily: "Fredoka" }}>
                  i
                </span>
                <span style={{ color: "#F59E42", fontFamily: "Fredoka" }}>
                  f
                </span>
                <span style={{ color: "#14B8A6", fontFamily: "Fredoka" }}>
                  l
                </span>
                <span style={{ color: "#F472B6", fontFamily: "Fredoka" }}>
                  i
                </span>
              </span>
            </h1>

            <span className="text-base md:text-lg text-[#475569] max-w-md mb-4">
              <span
                style={{
                  color: "#14B8A6",
                  fontFamily: "Fredoka",
                  fontWeight: "bold",
                }}
              >
                c
              </span>
              <span
                style={{
                  color: "#F472B6",
                  fontFamily: "Fredoka",
                  fontWeight: "bold",
                }}
              >
                e
              </span>
              <span
                style={{
                  color: "#3B82F6",
                  fontFamily: "Fredoka",
                  fontWeight: "bold",
                }}
              >
                l
              </span>
              <span
                style={{
                  color: "#F59E42",
                  fontFamily: "Fredoka",
                  fontWeight: "bold",
                }}
              >
                l
              </span>
              <span
                style={{
                  color: "#14B8A6",
                  fontFamily: "Fredoka",
                  fontWeight: "bold",
                }}
              >
                -
              </span>
              <span
                style={{
                  color: "#F472B6",
                  fontFamily: "Fredoka",
                  fontWeight: "bold",
                }}
              >
                o{" "}
              </span>
              ile çocuklar her hafta evde, güvenli ve eğlenceli deneyler yaparak
              bilimi keşfeder.
            </span>

            <button
              onClick={handleStart}
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
              Deneylere Başla
              <span className="text-2xl">🚀</span>
            </button>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}
