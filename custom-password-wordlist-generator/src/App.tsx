import { useState, useRef, useCallback } from 'react';
import {
  Shield,
  Zap,
  Settings2,
  KeyRound,
  Hash,
  LayoutList,
  Loader2,
  AlertTriangle,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { saveAs } from 'file-saver';
import CharSetToggle from './components/CharSetToggle';
import PasswordPreview from './components/PasswordPreview';
import {
  GeneratorConfig,
  CharSetKey,
  generateWordlist,
  calculateTotalCombinations,
} from './utils/generator';

export default function App() {
  const [baseWord, setBaseWord] = useState('');
  const [passwordLength, setPasswordLength] = useState(8);
  const [mode, setMode] = useState<'all' | 'custom'>('custom');
  const [customLimit, setCustomLimit] = useState(1000);
  const [charSets, setCharSets] = useState<CharSetKey[]>(['lowercase', 'numbers']);
  const [position, setPosition] = useState<'prefix' | 'suffix' | 'both'>('prefix');
  const [caseMutations, setCaseMutations] = useState(false);
  const [leetSpeak, setLeetSpeak] = useState(false);

  const [passwords, setPasswords] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<{ aborted: boolean }>({ aborted: false });

  const config: GeneratorConfig = {
    baseWord,
    passwordLength,
    mode,
    customLimit,
    charSets,
    position,
    caseMutations,
    leetSpeak,
  };

  const estimatedTotal = baseWord.length > 0 && charSets.length > 0
    ? calculateTotalCombinations(config)
    : 0;

  const handleGenerate = useCallback(() => {
    if (!baseWord.trim()) {
      setError('Please enter a base word');
      return;
    }
    if (charSets.length === 0) {
      setError('Please select at least one character set');
      return;
    }
    if (baseWord.length >= passwordLength) {
      setError('Password length must be greater than the base word length');
      return;
    }
    if (mode === 'all' && estimatedTotal > 500000) {
      const proceed = window.confirm(
        `This will generate approximately ${estimatedTotal.toLocaleString()} passwords (capped at 500,000). This may take a while. Continue?`
      );
      if (!proceed) return;
    }

    setError(null);
    setPasswords([]);
    setIsGenerating(true);
    setProgress(0);
    setGenerationTime(null);

    abortRef.current = { aborted: false };
    const startTime = Date.now();

    // Use setTimeout to not block UI
    setTimeout(() => {
      generateWordlist(
        config,
        (prog) => {
          if (prog.done) {
            setPasswords(prog.passwords);
            setIsGenerating(false);
            setProgress(100);
            setGenerationTime(Date.now() - startTime);
          } else {
            const total = prog.total > 0 ? prog.total : estimatedTotal;
            setProgress(total > 0 ? Math.min(99, Math.round((prog.generated / total) * 100)) : 50);
          }
        },
        abortRef.current
      );
    }, 50);
  }, [baseWord, passwordLength, mode, customLimit, charSets, position, caseMutations, leetSpeak, config, estimatedTotal]);

  const handleStop = () => {
    abortRef.current.aborted = true;
    setIsGenerating(false);
  };

  const handleDownload = () => {
    const blob = new Blob([passwords.join('\n')], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `wordlist_${baseWord}_${passwordLength}chars.txt`);
  };

  const handleReset = () => {
    setBaseWord('');
    setPasswordLength(8);
    setMode('custom');
    setCustomLimit(1000);
    setCharSets(['lowercase', 'numbers']);
    setPosition('prefix');
    setCaseMutations(false);
    setLeetSpeak(false);
    setPasswords([]);
    setProgress(0);
    setGenerationTime(null);
    setError(null);
  };

  const formatNumber = (n: number) => {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Password Wordlist Generator
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              WordForge
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Generate powerful password wordlists from any base word. Create every possible combination
            with numbers, symbols, and special characters.
          </p>
        </header>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Base Word', value: baseWord || '—', icon: KeyRound, color: 'text-purple-400' },
            { label: 'Password Length', value: passwordLength.toString(), icon: Hash, color: 'text-blue-400' },
            { label: 'Est. Combinations', value: estimatedTotal > 0 ? formatNumber(estimatedTotal) : '—', icon: LayoutList, color: 'text-amber-400' },
            { label: 'Generated', value: passwords.length > 0 ? formatNumber(passwords.length) : '—', icon: Shield, color: 'text-emerald-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
              <div className="text-lg font-bold text-white truncate font-mono">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main Configuration */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Configuration</h2>
              <p className="text-sm text-gray-500">Set up your wordlist parameters</p>
            </div>
          </div>

          {/* Base Word + Length */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Base Word
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={baseWord}
                  onChange={(e) => setBaseWord(e.target.value)}
                  placeholder="e.g., ali, admin, root..."
                  className="w-full pl-11 pr-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 font-mono focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Password Length: <span className="text-emerald-400">{passwordLength}</span>
              </label>
              <div className="pt-2 px-1">
                <input
                  type="range"
                  min={2}
                  max={16}
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>2</span>
                  <span>4</span>
                  <span>6</span>
                  <span>8</span>
                  <span>10</span>
                  <span>12</span>
                  <span>14</span>
                  <span>16</span>
                </div>
              </div>
            </div>
          </div>

          {/* Character Sets */}
          <CharSetToggle selected={charSets} onChange={setCharSets} />

          {/* Position */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Word Position
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'prefix' as const, label: 'Prefix', desc: 'ali + ***', icon: '→' },
                { value: 'suffix' as const, label: 'Suffix', desc: '*** + ali', icon: '←' },
                { value: 'both' as const, label: 'Both', desc: 'ali*** & ***ali', icon: '↔' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPosition(opt.value)}
                  className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl border-2 transition-all cursor-pointer ${
                    position === opt.value
                      ? 'border-emerald-500 bg-emerald-500/10 text-white'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <div className="text-lg mb-1">{opt.icon}</div>
                  <div className="text-sm font-semibold">{opt.label}</div>
                  <div className="text-xs text-gray-500 font-mono">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Generation Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('all')}
                className={`text-left px-4 py-4 rounded-xl border-2 transition-all cursor-pointer ${
                  mode === 'all'
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap className={`w-5 h-5 ${mode === 'all' ? 'text-amber-400' : 'text-gray-500'}`} />
                  <span className={`font-bold ${mode === 'all' ? 'text-white' : 'text-gray-300'}`}>
                    All Combinations
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Generate every possible combination (capped at 500K). Best for shorter passwords.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setMode('custom')}
                className={`text-left px-4 py-4 rounded-xl border-2 transition-all cursor-pointer ${
                  mode === 'custom'
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Settings2 className={`w-5 h-5 ${mode === 'custom' ? 'text-cyan-400' : 'text-gray-500'}`} />
                  <span className={`font-bold ${mode === 'custom' ? 'text-white' : 'text-gray-300'}`}>
                    Custom Limit
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Generate a specific number of random unique passwords from all possible combinations.
                </p>
              </button>
            </div>

            {mode === 'custom' && (
              <div className="mt-3 space-y-2">
                <label className="block text-sm text-gray-400">
                  Number of passwords to generate:
                </label>
                <input
                  type="number"
                  min={1}
                  max={100000}
                  value={customLimit}
                  onChange={(e) => setCustomLimit(Math.max(1, Math.min(100000, parseInt(e.target.value) || 1)))}
                  className="w-full sm:w-64 px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
                <div className="flex gap-2 flex-wrap">
                  {[100, 500, 1000, 1500, 5000, 10000].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCustomLimit(n)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        customLimit === n
                          ? 'bg-cyan-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {n.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Advanced Options */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Advanced Options
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={caseMutations}
                    onChange={(e) => setCaseMutations(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-700 rounded-full peer-checked:bg-emerald-500 transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    Case Mutations
                  </div>
                  <div className="text-xs text-gray-600">ali, ALI, Ali, aLi...</div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={leetSpeak}
                    onChange={(e) => setLeetSpeak(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-700 rounded-full peer-checked:bg-emerald-500 transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    Leet Speak (1337)
                  </div>
                  <div className="text-xs text-gray-600">@l1, 4l!, @1i...</div>
                </div>
              </label>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Generate Button */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer text-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Generate Wordlist
                </>
              )}
            </button>

            {isGenerating && (
              <button
                onClick={handleStop}
                className="px-6 py-4 bg-red-600/20 border border-red-500/40 text-red-400 font-bold rounded-xl hover:bg-red-600/30 transition-all cursor-pointer"
              >
                Stop
              </button>
            )}

            <button
              onClick={handleReset}
              className="px-6 py-4 bg-gray-800 border border-gray-700 text-gray-300 font-bold rounded-xl hover:bg-gray-700 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Generating passwords...</span>
                <span className="text-emerald-400 font-mono">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Generation Stats */}
          {generationTime !== null && !isGenerating && (
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-emerald-400 font-bold">{passwords.length.toLocaleString()}</span>
                passwords generated
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                in
                <span className="text-cyan-400 font-bold">
                  {generationTime < 1000
                    ? `${generationTime}ms`
                    : `${(generationTime / 1000).toFixed(2)}s`
                  }
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                ≈
                <span className="text-purple-400 font-bold">
                  {generationTime > 0
                    ? formatNumber(Math.round(passwords.length / (generationTime / 1000)))
                    : '∞'
                  }
                </span>
                passwords/sec
              </div>
            </div>
          )}
        </div>

        {/* Password Preview */}
        <PasswordPreview passwords={passwords} onDownload={handleDownload} />

        {/* Footer */}
        <footer className="text-center pb-8">
          <p className="text-xs text-gray-600">
            ⚠️ For educational and authorized security testing purposes only.
            Never use generated wordlists for unauthorized access.
          </p>
        </footer>
      </div>
    </div>
  );
}
