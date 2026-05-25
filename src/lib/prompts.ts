export type ContentType = 
  | 'blog-post'
  | 'twitter-thread'
  | 'linkedin-post'
  | 'email'
  | 'youtube-script'
  | 'product-description'

export type Tone = 
  | 'professional'
  | 'casual'
  | 'funny'
  | 'persuasive'
  | 'informative'

export const contentTypes: { id: ContentType; label: string; icon: string; description: string }[] = [
  { id: 'blog-post', label: 'Blog Post', icon: '📝', description: 'Long-form articles with SEO optimization' },
  { id: 'twitter-thread', label: 'Twitter Thread', icon: '🐦', description: 'Engaging multi-tweet threads' },
  { id: 'linkedin-post', label: 'LinkedIn Post', icon: '💼', description: 'Professional networking content' },
  { id: 'email', label: 'Email', icon: '📧', description: 'Business and marketing emails' },
  { id: 'youtube-script', label: 'YouTube Script', icon: '🎬', description: 'Video scripts with hooks and CTAs' },
  { id: 'product-description', label: 'Product Description', icon: '🛍️', description: 'Compelling product copy' },
]

export const tones: { id: Tone; label: string; icon: string; color: string }[] = [
  { id: 'professional', label: 'Professional', icon: '👔', color: 'from-blue-500 to-indigo-600' },
  { id: 'casual', label: 'Casual', icon: '😎', color: 'from-green-400 to-emerald-500' },
  { id: 'funny', label: 'Funny', icon: '😂', color: 'from-yellow-400 to-orange-500' },
  { id: 'persuasive', label: 'Persuasive', icon: '🎯', color: 'from-red-500 to-pink-600' },
  { id: 'informative', label: 'Informative', icon: '📚', color: 'from-purple-500 to-violet-600' },
]

export function buildPrompt(
  contentType: ContentType,
  tone: Tone,
  topic: string,
  wordCount: number
): string {
  const contentTypeInstructions: Record<ContentType, string> = {
    'blog-post': `Write a comprehensive, engaging blog post about the given topic. 
Include:
- An attention-grabbing headline
- Introduction with a hook
- Well-structured sections with subheadings (use ## for H2, ### for H3)
- Key points and insights
- Practical takeaways
- A compelling conclusion with a call-to-action
- Aim for approximately ${wordCount} words
- Use proper markdown formatting`,

    'twitter-thread': `Create an engaging Twitter/X thread about the given topic.
Rules:
- Start with a hook tweet that grabs attention
- Each tweet should be under 280 characters
- Number each tweet (e.g., 1/, 2/, 3/)
- Include a mix of insights, examples, and actionable tips
- End with a summary tweet and call-to-action (like, retweet, follow)
- Aim for approximately ${wordCount} words total across all tweets
- Use emojis strategically but not excessively
- Make each tweet valuable on its own`,

    'linkedin-post': `Write a professional LinkedIn post about the given topic.
Guidelines:
- Start with a powerful hook (first 2 lines are crucial - they show before "see more")
- Use short paragraphs (1-2 sentences each)
- Include relevant insights from professional experience
- Add 3-5 relevant hashtags at the end
- End with a question or call for engagement
- Aim for approximately ${wordCount} words
- Use line breaks for readability
- No emojis in every sentence - use sparingly and professionally`,

    'email': `Write a professional email about the given topic.
Structure:
- Clear, compelling subject line
- Appropriate greeting
- Concise, well-organized body
- Clear call-to-action
- Professional sign-off
- Aim for approximately ${wordCount} words
- Make it scannable with short paragraphs
- Highlight key points`,

    'youtube-script': `Write an engaging YouTube video script about the given topic.
Include:
- **[HOOK]** - First 5-10 seconds that grab attention
- **[INTRO]** - Brief channel intro and video overview
- **[CONTENT]** - Main content broken into clear sections with timestamps
- **[KEY POINTS]** - Highlight important information
- **[CTA]** - Subscribe, like, comment reminder (natural, not forced)
- **[OUTRO]** - Summary and next video teaser
- Aim for approximately ${wordCount} words
- Include [B-ROLL] suggestions where appropriate
- Write in a conversational, engaging tone suitable for video`,

    'product-description': `Write a compelling product description for the given product.
Include:
- Attention-grabbing headline
- Key features and benefits (features tell, benefits sell)
- Emotional appeal and use cases
- Technical specifications (if relevant)
- Social proof elements
- Clear call-to-action
- Aim for approximately ${wordCount} words
- Use power words that drive action
- Address potential objections`,

  }

  const toneInstructions: Record<Tone, string> = {
    'professional': 'Write in a professional, authoritative tone. Use industry-appropriate terminology, maintain formal language, and establish credibility through well-researched content.',
    'casual': 'Write in a relaxed, conversational tone. Use everyday language, short sentences, and feel free to use contractions. Make it feel like talking to a friend.',
    'funny': 'Write with humor and wit. Use clever wordplay, unexpected analogies, and light-hearted jokes. Keep it entertaining while still delivering value.',
    'persuasive': 'Write in a compelling, action-oriented tone. Use power words, emotional triggers, and strong calls-to-action. Focus on benefits and create urgency.',
    'informative': 'Write in an educational, fact-based tone. Present information clearly, use examples and data where possible, and help the reader understand complex topics.',
  }

  return `You are an expert content writer. Create high-quality, engaging content.

CONTENT TYPE: ${contentType}
TONE: ${tone}
TOPIC: ${topic}
TARGET LENGTH: ${wordCount} words

${contentTypeInstructions[contentType]}

TONE GUIDELINES:
${toneInstructions[tone]}

IMPORTANT RULES:
1. Write ONLY the content - no meta-commentary or explanations
2. Use proper markdown formatting
3. Make it engaging and valuable to the reader
4. Stay on topic and be specific
5. Match the requested tone consistently throughout
6. Aim for approximately ${wordCount} words

Begin writing now:`
}
