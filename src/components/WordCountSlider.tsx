'use client'

interface WordCountSliderProps {
  value: number
  onChange: (value: number) => void
}

export default function WordCountSlider({ value, onChange }: WordCountSliderProps) {
  const getWordCountLabel = (count: number) => {
    if (count <= 200) return 'Short & Sweet'
    if (count <= 500) return 'Medium Length'
    if (count <= 800) return 'Detailed'
    return 'Comprehensive'
  }

  const getWordCountEmoji = (count: number) => {
    if (count <= 200) return '⚡'
    if (count <= 500) return '📝'
    if (count <= 800) return '📖'
    return '📚'
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Word Count
      </label>
      <div className="bg-white rounded-xl border-2 border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getWordCountEmoji(value)}</span>
            <span className="text-sm font-medium text-gray-600">
              {getWordCountLabel(value)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold gradient-text">{value}</span>
            <span className="text-sm text-gray-500">words</span>
          </div>
        </div>

        <input
          type="range"
          min={100}
          max={1000}
          step={50}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-400">100</span>
          <span className="text-xs text-gray-400">250</span>
          <span className="text-xs text-gray-400">500</span>
          <span className="text-xs text-gray-400">750</span>
          <span className="text-xs text-gray-400">1000</span>
        </div>
      </div>
    </div>
  )
}
