import { Router } from "express";
import {
  RecommendInfluencersBody,
  GenerateOutreachBody,
} from "@workspace/api-zod";

const router = Router();

const INFLUENCERS = [
  {
    id: "1",
    name: "Maya Chen",
    platform: "Instagram",
    niche: "Skincare & Clean Beauty",
    audience: "Women 18-35 interested in sustainable, clean beauty products",
    audienceSize: "Medium",
    engagement: "High",
  },
  {
    id: "2",
    name: "Jordan Williams",
    platform: "YouTube",
    niche: "Personal Finance & Investing",
    audience: "Young professionals 22-40 building wealth and managing money",
    audienceSize: "Large",
    engagement: "High",
  },
  {
    id: "3",
    name: "Sofia Ramirez",
    platform: "TikTok",
    niche: "Fitness & Home Workouts",
    audience: "Fitness enthusiasts 18-30 looking for affordable, at-home routines",
    audienceSize: "Large",
    engagement: "Very High",
  },
  {
    id: "4",
    name: "Marcus Thompson",
    platform: "YouTube",
    niche: "Tech Reviews & Gadgets",
    audience: "Tech-savvy men 20-45 interested in the latest consumer electronics",
    audienceSize: "Large",
    engagement: "Medium",
  },
  {
    id: "5",
    name: "Priya Sharma",
    platform: "Instagram",
    niche: "Sustainable Living & Eco Products",
    audience: "Eco-conscious consumers 25-40 committed to green living",
    audienceSize: "Small",
    engagement: "High",
  },
  {
    id: "6",
    name: "Tyler Brooks",
    platform: "TikTok",
    niche: "Food & Recipe Creation",
    audience: "Home cooks 20-45 seeking quick, affordable, and healthy meal ideas",
    audienceSize: "Medium",
    engagement: "Very High",
  },
  {
    id: "7",
    name: "Aisha Johnson",
    platform: "Instagram",
    niche: "Fashion & Personal Style",
    audience: "Fashion-forward women 18-35 following trends on a budget",
    audienceSize: "Medium",
    engagement: "High",
  },
  {
    id: "8",
    name: "Derek Nguyen",
    platform: "YouTube",
    niche: "Gaming & Esports",
    audience: "Gamers 16-30 interested in strategy games and gaming gear",
    audienceSize: "Large",
    engagement: "High",
  },
  {
    id: "9",
    name: "Camille Fontaine",
    platform: "Instagram",
    niche: "Wellness & Mental Health",
    audience: "Adults 25-45 focused on mindfulness, self-care, and mental well-being",
    audienceSize: "Small",
    engagement: "Very High",
  },
  {
    id: "10",
    name: "Jake Martinez",
    platform: "TikTok",
    niche: "DIY & Home Improvement",
    audience: "Homeowners 28-50 interested in budget-friendly renovation projects",
    audienceSize: "Medium",
    engagement: "High",
  },
  {
    id: "11",
    name: "Lily Park",
    platform: "YouTube",
    niche: "Travel & Adventure",
    audience: "Travel lovers 22-38 seeking affordable, off-the-beaten-path experiences",
    audienceSize: "Medium",
    engagement: "High",
  },
  {
    id: "12",
    name: "Elijah Carter",
    platform: "Instagram",
    niche: "Fitness & Sports Nutrition",
    audience: "Athletes and gym-goers 18-35 focused on performance and supplementation",
    audienceSize: "Large",
    engagement: "High",
  },
  {
    id: "13",
    name: "Nina Vasquez",
    platform: "TikTok",
    niche: "Beauty & Makeup Tutorials",
    audience: "Beauty enthusiasts 15-28 learning makeup techniques and product reviews",
    audienceSize: "Large",
    engagement: "Very High",
  },
];

