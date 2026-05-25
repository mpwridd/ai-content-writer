'use client'

import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import Header from '@/components/Header'
import ContentTypeSelector from '@/components/ContentTypeSelector'
import ToneSelector from '@/components/ToneSelector'
import TopicInput from '@/components/TopicInput'
import WordCountSlider from '@/components/WordCountSlider'
import GenerateButton from '@/components/GenerateButton'
import ContentPreview from '@/components/ContentPreview'
import Sidebar from '@/components/Sidebar'
import { HistoryItem } from '@/components/ContentHistory'
import { ContentType, Tone } from '@/lib/prompts'

export default function Home() {
  const [contentType, setContentType] = useState<ContentType>('blog-post')
  const [tone, setTone] = useState<Tone>('professional')
  const [topic, setTopic] = useState('')
  const [wordCount, setWordCount] = useState(500)
  const [generatedContent, setGeneratedContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    setIsLoading(true)
    setGeneratedContent('')
    setSelectedHistoryId(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          tone,
          topic: topic.trim(),
          wordCount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content')
      }

      setGeneratedContent(data.content)

      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        contentType,
        tone,
        topic: topic.trim(),
        content: data.content,
        wordCount,
        createdAt: new Date(),
      }

      setHistory((prev) => [newItem, ...prev].slice(0, 20)) // Keep last 20
      setSelectedHistoryId(newItem.id)
      toast.success('Content generated successfully!')
    } catch (error) {
      console.error('Generation error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to generate content')
    } finally {
      setIsLoading(false)
    }
  }, [contentType, tone, topic, wordCount])

  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setContentType(item.contentType)
    setTone(item.tone)
    setTopic(item.topic)
    setWordCount(item.wordCount)
    setGeneratedContent(item.content)
    setSelectedHistoryId(item.id)
    setSidebarOpen(false)
  }, [])

  const handleClearHistory = useCallback(() => {
    setHistory([])
    setSelectedHistoryId(null)
    toast.success('History cleared')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      <Header />

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto lg:mx-0 lg:ml-8 xl:mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Create Amazing Content with{' '}
              <span className="gradient-text">AI</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Generate high-quality blog posts, social media content, emails, and more in seconds.
              Powered by Mimo v2.5 Pro.
            </p>
          </div>

          {/* Mobile History Toggle */}
          <div className="lg:hidden mb-4 flex justify-end">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                History ({history.length})
              </span>
            </button>
          </div>

          {/* Generator Form */}
          <div className="space-y-6 mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <ContentTypeSelector selected={contentType} onChange={setContentType} />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <ToneSelector selected={tone} onChange={setTone} />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <TopicInput value={topic} onChange={setTopic} />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <WordCountSlider value={wordCount} onChange={setWordCount} />
            </div>

            <GenerateButton
              onClick={handleGenerate}
              isLoading={isLoading}
              disabled={!topic.trim()}
            />
          </div>

          {/* Content Preview */}
          <ContentPreview content={generatedContent} isLoading={isLoading} />

          {/* Footer */}
          <footer className="mt-12 text-center">
            <p className="text-sm text-gray-400">
              Built with Next.js, Tailwind CSS, and powered by Mimo v2.5 Pro
            </p>
          </footer>
        </main>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-20 h-[calc(100vh-5rem)]">
            <Sidebar
              isOpen={true}
              onClose={() => {}}
              history={history}
              onSelect={handleSelectHistory}
              onClear={handleClearHistory}
              selectedId={selectedHistoryId}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          history={history}
          onSelect={handleSelectHistory}
          onClear={handleClearHistory}
          selectedId={selectedHistoryId}
        />
      </div>
    </div>
  )
}
