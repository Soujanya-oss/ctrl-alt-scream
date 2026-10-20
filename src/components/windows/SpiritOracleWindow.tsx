import React, { useState } from 'react';
import { sound } from '../../utils/soundEngine';
import { CurseId } from '../../types';
import { Sparkles, Terminal, Flame, Lightbulb, Calculator, HelpCircle, Send } from 'lucide-react';

interface SpiritOracleWindowProps {
  activeCurses: Set<CurseId>;
}

export const SpiritOracleWindow: React.FC<SpiritOracleWindowProps> = ({ activeCurses }) => {
  const [mode, setMode] = useState<'improve' | 'roast' | 'candy_tax' | 'fortune'>('improve');
  const [inputText, setInputText] = useState('');
  const [victimName, setVictimName] = useState('');
  const [candyCount, setCandyCount] = useState(42);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>(
    'I AM GRIMBYTE 9000. Ask me how to improve your Halloween prank, roast your friend, or audit your candy taxes!'
  );

  const handleAskOracle = async (overrideType?: string, customPrompt?: string) => {
    setLoading(true);
    sound.playGlitch();

    const requestType = overrideType || (mode === 'candy_tax' ? 'custom_prank' : mode === 'improve' ? 'curse_idea' : mode);
    let promptPayload = customPrompt || inputText;

    if (mode === 'candy_tax' && !customPrompt) {
      promptPayload = `Calculate the humorous Ghost IRS Candy Tax for someone who gathered ${candyCount} candy pieces. Break down how many Reese's and KitKats are legally owed to the resident computer ghost under the Halloween Financial Code.`;
    }

    try {
      const res = await fetch('/api/spirit-oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: requestType,
          input: promptPayload,
          victimName: victimName || 'Friend',
          activeCurses: Array.from(activeCurses),
        }),
      });

      const data = await res.json();
      if (data.response) {
        setResponse(data.response);
        sound.playGhostMoan();
      }
    } catch {
      setResponse(
        '👻 OUIJA STATIC: The spirits recommend placing a plastic spider on their spacebar and enabling "Gravity Inversion"!'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-4 text-zinc-100 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-950/60 via-zinc-900 to-emerald-950/40 border border-purple-500/30 rounded-xl">
        <span className="text-3xl animate-pulse">👁️</span>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-purple-300">
              Grimbyte 9000: AI Spirit Advisor & Prank Engine
            </h3>
            <span className="text-[10px] font-mono bg-purple-900/60 text-purple-300 px-1.5 py-0.5 rounded border border-purple-700">
              Powered by Gemini
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Your paranormal AI consultant for optimizing harmless tricks, generating victim roasts,
            and auditing Halloween candy finance!
          </p>
        </div>
      </div>

      {/* Mode Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => {
            setMode('improve');
            sound.playGlitch();
          }}
          className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
            mode === 'improve'
              ? 'bg-purple-950/60 border-purple-500 text-purple-300 shadow-sm'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Improve My Prank</span>
        </button>

        <button
          onClick={() => {
            setMode('roast');
            sound.playGlitch();
          }}
          className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
            mode === 'roast'
              ? 'bg-purple-950/60 border-purple-500 text-purple-300 shadow-sm'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Flame className="w-4 h-4 text-red-400" />
          <span>Roast Prank Victim</span>
        </button>

        <button
          onClick={() => {
            setMode('candy_tax');
            sound.playGlitch();
          }}
          className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
            mode === 'candy_tax'
              ? 'bg-purple-950/60 border-purple-500 text-purple-300 shadow-sm'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>Candy Tax Audit 🍬</span>
        </button>

        <button
          onClick={() => {
            setMode('fortune');
            sound.playGlitch();
          }}
          className={`p-2.5 rounded-lg border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
            mode === 'fortune'
              ? 'bg-purple-950/60 border-purple-500 text-purple-300 shadow-sm'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>Spooky Cyber Tarot</span>
        </button>
      </div>

      {/* Input controls based on mode */}
      <div className="bg-zinc-900/90 p-3.5 rounded-xl border border-zinc-800 flex flex-col gap-3">
        {mode === 'roast' && (
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Friend's Name (e.g. Alex, Dave, Sarah)"
              value={victimName}
              onChange={(e) => setVictimName(e.target.value)}
              className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
            <input
              type="text"
              placeholder="What are they doing? (e.g. drinking coffee, writing email)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        )}

        {mode === 'improve' && (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Describe your current prank setup or idea (e.g. 'I want to pretend the mouse cursor melted')"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="text-zinc-500 self-center">Quick presets:</span>
              <button
                onClick={() => handleAskOracle('curse_idea', 'Best office computer prank for someone who loves coffee')}
                className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300"
              >
                ☕ Coffee Desk Trick
              </button>
              <button
                onClick={() => handleAskOracle('curse_idea', 'How to combine gravity inversion with phantom typing')}
                className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300"
              >
                🙃 Gravity + Typing Combo
              </button>
              <button
                onClick={() => handleAskOracle('curse_idea', 'Prank to play on our GDG dev team')}
                className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300"
              >
                💻 GDG Developer Prank
              </button>
            </div>
          </div>
        )}

        {mode === 'candy_tax' && (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 text-xs text-zinc-300">
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Total Halloween Treats in Stash:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="5"
                  max="200"
                  value={candyCount}
                  onChange={(e) => setCandyCount(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <span className="font-mono text-orange-400 font-bold min-w-16">
                  {candyCount} candies
                </span>
              </div>
            </div>
          </div>
        )}

        {mode === 'fortune' && (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Ask a question to the Cyber Spirits (e.g. 'Will my friend scream?')"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            disabled={loading}
            onClick={() => handleAskOracle()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow transition-all"
          >
            {loading ? (
              <span className="animate-spin">🌀</span>
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{loading ? 'Consulting the Void...' : 'Consult Grimbyte 9000'}</span>
          </button>
        </div>
      </div>

      {/* Spirit Ouija Terminal Display */}
      <div className="bg-zinc-950 border-2 border-purple-500/50 rounded-xl p-4 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-purple-400">
            <Terminal className="w-3.5 h-3.5 animate-pulse" />
            <span>OUIJA_TERMINAL_V1995 // RECV_BUFFER</span>
          </div>
          <span className="text-zinc-500">Channel: 666 Hz</span>
        </div>

        <div className="min-h-24 text-xs font-mono leading-relaxed text-purple-200 whitespace-pre-wrap">
          {loading ? (
            <div className="flex items-center gap-2 text-orange-400 animate-pulse">
              <span>🎃 Summoning spooky artificial intelligence...</span>
            </div>
          ) : (
            response
          )}
        </div>
      </div>
    </div>
  );
};
