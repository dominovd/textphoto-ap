import { NextResponse } from "next/server";

// Mock caption generator. Replace with real AI call once provider is wired up.
const POOLS: Record<string, string[]> = {
  aesthetic: [
    "Golden hour hits different when the sky decides to put on a show",
    "Chasing light, finding magic",
    "Soft sky, soft mood, soft me",
    "Lost in the colours of the sunset",
    "Sometimes the view says everything",
    "A quiet moment, captured forever",
    "Where the sky meets my mood",
    "Slow days, soft skies, full heart",
    "Filed under: feels like a dream",
    "A pocket of golden",
  ],
  funny: [
    "I'm not a photographer, but I can picture us together",
    "Currently accepting compliments",
    "Sorry for what I said when I was hungry",
    "Caption this in the comments — I'm out of ideas",
    "If lost, return to coffee",
    "Out of office. Forever",
    "Recipe: 3 cups of attitude, 1 cup of sarcasm",
    "I came, I saw, I forgot why I was here",
    "Walked into this picture and refused to leave",
    "Plot twist: this caption wrote itself",
  ],
  romantic: [
    "Every love story is beautiful, but ours is my favourite",
    "I found my home in you",
    "Forever isn't long enough",
    "Two hearts, one beat",
    "You + me = a story I love telling",
    "Wherever you are is exactly where I want to be",
    "Thank you for being my favourite",
    "Better with you. Always",
    "My heart's been smiling since I met you",
    "Same path, same person, same forever",
  ],
  savage: [
    "Comparison is the thief of joy — so I stopped comparing",
    "I don't follow back. I lead",
    "Built different, by design",
    "Quietly winning",
    "Some lessons you don't repeat",
    "Stay humble. Stay deadly",
    "Receipts in my pocket, peace in my heart",
    "Less talk. More reps",
    "My energy is a privilege",
    "Be the plot twist they didn't see coming",
  ],
  professional: [
    "Excited to share what we've been building",
    "Lessons from this week's project",
    "Behind every great result is a team that cares",
    "Showing up consistently is half the work",
    "Reflecting on a productive week",
    "Grateful for the people who push me to be better",
    "Quiet progress is still progress",
    "Big things are built one rep at a time",
    "Detail matters. So does the bigger picture",
    "Onwards",
  ],
  inspirational: [
    "You are exactly where you need to be",
    "Small steps still cover ground",
    "Be patient with yourself — you're growing",
    "The view is worth the climb",
    "Light always finds a way in",
    "Trust the timing of your life",
    "Begin again. As many times as you need",
    "Bloom in your own season",
    "Quiet wins matter",
    "Keep going. You're closer than you think",
  ],
};

const TAGS: Record<string, string[]> = {
  aesthetic: ["#goldenhour", "#aesthetic", "#moodygrams", "#softlight"],
  funny: ["#lol", "#mood", "#sorrynotsorry", "#randomthoughts"],
  romantic: ["#couplegoals", "#love", "#forever", "#mybetterhalf"],
  savage: ["#mindset", "#focus", "#stayhumble", "#builtdifferent"],
  professional: ["#worklife", "#leadership", "#growth", "#thoughtleadership"],
  inspirational: ["#motivation", "#growthmindset", "#keepgoing", "#dailyinspo"],
};

const EMOJIS: Record<string, string[]> = {
  aesthetic: ["✨", "🌅", "☁️", "🌙"],
  funny: ["😂", "🙃", "👀", "🤡"],
  romantic: ["💕", "❤️", "🌹", "💫"],
  savage: ["🔥", "⚡", "🖤", "💯"],
  professional: ["💼", "📈", "🚀", "✅"],
  inspirational: ["🌱", "🌟", "🦋", "🌻"],
};

function pick<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const vibe: string = body.vibe || "aesthetic";
  const includeHashtags: boolean = body.hashtags ?? true;
  const includeEmojis: boolean = body.emojis ?? true;

  const pool = POOLS[vibe] || POOLS.aesthetic;
  const tags = TAGS[vibe] || [];
  const emos = EMOJIS[vibe] || [];

  // Light artificial latency so the loading state is visible
  await new Promise((r) => setTimeout(r, 600));

  const captions = pool.map((base) => {
    let line = base;
    if (includeEmojis) {
      const e = emos[Math.floor(Math.random() * emos.length)];
      line += ` ${e}`;
    }
    let hashtagCount = 0;
    if (includeHashtags) {
      const ht = pick(tags, 2 + Math.floor(Math.random() * 2));
      hashtagCount = ht.length;
      line += ` ${ht.join(" ")}`;
    }
    return { text: line, chars: line.length, hashtags: hashtagCount };
  });

  return NextResponse.json({ captions });
}
