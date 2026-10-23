import { CharSetKey } from '../utils/generator';

interface CharSetToggleProps {
  selected: CharSetKey[];
  onChange: (sets: CharSetKey[]) => void;
}

const labels: Record<CharSetKey, { name: string; icon: string; preview: string }> = {
  lowercase: { name: 'Lowercase', icon: 'Aa', preview: 'a-z' },
  uppercase: { name: 'Uppercase', icon: 'AA', preview: 'A-Z' },
  numbers: { name: 'Numbers', icon: '09', preview: '0-9' },
  symbols: { name: 'Symbols', icon: '#!', preview: '!@#$%^&*' },
  special: { name: 'Special', icon: '<>', preview: '()-_=+[]{}...' },
};

export default function CharSetToggle({ selected, onChange }: CharSetToggleProps) {
  const toggle = (key: CharSetKey) => {
    if (selected.includes(key)) {
      onChange(selected.filter((s) => s !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
        Character Sets
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {(Object.keys(labels) as CharSetKey[]).map((key) => {
          const isActive = selected.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`relative group flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800'
              }`}
            >
              <div
                className={`text-lg font-mono font-bold ${
                  isActive ? 'text-emerald-400' : 'text-gray-400'
                }`}
              >
                {labels[key].icon}
              </div>
              <div
                className={`text-xs font-medium ${
                  isActive ? 'text-emerald-300' : 'text-gray-500'
                }`}
              >
                {labels[key].name}
              </div>
              <div
                className={`text-[10px] font-mono ${
                  isActive ? 'text-emerald-400/60' : 'text-gray-600'
                }`}
              >
                {labels[key].preview}
              </div>
              {isActive && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