router.post("/recommend", async (req, res) => {
  const parsed = RecommendInfluencersBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { product, audience } = parsed.data;

  const keywords = `${product} ${audience}`.toLowerCase().split(/\s+/);

  const keywordScore = (inf: (typeof INFLUENCERS)[0]) => {
    const hay = `${inf.niche} ${inf.audience}`.toLowerCase();
    return keywords.filter((kw) => kw.length > 3 && hay.includes(kw)).length;
  };

  const candidates = [...INFLUENCERS]
    .sort((a, b) => keywordScore(b) - keywordScore(a))
    .slice(0, 8);

  const influencers = candidates.slice(0, 5).map((inf, i) => ({
    ...inf,
    score: 80 - i * 5,
    reasoning: `Strong niche alignment with your target audience.`,
  }));

  console.log("Instant fallback response returned");
  res.json({ influencers });
});

function nichePhrase(niche: string): string {
  const n = niche.toLowerCase();
  if (n.includes("gaming") || n.includes("esport"))
    return "gaming content";
  if (n.includes("tech") || n.includes("gadget") || n.includes("review"))
    return "tech content and reviews";
  if (n.includes("beauty") || n.includes("makeup") || n.includes("skincare"))
    return "beauty tutorials and content";
  if (n.includes("fitness") || n.includes("workout") || n.includes("sport"))
    return "fitness routines and wellness content";
  if (
    n.includes("sustain") ||
    n.includes("eco") ||
    n.includes("green") ||
    n.includes("living")
  )
    return "eco-conscious content";
  if (n.includes("finance") || n.includes("invest") || n.includes("money"))
    return "finance content";
  if (n.includes("fashion") || n.includes("style"))
    return "fashion and style content";
  if (n.includes("food") || n.includes("cook") || n.includes("recipe"))
    return "food and recipe content";
  return `${niche.toLowerCase()} content`;
}

function deterministicIndex(seed: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % max;
}

router.post("/outreach", async (req, res) => {
  const parsed = GenerateOutreachBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { influencer, product } = parsed.data;
  const { name, niche, audience } = influencer;
  const phrase = nichePhrase(niche);

  const audienceSnippet = audience.split(" ").slice(0, 7).join(" ");

  const templates = [
    `Hi ${name},\n\nI've been following your ${phrase} and really appreciate the way you engage your audience. We're currently building ${product}, and I think it could align well with the type of content you create.\n\nGiven your focus on ${niche}, this feels like a natural fit — and I'd love to explore a potential collaboration with you.\n\nWould you be open to a quick chat this week?\n\nBest,\n[Your Name]`,

    `Hey ${name},\n\nI came across your ${phrase} and was genuinely impressed by how you connect with your community. I'm working on ${product}, and I think it could fit naturally into your content without feeling forced.\n\nYour audience of ${audienceSnippet} seems like exactly the kind of people who would resonate with what we're building.\n\nI'd love to collaborate in a way that feels authentic to your style — let me know if you'd be open to chatting!\n\nThanks,\n[Your Name]`,

    `Hi ${name},\n\nI've been really impressed with your work in the ${niche} space. Your audience is clearly highly engaged, and I think what we're building could genuinely add value for them.\n\nWe're currently working on ${product}, and I'd love to partner with you to showcase it in a way that fits your content and feels right for your community.\n\nWould you be open to a quick conversation to explore this?\n\nBest,\n[Your Name]`,

    `Hey ${name},\n\nYour ${phrase} really caught my attention — especially the way you make ${niche} content feel approachable and genuine. We're launching ${product} and are looking for creators who can bring that same authenticity to a partnership.\n\nI think your audience of ${audienceSnippet} would find it genuinely useful, and I'd love to find a collaboration format that works for you.\n\nOpen to a quick chat to see if it's a good fit?\n\nThanks,\n[Your Name]`,

    `Hi ${name},\n\nI wanted to reach out because your ${niche} content stood out to us. We're building ${product} and have been looking for creators whose audience would genuinely connect with it — and yours fits perfectly.\n\nI'd love to explore what a partnership could look like, whether that's a dedicated post, an integration, or something else entirely.\n\nWould you have 15 minutes to connect this week?\n\nBest,\n[Your Name]`,
  ];

  const message = templates[Math.floor(Math.random() * templates.length)];

  console.log("Outreach response sent");
  res.json({ message });
});

export default router;
