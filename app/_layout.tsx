import { useEffect, useState } from 'react';
import { Stack, useRouter, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    // On every app start, reset onboarding and profile so onboarding always shows
    AsyncStorage.multiRemove(['onboarding_completed', 'profile_completed']).then(() => {
      checkAppStatus();
    });
  }, []);

  useEffect(() => {
    if (!isLoading && initialRoute && navigationState?.key) {
      // Navigation hazır olduğunda yönlendir
      router.replace(initialRoute as any);
    }
  }, [isLoading, initialRoute, navigationState?.key]);

  const checkAppStatus = async () => {
    try {
      // await AsyncStorage.clear(); // GEREKSİZ TEMİZLEME KALDIRILDI
      const [onboardingCompleted, profileCompleted] = await Promise.all([
        AsyncStorage.getItem('onboarding_completed'),
        AsyncStorage.getItem('profile_completed'),
      ]);

      console.log(
        'Onboarding:',
        onboardingCompleted,
        'Profile:',
        profileCompleted
      );

      if (onboardingCompleted !== 'true') {
        setInitialRoute('/onboarding');
      } else if (profileCompleted !== 'true') {
        setInitialRoute('/profile-setup');
      } else {
        setInitialRoute('/(tabs)');
      }
    } catch (error) {
      console.error('Uygulama durumu kontrol edilemedi:', error);
      setInitialRoute('/onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0D9488',
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
          <Stack.Screen
            name="profile-setup"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </>
    </SafeAreaView>
  );
}
