'use client'

interface TopicInputProps {
  value: string
  onChange: (value: string) => void
}

export default function TopicInput({ value, onChange }: TopicInputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Topic / Description
      </label>
      <div className="relative">
        <div className="absolute top-4 left-4 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your topic, keywords, or detailed description of what you want to write about..."
          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300 resize-none bg-white text-gray-800 placeholder-gray-400"
          rows={4}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {value.length} characters
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        💡 Tip: Be specific about your topic for better results. Include target audience, key points, or specific angles.
      </p>
    </div>
  )
}
