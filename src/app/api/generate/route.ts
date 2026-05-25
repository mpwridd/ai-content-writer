import { NextResponse } from 'next/server'
import { buildPrompt, ContentType, Tone } from '@/lib/prompts'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { contentType, tone, topic, wordCount } = body as {
      contentType: ContentType
      tone: Tone
      topic: string
      wordCount: number
    }

    if (!contentType || !tone || !topic || !wordCount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const apiKey = process.env.MIMO_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'MIMO_API_KEY not configured' },
        { status: 500 }
      )
    }

    const prompt = buildPrompt(contentType, tone, topic, wordCount)

    const response = await fetch('http://100.91.112.121:8317/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'Mimo-V2.5-Pro',
        messages: [
          {
            role: 'system',
            content: 'You are an expert content writer who creates high-quality, engaging content. You write in markdown format and follow instructions precisely.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4096,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Mimo API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to generate content. Please try again.' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json(
        { error: 'Invalid response from AI model' },
        { status: 500 }
      )
    }

    const generatedContent = data.choices[0].message.content

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
