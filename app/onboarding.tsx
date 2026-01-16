import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scienceTheme } from "../theme/science";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "explore",
    image: require("../assets/images/onboarding.png"),
    title: "Keşfet & Deney Yap!",
    description:
      "Küçük laboratuvarımıza katıl, merakın harika keşiflere yol açsın. Güvenli, eğlenceli ve ilham dolu bir deneyim seni bekliyor.",
    icon: "🧪",
  },
  // Diğer slaytlar eklenebilir
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const clearStorageAndReload = async () => {
    try {
      await AsyncStorage.removeItem("onboarding_completed");
      await AsyncStorage.removeItem("profile_completed");
      await AsyncStorage.removeItem("profile_data");

      window.location.reload();
    } catch (error) {
      console.error("❌ Temizleme hatası:", error);
    }
  };

  const handleNext = async () => {
    // Son slaytta ise onboarding tamamla
    if (currentIndex === slides.length - 1) {
      await AsyncStorage.setItem("onboarding_completed", "true");
      router.replace("/profile-setup");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("onboarding_completed", "true");
    router.replace("/profile-setup");
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, idx) => (
        <View
          key={idx}
          style={[
            styles.dot,
            {
              backgroundColor:
                idx === currentIndex ? scienceTheme.colors.primary : "#E5E7EB",
            },
          ]}
        />
      ))}
    </View>
  );

  const slide = slides[currentIndex];

  return (
    <View style={styles.container}>
      {/* Debug Butonu */}
      <TouchableOpacity
        style={styles.debugButton}
        onPress={clearStorageAndReload}
      >
        <Text style={styles.debugButtonText}>🧹 Sıfırla</Text>
      </TouchableOpacity>

      {/* Top Illustration */}
      <View style={styles.illustrationContainer}>
        <Image
          source={slide.image}
          style={styles.illustration}
          resizeMode="cover"
        />
        {/* Logo ekle: beyaz alanın ortasına */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Atla</Text>
          <Text style={styles.skipArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.iconBadge}>
          <Text style={styles.iconText}>{slide.icon}</Text>
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
        {renderDots()}
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.startButtonText}>
            {currentIndex === slides.length - 1 ? "Keşfetmeye Başla" : "İleri"}
          </Text>
          <Text style={styles.startButtonArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FEFB",
  },
  illustrationContainer: {
    width: "100%",
    height: width * 1.1,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    backgroundColor: "#E0F7F1",
    position: "relative",
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  skipButton: {
    position: "absolute",
    top: 32,
    right: 24,
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  skipText: {
    color: "#222",
    fontWeight: "600",
    fontSize: 15,
    marginRight: 4,
  },
  skipArrow: {
    color: "#222",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  iconBadge: {
    backgroundColor: scienceTheme.colors.primary + "22",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    marginBottom: 12,
    marginTop: 2,
  },
  description: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    width: 22,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: scienceTheme.colors.primary,
    borderRadius: 32,
    paddingVertical: 18,
    paddingHorizontal: 32,
    marginTop: 8,
    width: "100%",
    justifyContent: "center",
    shadowColor: scienceTheme.colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 8,
  },
  startButtonArrow: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 1,
  },
  logoContainer: {
    position: "absolute",
    bottom: -10,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 24,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  debugButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#FF6B6B",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 10,
  },
  debugButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
