'use client'

import { ContentType, contentTypes, Tone, tones } from '@/lib/prompts'

export interface HistoryItem {
  id: string
  contentType: ContentType
  tone: Tone
  topic: string
  content: string
  wordCount: number
  createdAt: Date
}

interface ContentHistoryProps {
  history: HistoryItem[]
  onSelect: (item: HistoryItem) => void
  onClear: () => void
  selectedId: string | null
}

export default function ContentHistory({ history, onSelect, onClear, selectedId }: ContentHistoryProps) {
  const getContentTypeLabel = (type: ContentType) => {
    return contentTypes.find((t) => t.id === type)?.label || type
  }

  const getContentTypeIcon = (type: ContentType) => {
    return contentTypes.find((t) => t.id === type)?.icon || '📄'
  }

  const getToneLabel = (tone: Tone) => {
    return tones.find((t) => t.id === tone)?.label || tone
  }

  const getToneColor = (tone: Tone) => {
    return tones.find((t) => t.id === tone)?.color || 'from-gray-500 to-gray-600'
  }

  const formatDate = (date: Date) => {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const truncateTopic = (topic: string, maxLength: number = 50) => {
    if (topic.length <= maxLength) return topic
    return topic.substring(0, maxLength) + '...'
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-600">No History Yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Generated content will appear here
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">
          Recent Generations
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedId === item.id
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-gray-100 bg-white hover:border-primary-200 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-xl flex-shrink-0">
                {getContentTypeIcon(item.contentType)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-800">
                    {getContentTypeLabel(item.contentType)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2 truncate">
                  {truncateTopic(item.topic)}
                </p>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${getToneColor(item.tone)} text-white`}
                  >
                    {getToneLabel(item.tone)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {item.wordCount} words
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
