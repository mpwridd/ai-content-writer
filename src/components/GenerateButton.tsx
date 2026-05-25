'use client'

interface GenerateButtonProps {
  onClick: () => void
  isLoading: boolean
  disabled: boolean
}

export default function GenerateButton({ onClick, isLoading, disabled }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`relative w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
        disabled || isLoading
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 hover:from-primary-700 hover:via-primary-600 hover:to-accent-600 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98]'
      }`}
    >
      <div className="flex items-center justify-center space-x-3">
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Generating Content...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>Generate Content</span>
          </>
        )}
      </div>

      {/* Animated gradient border */}
      {!disabled && !isLoading && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 opacity-0 hover:opacity-20 transition-opacity duration-300 animate-gradient bg-300%" />
      )}
    </button>
  )
}
