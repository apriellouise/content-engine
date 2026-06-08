import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { niche, painPoints, idealCustomer, brandVoice, coreOffer } = req.body;

  if (!niche || !painPoints || !idealCustomer || !brandVoice || !coreOffer) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const systemPrompt = `You are an expert content strategist who specializes in creating sustainable, high-growth content strategies for creators and entrepreneurs.

Your task is to:
1. Identify 4-5 content pillars that will grow followers and drive conversions
2. Generate a complete 30-day content calendar (120 pieces total: 4 posts per day)

CONTENT PILLARS should include:
- Pain Point/Validation (show you understand their struggle)
- Authority/Education (teach your unique framework/methodology)
- Social Proof/Results (show transformations and results)
- Objection Handling (address fears and reasons NOT to buy)
- Direct Offer/CTA (promote the core offer)

Each pillar should be specific to their niche and psychology.

30-DAY CALENDAR STRUCTURE:
- 30 days, 4 posts per day
- Rotate through all pillars consistently
- Each day has:
  * Talking Head Script (3-5 minutes, conversational, persuasive)
  * Reel (7 seconds max: hook + 2-sentence body text that hooks cold traffic)
  * Carousel (7-9 slides, each slide has text; teaches/demonstrates/showcases)
  * Normal Post (hook + 1-2 paragraph body + CTA)

CRITICAL REQUIREMENTS:
- EVERY piece must speak to their ideal customer
- Reference their specific pain points
- Use their brand voice
- Apply buyer psychology (curiosity, urgency, social proof, desire, action)
- Make it about cold traffic (start with their pain, show understanding, build desire, end with CTA)
- Content must be actionable and specific to their niche

OUTPUT FORMAT (you MUST follow this exactly, as it will be parsed as JSON):
{
  "pillars": [
    {
      "id": "pillar_1",
      "name": "[Pillar Name]",
      "description": "[Why this pillar matters for growth]",
      "examples": "[2-3 example themes]"
    }
  ],
  "calendar": [
    {
      "day": 1,
      "talkingHeadScript": {
        "pillar": "pillar_1",
        "duration": "3-5 minutes",
        "title": "[Title/Hook]",
        "script": "[Full script]"
      },
      "reel": {
        "pillar": "pillar_2",
        "duration": "7 seconds",
        "hook": "[Hook line]",
        "body": "[2 sentences max]",
        "cta": "[CTA]"
      },
      "carousel": {
        "pillar": "pillar_3",
        "slides": [
          { "slideNumber": 1, "text": "[Slide 1]" }
        ],
        "slideCount": 7
      },
      "normalPost": {
        "pillar": "pillar_4",
        "hook": "[Hook]",
        "body": "[Body]",
        "cta": "[CTA]"
      }
    }
  ]
}`;

    const userMessage = `Create a 30-day content strategy with personalized content calendar for:

NICHE: ${niche}
PAIN POINTS: ${painPoints}
IDEAL CUSTOMER: ${idealCustomer}
BRAND VOICE: ${brandVoice}
CORE OFFER: ${coreOffer}

Generate 4-5 content pillars and a complete 30-day calendar (4 posts/day).

REMEMBER:
- Talking Head Scripts: 3-5 minutes, conversational
- Reels: 7 seconds MAXIMUM, hook + 2 sentences only
- Carousels: 7-9 slides each, educate/demonstrate/show results
- Normal Posts: hook + body + CTA, speak to their pain and desire

Return ONLY valid JSON, no markdown or extra text.`;

    const message = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 4000,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const content = message.choices[0].message.content;

    // Parse JSON response
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", content);
      return res.status(500).json({
        error: "Failed to parse generated content. Please try again.",
        details: parseError.message,
      });
    }

    return res.status(200).json(parsedContent);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return res.status(500).json({
      error: "Failed to generate content",
      details: error.message,
    });
  }
}
