'use client'

import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

interface ContentPreviewProps {
  content: string
  isLoading: boolean
}

export default function ContentPreview({ content, isLoading }: ContentPreviewProps) {
  const [displayedContent, setDisplayedContent] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)

  // Typing animation effect
  useEffect(() => {
    if (!content) {
      setDisplayedContent('')
      return
    }

    setIsTyping(true)
    indexRef.current = 0
    setDisplayedContent('')

    const interval = setInterval(() => {
      if (indexRef.current < content.length) {
        // Add multiple characters at once for faster typing
        const chunkSize = 5
        const nextIndex = Math.min(indexRef.current + chunkSize, content.length)
        setDisplayedContent(content.substring(0, nextIndex))
        indexRef.current = nextIndex

        // Auto-scroll to bottom
        if (contentRef.current) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight
        }
      } else {
        clearInterval(interval)
        setIsTyping(false)
      }
    }, 10)

    return () => clearInterval(interval)
  }, [content])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success('Content copied to clipboard!')
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = content
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('Content copied to clipboard!')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-content-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Content downloaded!')
  }

  // Simple markdown to HTML conversion
  const renderMarkdown = (text: string) => {
    if (!text) return ''

    let html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-gray-800 mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-800 mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      // Lists
      .replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
      .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 mb-1 list-decimal">$1</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br />')

    // Wrap in paragraphs
    html = '<p class="mb-4">' + html + '</p>'

    // Wrap consecutive li elements in ul
    html = html.replace(/(<li[^>]*>.*?<\/li>)+/g, (match) => {
      return '<ul class="list-disc ml-6 mb-4 space-y-1">' + match + '</ul>'
    })

    return html
  }

  const isEmpty = !content && !isLoading

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Generated Content</h3>
            {content && (
              <p className="text-xs text-gray-500">
                {content.split(/\s+/).length} words • {content.length} characters
              </p>
            )}
          </div>
        </div>

        {content && !isTyping && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors duration-200"
              title="Copy to clipboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Copy</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-accent-50 text-accent-700 hover:bg-accent-100 transition-colors duration-200"
              title="Download as TXT"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium">Download</span>
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div
        ref={contentRef}
        className="p-6 min-h-[400px] max-h-[600px] overflow-y-auto"
      >
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Ready to Create
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Select a content type, choose your tone, enter a topic, and click &quot;Generate Content&quot; to create amazing content with AI.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[350px]">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 animate-pulse-slow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-gray-600 animate-generating">
              AI is crafting your content...
            </p>
            <p className="mt-1 text-xs text-gray-400">
              This may take a few moments
            </p>
          </div>
        )}

        {content && (
          <div
            className="content-area prose prose-purple max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(displayedContent) }}
          />
        )}

        {isTyping && (
          <span className="inline-block w-0.5 h-5 bg-primary-500 animate-pulse ml-0.5" />
        )}
      </div>
    </div>
  )
}
