import { Tabs } from 'expo-router';
import { Home, TrendingUp, Microscope } from 'lucide-react-native';

// Science Lab theme colors - Doğa teması
const scienceColors = {
  primary: '#0D9488',
  secondary: '#F59E0B',
  accent: '#10B981',
  background: '#F0FDF9',
  cardBg: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Her ekran kendi header'ını yönetecek
        tabBarActiveTintColor: scienceColors.primary,
        tabBarInactiveTintColor: scienceColors.textLight,
        tabBarStyle: {
          backgroundColor: scienceColors.cardBg,
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="experiments"
        options={{
          title: 'Deneyler',
          tabBarIcon: ({ size, color }) => (
            <Microscope size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'İlerleme',
          tabBarIcon: ({ size, color }) => (
            <TrendingUp size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
