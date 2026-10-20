import React, { useState } from 'react';
import { sound } from '../../utils/soundEngine';
import {
  Folder,
  FileText,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  ShieldCheck,
  X,
  Play,
  Download,
} from 'lucide-react';

export const FileManagerWindow: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<any | null>(null);

  const files = [
    {
      id: 'do_not_open',
      name: 'DO_NOT_READ_ALOUD.txt',
      size: '666 bytes',
      type: 'text',
      icon: <FileText className="w-8 h-8 text-amber-400" />,
      content:
        "WARNING TO THE MORTAL READER:\n\nBy reading this line, you have entered into a binding covenant with the Pumpkin King.\n\nTERMS OF SERVICE:\n1. You must consume at least one (1) fun-size candy bar before midnight.\n2. You are forbidden from turning your monitor upside down.\n3. If your keyboard begins to smell like pumpkin pie, this is a feature, not a bug.\n\nSigned,\n~ The Resident Poltergeist",
    },
    {
      id: 'tax_invoice',
      name: 'Halloween_Tax_Invoice_2026.xlsx',
      size: '14.2 KB',
      type: 'spreadsheet',
      icon: <FileSpreadsheet className="w-8 h-8 text-emerald-400" />,
      content: {
        vendor: 'Underworld Spectral Auditing Ltd.',
        date: 'October 31, 2026',
        items: [
          { desc: 'Pumpkin Spice CPU Coolant Refill', cost: '$45.00' },
          { desc: 'Anti-Demon Firewall Enchantment (Tier 3)', cost: '$666.00' },
          { desc: 'Candy Corn Depreciation Allowance', cost: '-$12.50' },
          { desc: 'Poltergeist Mouse Calibration Fee', cost: '$13.37' },
        ],
        total: '$711.87 (Payable in chocolate)',
      },
    },
    {
      id: 'ghost_selfie',
      name: 'poltergeist_caught_on_webcam.png',
      size: '1.2 MB',
      type: 'image',
      icon: <ImageIcon className="w-8 h-8 text-purple-400" />,
      content: 'ghost_art',
    },
    {
      id: 'salt_circle',
      name: 'digital_salt_circle.reg',
      size: '256 bytes',
      type: 'registry',
      icon: <ShieldCheck className="w-8 h-8 text-cyan-400" />,
      content:
        "[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Spirits]\n\"SaltDensity\"=dword:000003e8\n\"GarlicRadius\"=\"15 meters\"\n\"AntiHauntFirewall\"=hex:ff,aa,66,00\n\"Status\"=\"ACTIVE - DEMONS BLOCKED\"",
    },
    {
      id: 'hacker_script',
      name: 'summon_skeleton_army.bat',
      size: '89 bytes',
      type: 'script',
      icon: <FileCode className="w-8 h-8 text-red-400" />,
      content:
        "@echo off\ntitle SKELETON_ARMY_BOOTSTRAP\necho [!] INITIATING BONE DANCE PROTOCOL...\necho [!] TUNING GUITARS TO SPOOKY CHORDS...\necho [!] SKELETON ARMY ONLINE. CLICK PANIC TO DESPAWN.",
    },
  ];

  const handleOpenFile = (file: any) => {
    sound.playGlitch();
    setSelectedFile(file);
  };

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-4 text-zinc-100 max-w-4xl mx-auto h-full">
      {/* Address Bar */}
      <div className="flex items-center gap-2 p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-400">
        <Folder className="w-4 h-4 text-orange-400" />
        <span>Address:</span>
        <span className="text-zinc-200">C:\Haunted_System32\Halloween_Files\</span>
      </div>

      {/* Grid of Files */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl min-h-64">
        {files.map((file) => (
          <div
            key={file.id}
            onDoubleClick={() => handleOpenFile(file)}
            onClick={() => handleOpenFile(file)}
            className="p-3 rounded-lg border border-transparent hover:border-orange-500/50 hover:bg-zinc-800/80 cursor-pointer flex flex-col items-center text-center transition-all group"
          >
            <div className="p-2 group-hover:scale-110 transition-transform">
              {file.icon}
            </div>
            <span className="text-xs font-mono font-medium text-zinc-200 mt-2 line-clamp-2 break-all group-hover:text-orange-300">
              {file.name}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 mt-0.5">
              {file.size}
            </span>
          </div>
        ))}
      </div>

      {/* File Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-[9999] bg-zinc-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-orange-500 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-700 px-4 py-2 flex items-center justify-between text-zinc-950 font-bold text-xs select-none">
              <span className="font-mono">{selectedFile.name}</span>
              <button
                onClick={() => {
                  sound.playGlitch();
                  setSelectedFile(null);
                }}
                className="hover:bg-orange-800 text-zinc-950 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 bg-zinc-950 text-zinc-200 font-mono text-xs max-h-96 overflow-y-auto">
              {selectedFile.type === 'text' || selectedFile.type === 'registry' || selectedFile.type === 'script' ? (
                <pre className="whitespace-pre-wrap leading-relaxed text-emerald-400">
                  {selectedFile.content}
                </pre>
              ) : selectedFile.type === 'spreadsheet' ? (
                <div className="flex flex-col gap-3">
                  <div className="border-b border-zinc-800 pb-2">
                    <div className="font-bold text-orange-400">{selectedFile.content.vendor}</div>
                    <div className="text-[10px] text-zinc-400">Date: {selectedFile.content.date}</div>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 text-[11px]">
                        <th className="py-1">Description</th>
                        <th className="py-1 text-right">Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedFile.content.items.map((it: any, idx: number) => (
                        <tr key={idx} className="border-b border-zinc-900">
                          <td className="py-1 text-zinc-300">{it.desc}</td>
                          <td className="py-1 text-right text-orange-300 font-mono">{it.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pt-2 text-right font-bold text-sm text-emerald-400">
                    Total Due: {selectedFile.content.total}
                  </div>
                </div>
              ) : selectedFile.type === 'image' ? (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="text-6xl animate-bounce mb-2">👻📸</div>
                  <div className="text-orange-400 font-bold text-sm">
                    GHOST IDENTIFIED: GRIMBYTE 9000
                  </div>
                  <p className="text-zinc-400 text-xs mt-1">
                    Caught enjoying a chocolate bar in RAM sector 0x992B.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => {
                  sound.playGlitch();
                  setSelectedFile(null);
                }}
                className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-zinc-950 font-bold rounded text-xs transition-colors"
              >
                Close File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
