'use client'

import { ContentType, contentTypes } from '@/lib/prompts'

interface ContentTypeSelectorProps {
  selected: ContentType
  onChange: (type: ContentType) => void
}

export default function ContentTypeSelector({ selected, onChange }: ContentTypeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Content Type
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {contentTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onChange(type.id)}
            className={`relative group p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              selected === type.id
                ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/20 scale-[1.02]'
                : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md hover:scale-[1.01]'
            }`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{type.icon}</span>
              <div>
                <span
                  className={`block text-sm font-semibold ${
                    selected === type.id ? 'text-primary-700' : 'text-gray-800'
                  }`}
                >
                  {type.label}
                </span>
                <span className="block text-xs text-gray-500 mt-0.5 leading-tight">
                  {type.description}
                </span>
              </div>
            </div>
            {selected === type.id && (
              <div className="absolute top-2 right-2">
                <svg
                  className="w-5 h-5 text-primary-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
