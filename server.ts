import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// TOP-LEVEL REQUEST DESERIALIZATION (Ordering Guarantee)
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Helper to sanitize Gemini AI initialization
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Resilient Model Fallback Ladder for generateContent
const MODEL_FALLBACK_LADDER = [
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.7-flash',
];

async function generateContentWithFallback(contents: any, config?: any) {
  const ai = getGenAIClient();
  let lastError: any = null;

  for (const modelName of MODEL_FALLBACK_LADDER) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        ...(config ? { config } : {}),
      });
      if (response && response.text) {
        return { text: response.text, modelUsed: modelName };
      }
    } catch (err: any) {
      console.warn(`[Gemini Fallback] Model ${modelName} failed:`, err?.message || err);
      lastError = err;
      // Continue to next model in ladder
    }
  }

  throw lastError || new Error('All model attempts failed in fallback ladder.');
}

// 1. ANALYZE BRIEF ENDPOINT
app.post('/api/analyze-brief', async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const { prompt = '', postType = 'Lifestyle / Vlog', photos = [], age = 22, name = 'Friend' } = body;

    const parts: any[] = [];
    
    // Attach photos as inlineData if provided (max 3 for prompt analysis)
    if (Array.isArray(photos)) {
      for (const p of photos.slice(0, 3)) {
        if (typeof p === 'string' && p.startsWith('data:image')) {
          const mimeMatch = p.match(/^data:(image\/[a-zA-Z]+);base64,/);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const base64Data = p.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
          parts.push({
            inlineData: { mimeType, data: base64Data },
          });
        }
      }
    }

    const systemPrompt = `You are PostCraft AI's creative director. Analyze the user's brief prompt and uploaded photo(s) for a ${postType} social media post.
User Name: ${name}, Age: ${age}.

Return a STRICT JSON object with these fields:
{
  "theme": "Short catchy theme title (e.g., Beachy Sunset Glow)",
  "mood": "Overall vibe description (e.g., Chill, vibrant, sun-kissed, aesthetic)",
  "colors": ["#hex1", "#hex2", "#hex3", "#hex4"],
  "outfitStyle": "Analysis of outfits, styling, or visual elements detected or suggested",
  "location": "Inferred or suggested setting/location",
  "targetAudience": "Suggested target audience on Instagram/TikTok",
  "recommendedFormat": "Picture" or "Video" or "Animated video / Reel",
  "moodChips": ["Chip 1", "Chip 2", "Chip 3", "Chip 4", "Chip 5"]
}`;

    parts.push({ text: `Brief: "${prompt}". Post Category: ${postType}` });

    const result = await generateContentWithFallback(
      { parts },
      {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      }
    );

    let parsed = {};
    try {
      parsed = JSON.parse(result.text || '{}');
    } catch (e) {
      parsed = {
        theme: prompt || 'Creative Social Post',
        mood: 'Trendy, aesthetic & eye-catching',
        colors: ['#F0509B', '#F7C948', '#6B0F1A', '#FFF8EC'],
        outfitStyle: 'Casual chic vibe',
        location: 'Aesthetic backdrop',
        targetAudience: 'Gen-Z & Instagram trendsetters',
        recommendedFormat: 'Picture',
        moodChips: ['✨ Vibrant', '🌸 Sun-kissed', '📸 Aesthetic', '🔥 Trending', '🌴 Chill'],
      };
    }

    res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    console.error('Error analyzing brief:', error);
    res.json({
      success: true,
      analysis: {
        theme: req.body?.prompt || 'Creative Post Vibe',
        mood: 'Vibrant & Trendy',
        colors: ['#F0509B', '#F7C948', '#90EE90', '#FFF8EC'],
        outfitStyle: 'Stylish & effortless',
        location: 'Cozy / Scenic spot',
        targetAudience: 'Friends & Followers',
        recommendedFormat: 'Picture',
        moodChips: ['✨ Aesthetic', '💛 Sunshine', '📸 Scrapbook', '🎉 Fun', '🌈 Colorful'],
      },
    });
  }
});

