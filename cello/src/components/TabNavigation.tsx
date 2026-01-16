import { Home, Microscope, TrendingUp } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'home' | 'experiments' | 'progress';
  onTabChange: (tab: 'home' | 'experiments' | 'progress') => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  const tabs = [
    { id: 'home' as const, label: 'Ana Sayfa', Icon: Home },
    { id: 'experiments' as const, label: 'Deneyler', Icon: Microscope },
    { id: 'progress' as const, label: 'İlerleme', Icon: TrendingUp },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-0 shadow-[0_-4px_8px_rgba(0,0,0,0.1)] z-50">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-[70px] px-2">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === id ? 'text-[#0D9488]' : 'text-[#6B7280]'
            }`}
          >
            <Icon
              size={24}
              strokeWidth={2}
              className={activeTab === id ? 'text-[#0D9488]' : 'text-[#6B7280]'}
            />
            <span className="text-xs font-semibold mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
