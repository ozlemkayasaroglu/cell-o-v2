import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    key: 'explore',
    image: '/onboarding.png',
    title: 'Keşfet & Deney Yap!',
    description:
      'Küçük laboratuvarımıza katıl, merakın harika keşiflere yol açsın. Güvenli, eğlenceli ve ilham dolu bir deneyim seni bekliyor.',
    icon: '🧪',
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex === slides.length - 1) {
      localStorage.setItem('onboarding_completed', 'true');
      navigate('/profile-setup');
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    navigate('/profile-setup');
  };

  const slide = slides[currentIndex];

  return (
    <div className="min-h-screen bg-[#F8FEFB] flex flex-col">
      {/* Top Illustration */}
      <div
        className="relative w-full overflow-hidden rounded-b-[32px] bg-[#E0F7F1]"
        style={{ height: 'min(110vw, 500px)' }}
      >
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover"
        />

        {/* Logo - positioned at bottom center, overlapping */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-20">
          <div className="w-[140px] h-[140px] bg-white rounded-3xl shadow-lg p-2 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="absolute top-8 right-6 bg-white rounded-[20px] px-4 py-1.5 shadow-sm flex items-center gap-1 hover:bg-gray-50 transition"
        >
          <span className="text-[#222] font-semibold text-[15px]">Atla</span>
          <span className="text-[#222] text-lg font-bold mt-0.5">›</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-16 pb-10 max-w-2xl mx-auto w-full">
        {/* Icon Badge */}
        <div className="w-12 h-12 bg-[#14B8A6]/15 rounded-full flex items-center justify-center mb-5">
          <span className="text-[28px]">{slide.icon}</span>
        </div>

        {/* Title */}
        <h1 className="text-[26px] font-bold text-[#222] text-center mb-3">
          {slide.title}
        </h1>

        {/* Description */}
        <p className="text-base text-[#4B5563] text-center mb-7 leading-[22px] max-w-md">
          {slide.description}
        </p>

        {/* Dots */}
        {slides.length > 1 && (
          <div className="flex gap-2 mb-8">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`w-[22px] h-[7px] rounded-[4px] transition-colors ${
                  idx === currentIndex ? 'bg-[#14B8A6]' : 'bg-[#E5E7EB]'
                }`}
              />
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Start Button */}
        <button
          onClick={handleNext}
          className="w-full max-w-md bg-[#14B8A6] text-white font-bold text-lg py-[18px] px-8 rounded-[32px] shadow-lg shadow-[#14B8A6]/20 flex items-center justify-center gap-2 hover:bg-[#0D9488] transition"
        >
          <span>
            {currentIndex === slides.length - 1 ? 'Keşfetmeye Başla' : 'İleri'}
          </span>
          <span className="text-[22px] font-bold mt-0.5">→</span>
        </button>
      </div>
    </div>
  );
}