// 2. TEMPLATE SUGGESTIONS ENDPOINT
app.post('/api/suggest-templates', async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const { postType = 'Lifestyle', analysis = {}, format = 'Picture', photoCount = 1 } = body;

    const systemPrompt = `Generate 5 unique Instagram template suggestions for a ${postType} post in ${format} format.
Context:
- Theme: ${analysis.theme || 'Creative'}
- Mood: ${analysis.mood || 'Vibrant'}
- Photos available: ${photoCount}

Return a STRICT JSON array of 5 template objects:
[
  {
    "id": "template_1",
    "name": "Catchy Name (e.g. Polaroid Polaroid Scrapbook)",
    "styleLabel": "Style badge (e.g. Vintage Retro, Minimal Elegant, Y2K Hologram, Magazine Cover, Cyber Neon)",
    "palette": ["#color1", "#color2", "#color3"],
    "layoutType": "collage" | "single" | "carousel" | "split screen",
    "captionTone": "Tone description (e.g. Playful & witty, Confident & sleek, Poetic & chill)",
    "description": "Short 1-sentence layout preview description",
    "frameStyle": "polaroid" | "flower" | "blob" | "scallop" | "clean" | "magazine",
    "stickerPacks": ["✨ Sparkles", "🌸 Flowers", "📌 Tape", "💌 Stamps"]
  }
]`;

    const result = await generateContentWithFallback('Suggest templates', {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
    });

    let templates = [];
    try {
      templates = JSON.parse(result.text || '[]');
    } catch (e) {
      templates = [];
    }

    if (!Array.isArray(templates) || templates.length === 0) {
      templates = [
        {
          id: 'temp_1',
          name: 'Polaroid Scrapbook',
          styleLabel: 'Y2K Sticker Studio',
          palette: ['#F0509B', '#F7C948', '#FFF8EC'],
          layoutType: 'collage',
          captionTone: 'Playful, aesthetic & witty',
          description: 'Layered taped polaroids with handwritten doodles and sticker stamps.',
          frameStyle: 'polaroid',
          stickerPacks: ['✨ Sparkles', '📌 Washi Tape', '🌸 Flower Stamp'],
        },
        {
          id: 'temp_2',
          name: 'Editorial Magazine Cover',
          styleLabel: 'Sleek & Luxe',
          palette: ['#6B0F1A', '#D9C9A8', '#FAF5EF'],
          layoutType: 'single',
          captionTone: 'Confident, polished & refined',
          description: 'Bold serif typography with subtle film grain and minimalist borders.',
          frameStyle: 'magazine',
          stickerPacks: ['✨ Luxe Stamp', '🏷️ Editorial Label'],
        },
        {
          id: 'temp_3',
          name: 'Holo Cloud Reel',
          styleLabel: 'Holographic Pastel',
          palette: ['#FFD1DC', '#E0F7FA', '#E1BEE7'],
          layoutType: 'split screen',
          captionTone: 'Dreamy & chill',
          description: 'Pastel gradient glow with floating cloud stickers and soft motion pulses.',
          frameStyle: 'blob',
          stickerPacks: ['☁️ Clouds', '🌈 Rainbow', '⭐ Star Doodles'],
        },
        {
          id: 'temp_4',
          name: 'Checkerboard Pop',
          styleLabel: 'Bold & Retro',
          palette: ['#FF5722', '#FFEB3B', '#9C27B0'],
          layoutType: 'carousel',
          captionTone: 'Energetic & high vibe',
          description: 'Gingham checkerboard background with chunky badges and hard offset shadows.',
          frameStyle: 'scallop',
          stickerPacks: ['🔥 Trending', '⚡ Lightning', '🎯 Pick Me'],
        },
        {
          id: 'temp_5',
          name: 'Film Roll Memories',
          styleLabel: 'Cinematic Grain',
          palette: ['#2D3748', '#ED8936', '#F7FAFC'],
          layoutType: 'collage',
          captionTone: 'Nostalgic & warm',
          description: 'Analog film strip cutouts with date stamp stickers and warm ambient lighting.',
          frameStyle: 'flower',
          stickerPacks: ['🎞️ Film Strip', '📅 Date Stamp', '☕ Cozy Doodles'],
        },
      ];
    }

    res.json({ success: true, templates });
  } catch (error: any) {
    console.error('Error suggesting templates:', error);
    res.json({
      success: true,
      templates: [
        {
          id: 'temp_default_1',
          name: 'Polaroid Scrapbook',
          styleLabel: 'Y2K Sticker Studio',
          palette: ['#F0509B', '#F7C948', '#FFF8EC'],
          layoutType: 'collage',
          captionTone: 'Playful & trendy',
          description: 'Layered polaroid frames with washi tape and cute stickers.',
          frameStyle: 'polaroid',
          stickerPacks: ['✨ Sparkles', '📌 Washi Tape'],
        },
        {
          id: 'temp_default_2',
          name: 'Chic Editorial',
          styleLabel: 'Clean & Modern',
          palette: ['#6B0F1A', '#D9C9A8', '#FFFFFF'],
          layoutType: 'single',
          captionTone: 'Polished & confident',
          description: 'Elegant layout with luxury serif typography.',
          frameStyle: 'magazine',
          stickerPacks: ['🏷️ Label'],
        },
      ],
    });
  }
});

