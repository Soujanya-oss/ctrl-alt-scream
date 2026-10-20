import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Spirit Oracle API endpoint powered by Gemini 3.8 Flash
  app.post('/api/spirit-oracle', async (req, res) => {
    try {
      const { type = 'fortune', input = '', activeCurses = [], victimName = 'Friend' } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        const fallbacks: Record<string, string[]> = {
          roast: [
            `Scanning ${victimName}'s aura... ERROR 404: Composure not found! One floating pixel ghost and they spilled their pumpkin latte! 🎃👻`,
            `${victimName} looked at the cursor melting and thought their graphics card was turning into pumpkin soup. A classic! 😂`,
            `I've witnessed ancient phantoms across millennia, but nobody screams quite like ${victimName} encountering an inverted gravity desktop! 🦇`,
            `${victimName} tried to exorcise the pop-up by turning the monitor upside down. Absolute genius strategy. 🧠🍬`
          ],
          curse_idea: [
            `Pro-Tip: Activate "Phantom Typing" with the message: "FEED ME CANDY CORN TO RESTORE YOUR OS." Works 100% of the time! 🍬`,
            `Combo move: Pair "Gravity Inversion" with "Mouse Slime Trail". Tell them the computer's anti-gravity gyros need calibrated by doing 3 jumping jacks! 🤸`,
            `The Spectral Special: Enable "Ectoplasm Melting" + "Theremin Wails", then innocently ask why their screen smells like roasted pumpkin seeds! 🎃🔥`
          ],
          fortune: [
            `The Ouija modem whispers: You will acquire 42 pieces of king-size candy, but one of them will be a trick wrapped in spooky foil. 🍫✨`,
            `Your digital fortune: Tonight, a friendly 8-bit ghost will protect your Wi-Fi router from bad vibes and low battery warnings. 👻📶`,
            `The pumpkin stars align: You will soon pull off the greatest, most harmless Halloween prank of the century. 🎃🏆`
          ],
          custom_prank: [
            `Message from the cyber-void: Tell ${victimName} the only cure for a haunted CPU is sacrificing three Reese's peanut butter cups to the keyboard tray! 🥜👻`
          ]
        };
        const pool = fallbacks[type] || fallbacks.fortune;
        const text = pool[Math.floor(Math.random() * pool.length)];
        return res.json({ response: text, fallback: true });
      }

      const ai = new GoogleGenAI({ apiKey });
      let prompt = '';
      if (type === 'roast') {
        prompt = `Roast our prank victim "${victimName}" or their hilarious frightened reaction to our Halloween prank simulator. The currently activated curses on their screen are: ${activeCurses.join(', ') || 'mild haunting'}. Additional detail from user: "${input}". Write a snappy, witty, playful, 2-3 sentence roast in Halloween cyber-ghost style. No real cruelty, keep it all in good fun and laughter!`;
      } else if (type === 'curse_idea') {
        prompt = `Suggest an ingenious, hilarious, non-destructive Halloween computer prank idea to pull on a friend or coworker. Context: "${input}". 2-3 sentences, maximum fun.`;
      } else if (type === 'fortune') {
        prompt = `Give a hilarious Halloween cyber-fortune or cursed retro horoscope for "${victimName}". Context: "${input}". 2-3 sentences.`;
      } else {
        prompt = `Respond as Grimbyte 9000, a sassy 90s cyber-poltergeist ghost residing in "The Possession Simulator". The user asks: "${input}". Keep it spooky, hilarious, and punchy in under 3 sentences.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are Grimbyte 9000, an eccentric 90s cyber-poltergeist ghost inhabiting "The Possession Simulator" (a playful Halloween prank app). You speak with comedic flair, retro-hacker puns, spooky Halloween references (pumpkins, candy corn, flying bats, ectoplasm), and mischievous warmth. Keep replies concise (2-3 sentences), punchy, and thoroughly entertaining.',
        }
      });

      res.json({ response: response.text || 'BOO! A friendly ghost ate your fortune, but left candy behind!' });
    } catch (err: any) {
      console.error('Oracle Error:', err);
      res.json({ 
        response: 'Spiritual etheric static! The ghost is currently stuffing its face with virtual candy. Try again in a tick! 🍬👻',
        fallback: true 
      });
    }
  });

  // Health route
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'haunted_and_healthy', time: Date.now() });
  });

  // Dev Vite middleware or static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎃 The Possession Simulator server listening on port ${PORT}`);
  });
}

startServer();
