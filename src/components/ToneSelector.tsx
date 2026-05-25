'use client'

import { Tone, tones } from '@/lib/prompts'

interface ToneSelectorProps {
  selected: Tone
  onChange: (tone: Tone) => void
}

export default function ToneSelector({ selected, onChange }: ToneSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Tone & Style
      </label>
      <div className="flex flex-wrap gap-2">
        {tones.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onChange(tone.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-300 ${
              selected === tone.id
                ? `border-transparent bg-gradient-to-r ${tone.color} text-white shadow-lg scale-105`
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <span className="text-lg">{tone.icon}</span>
            <span className="text-sm font-medium">{tone.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
