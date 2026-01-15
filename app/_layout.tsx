import { useEffect, useState } from 'react';
import { Stack, useRouter, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    checkAppStatus();
  }, []);

  useEffect(() => {
    if (!isLoading && initialRoute && navigationState?.key) {
      // Navigation hazır olduğunda yönlendir
      router.replace(initialRoute as any);
    }
  }, [isLoading, initialRoute, navigationState?.key]);

  const checkAppStatus = async () => {
    try {
      // TEST: Her açılışta temizle - sonra bu satırı sil!
      await AsyncStorage.clear();

      const [onboardingCompleted, profileCompleted] = await Promise.all([
        AsyncStorage.getItem('onboarding_completed'),
        AsyncStorage.getItem('profile_completed'),
      ]);

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
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}