// 3. GENERATE POST OUTPUT ENDPOINT
app.post('/api/generate-post', async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const {
      prompt = '',
      postType = 'Lifestyle',
      template = {},
      analysis = {},
      format = 'Picture',
      photos = [],
      age = 22,
      name = 'Friend',
    } = body;

    const systemPrompt = `You are PostCraft AI's post content engine.
Generate Instagram post elements for ${name} (Age: ${age}).
Post Type: ${postType}
Chosen Template: ${template.name || 'Polaroid Scrapbook'}
Format: ${format}
Brief: ${prompt}

Return a STRICT JSON object:
{
  "caption": "Primary catchy Instagram caption with emojis matched to tone",
  "altCaptions": [
    "Alternative Option 1 (Short & punchy)",
    "Alternative Option 2 (Story / relatable)",
    "Alternative Option 3 (Professional / sleek)"
  ],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"],
  "musicMood": {
    "genre": "Lo-Fi Beats / Pop / Indie / Chill Waves",
    "trackName": "Suggested BGM Vibe (e.g. Golden Hour Acoustic)",
    "tempo": "85 BPM",
    "vibe": "Chill & Sun-kissed"
  },
  "overlayText": "Catchy headline text for post graphic (e.g. GOA DREAMS ✨)",
  "stickerSuggestions": ["📌 Vacation Mood", "✨ Glowing", "🌴 Island Life", "📸 Moment Captured"],
  "filterRecommendation": "Warm Vintage / Pastel Holographic / Cinematic Film / High Contrast"
}`;

    const result = await generateContentWithFallback('Generate post details', {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
    });

    let generated: any = {};
    try {
      generated = JSON.parse(result.text || '{}');
    } catch (e) {
      generated = {};
    }

    res.json({
      success: true,
      post: {
        caption: generated.caption || `Living my best life in ${analysis.location || 'the moment'} ✨ ${prompt}`,
        altCaptions: generated.altCaptions || [
          `Just dropped a new vibe! 📸 ${prompt}`,
          `Good energy & warm memories ✨`,
          `Keep it simple, keep it iconic 🤍`,
        ],
        hashtags: generated.hashtags || ['#PostCraft', '#InstagramVibes', '#AestheticPost', '#PhotoOfTheDay', '#Reels', '#Trending'],
        musicMood: generated.musicMood || {
          genre: 'Aesthetic Pop / Chill Beats',
          trackName: 'Sunny Afternoon Vibe',
          tempo: '92 BPM',
          vibe: 'Upbeat & Cozy',
        },
        overlayText: generated.overlayText || (prompt ? prompt.toUpperCase().slice(0, 24) : 'POSTCRAFT STUDIO'),
        stickerSuggestions: generated.stickerSuggestions || ['✨ Sparkle', '🔥 Trending', '🤍 Vibe', '📸 Snap'],
        filterRecommendation: generated.filterRecommendation || 'Warm Vintage',
      },
    });
  } catch (error: any) {
    console.error('Error generating post:', error);
    res.json({
      success: true,
      post: {
        caption: `Creating magic with PostCraft AI! ✨ ${req.body?.prompt || ''}`,
        altCaptions: [`Daily dose of aesthetic 📸`, `Memories captured forever ✨`],
        hashtags: ['#PostCraft', '#ContentCreator', '#Aesthetic', '#InstagramDaily'],
        musicMood: { genre: 'Lo-Fi Chill', trackName: 'Golden Hour Sunset', tempo: '80 BPM', vibe: 'Relaxed' },
        overlayText: 'MY STORY',
        stickerSuggestions: ['✨ Magic', '📌 Memories'],
        filterRecommendation: 'Warm Gold',
      },
    });
  }
});

