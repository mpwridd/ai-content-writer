import { streamText } from "ai";

export const maxDuration = 60;

const SYSTEM_PROMPTS: Record<string, string> = {
  blog_post: `You are an expert blog writer. Write engaging, well-structured blog posts with clear headings, compelling introductions, and actionable insights. Use a natural, conversational flow while maintaining authority on the topic.`,
  article: `You are a professional journalist and article writer. Write well-researched, informative articles with a clear narrative structure. Include relevant details, maintain objectivity, and present information in a compelling way.`,
  social_media: `You are a social media content expert. Create engaging, shareable social media content that captures attention quickly. Use appropriate hashtags, emojis, and a conversational tone. Keep it concise and impactful.`,
  email: `You are an email marketing specialist. Write clear, persuasive email content with strong subject lines, engaging body copy, and clear calls to action. Maintain a professional yet approachable tone.`,
  product_description: `You are an expert copywriter specializing in product descriptions. Write compelling, benefit-focused product descriptions that highlight key features, address customer pain points, and drive conversions. Use sensory language and emotional triggers.`,
  newsletter: `You are a newsletter content specialist. Write engaging newsletter content that informs and delights subscribers. Use a warm, personal tone, break content into scannable sections, and include clear takeaways.`,
};

export async function POST(req: Request) {
  const { contentType, topic, tone, length } = await req.json();

  const lengthGuide = {
    short: "approximately 150 words",
    medium: "approximately 400 words",
    long: "approximately 800 words",
  }[length] || "approximately 400 words";

  const systemPrompt = SYSTEM_PROMPTS[contentType] || SYSTEM_PROMPTS.blog_post;

  const fullPrompt = `${systemPrompt}

Write in a ${tone.toLowerCase()} tone.
Target length: ${lengthGuide}.
Do not include meta-commentary or explanations — just output the content directly.

Topic/Description: ${topic}`;

  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

  const response = await fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "mimo-v2.5-pro",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Write in a ${tone.toLowerCase()} tone. Target length: ${lengthGuide}.\n\nTopic: ${topic}` },
      ],
      stream: true,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return new Response(JSON.stringify({ error: err }), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Transform OpenAI SSE to text stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) { controller.close(); return; }

      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const json = JSON.parse(line.slice(6));
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {}
            }
          }
        }
      } catch {}
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