// 4. GENERATE AI STICKER / BACKGROUND IMAGE ENDPOINT
app.post('/api/generate-image', async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const { prompt = 'A aesthetic colorful sticker', aspectRatio = '1:1' } = body;

    const ai = getGenAIClient();
    // Use gemini-3.1-flash-lite-image for image generation
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            text: `High quality sticker graphic, transparent cutout style background, vibrant colors: ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any || '1:1',
        },
      },
    });

    let imageUrl = '';
    if (response?.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ success: false, error: 'Could not generate image' });
    }

    res.json({ success: true, imageUrl });
  } catch (error: any) {
    console.error('Error generating image:', error);
    res.status(500).json({ success: false, error: error?.message || 'Failed to generate image' });
  }
});

// 5. ALWAYS-ON AI CHAT ASSISTANT ENDPOINT
app.post('/api/chat', async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const {
      message = '',
      context = {},
      history = [],
    } = body;

    const name = context.name || 'Friend';
    const age = Number(context.age) || 22;
    const postType = context.postType || 'Lifestyle';
    const step = context.step || 1;
    const brief = context.brief || '';
    const selectedTemplate = context.selectedTemplate || '';

    // Tone customization rules:
    // Professional posts: polished, confident, concise, business-appropriate.
    // Casual posts: friendly, trendy, playful, with emojis.
    // Age rules:
    // Under 18: safe, age-appropriate, encouraging, no mature content.
    // 18-30: energetic and trendy, with current slang used lightly.
    // 30+: warm, clear, respectful, less slang.
    let toneGuidance = '';
    const isProfessional = postType.toLowerCase().includes('professional') || postType.toLowerCase().includes('business');

    if (isProfessional) {
      toneGuidance = 'Maintain a polished, confident, concise, business-appropriate tone with clean formatting.';
    } else {
      toneGuidance = 'Maintain a friendly, trendy, enthusiastic, scrapbook-creator tone with relevant emojis.';
    }

    if (age < 18) {
      toneGuidance += ' Ensure content is 100% wholesome, safe, encouraging, and age-appropriate.';
    } else if (age <= 30) {
      toneGuidance += ' Use energetic Gen-Z/millennial creative language naturally.';
    } else {
      toneGuidance += ' Be warm, clear, structured, and respectful.';
    }

    const platformsList = Array.isArray(context.platforms) ? context.platforms.join(', ') : 'Instagram Post';

    const systemInstruction = `You are PostCraft AI's personal studio assistant. ALWAYS address the user as "${name}".
Current App Context:
- User Name: ${name}
- User Age: ${age}
- Active Step in App: Step ${step} of 9
- Selected Post Category: ${postType}
- Target Social Platforms: ${platformsList}
- User Brief / Prompt: "${brief}"
- Selected Template: "${selectedTemplate}"

Tone Rules:
${toneGuidance}

Help the user with styling tips, photo lighting, outfit advice, pose ideas, caption tweaks, hashtag strategy, posting time, platform safe zones (e.g. for Reels/Stories/Shorts, keep text centered so buttons don't cover it), or design suggestions. Keep responses engaging, concise (under 120 words), and actionable!`;

    const chatParts: any[] = [];
    
    // Convert history
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        chatParts.push({ text: `${h.sender === 'user' ? name : 'PostCraft Assistant'}: ${h.text}` });
      }
    }

    chatParts.push({ text: `${name}: ${message}` });

    const result = await generateContentWithFallback(
      { parts: chatParts },
      { systemInstruction }
    );

    res.json({ success: true, reply: result.text || `Hey ${name}! I'm right here to help you make this post look amazing ✨` });
  } catch (error: any) {
    console.error('Error in AI Chat:', error);
    const name = req.body?.context?.name || 'Friend';
    res.json({
      success: true,
      reply: `Hey ${name}! I recommend adding warm lighting, testing 2-3 hashtag tags, and using an engaging call-to-action in your caption to boost reach! ✨`,
    });
  }
});

// Vite Middleware for Development Mode
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = await fs.readFile(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
} else {
  // Production static server
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

import fs from 'fs/promises';
import fsSync from 'fs';

app.listen(PORT, () => {
  console.log(`🚀 PostCraft AI Server running on http://localhost:${PORT}`);
});
