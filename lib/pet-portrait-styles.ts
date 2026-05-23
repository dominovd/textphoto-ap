/**
 * Pre-defined style templates for the AI Pet Portrait generator.
 *
 * Each style provides a prompt template designed for image-to-image editing
 * via Nano Banana (Gemini 2.5 Flash Image). The pet from the source photo is
 * preserved (face, fur color, ears) while costume/scene is composed around it.
 *
 * Adding a new style = adding an entry here.
 */

export type PetPortraitStyle = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  // Image-to-image prompt template — the user's pet photo is fed as a reference,
  // this prompt describes how to transform it. The model keeps the pet's
  // identity (breed, color, face) and adds costume/scene.
  promptTemplate: string;
  // SEO targeting for use-case landing pages
  seoSlug?: string;
  seoVolume?: number;
};

// Showcase preview thumbnails live in Vercel Blob. To seed: generate sample
// images via /api/showcase-upload script (account-specific Blob domain).
const BLOB_BASE = "https://0sbqqt82hdpagq0d.public.blob.vercel-storage.com";

export function getPetStylePreviewUrl(styleId: string): string | null {
  // Pre-seeded styles. Add to set after seeding.
  const seeded = new Set<string>([
    // populated after seeding pass
  ]);
  return seeded.has(styleId) ? `${BLOB_BASE}/pet-showcase/${styleId}.webp` : null;
}

export const PET_PORTRAIT_STYLES: PetPortraitStyle[] = [
  {
    id: "gym-athlete",
    name: "Gym Athlete",
    description: "Pet lifting dumbbells in a gym, headphones on",
    emoji: "💪",
    promptTemplate:
      "Transform this pet into a fit gym athlete. Keep the pet's exact face, breed, fur color, and identifying features. Add a black athletic tank top and shorts, lifting two dumbbells in its paws, wearing red over-ear headphones. Background: well-lit modern gym with mirrors, treadmills, weight racks, gray rubber floor. Photorealistic, dramatic gym lighting, hyperdetailed fur, 4K. The pet must be clearly recognizable as the original animal.",
    seoSlug: "ai-pet-gym-portrait",
  },
  {
    id: "mafia-boss",
    name: "Mafia Boss",
    description: "Black fedora, pinstripe suit, cigar",
    emoji: "🎩",
    promptTemplate:
      "Transform this pet into a 1920s mafia boss. Preserve the pet's exact face, breed, fur color, and identifying features. Dress it in a perfectly tailored black pinstripe three-piece suit with white shirt and black tie, place a black fedora hat tilted on its head. A small cigar between its lips. Background: blurred autumn leaves and natural light, slight depth of field. Photorealistic, cinematic lighting, hyperdetailed fur, 4K. The pet must remain clearly identifiable as the original animal.",
    seoSlug: "cat-mafia-portrait",
  },
  {
    id: "chef",
    name: "Chef",
    description: "Chef hat, white apron, cooking in a kitchen",
    emoji: "🧑‍🍳",
    promptTemplate:
      "Transform this pet into a master chef. Keep the pet's exact face, breed, fur color, and identifying features. Dress it in a white chef coat with double-breasted buttons, a tall white chef hat (toque), and a red-and-white checkered neckerchief. Pose it standing on a wooden stool at a cozy farmhouse kitchen counter, holding a wooden spoon in its paw, stirring a small copper pot. Background: rustic kitchen with hanging copper cookware, warm sunset light through window, vegetables and herbs on the counter. Photorealistic, soft golden hour lighting, hyperdetailed fur, 4K.",
  },
  {
    id: "astronaut",
    name: "Astronaut",
    description: "Spacesuit, helmet, space background",
    emoji: "🚀",
    promptTemplate:
      "Transform this pet into an astronaut. Preserve the pet's exact face, breed, fur color, and identifying features. Dress it in a white NASA spacesuit with mission patches, helmet open (visor up) showing the pet's face clearly. Background: floating in space with Earth visible behind, stars, slight lens flare. Photorealistic, cinematic sci-fi lighting, hyperdetailed fur and spacesuit fabric, 4K.",
    seoSlug: "dog-astronaut-portrait",
    seoVolume: 320,
  },
  {
    id: "doctor",
    name: "Doctor",
    description: "White coat, stethoscope, office",
    emoji: "🩺",
    promptTemplate:
      "Transform this pet into a doctor. Keep the pet's exact face, breed, fur color, and identifying features. Dress it in a crisp white medical coat over teal scrubs, a stethoscope around its neck, a small medical headlamp on its forehead. Background: warmly lit doctor's office with diplomas on the wall, wooden desk, books, soft golden lamp light. Photorealistic, cinematic depth of field, hyperdetailed fur, 4K.",
  },
  {
    id: "medieval-knight",
    name: "Medieval Knight",
    description: "Shining armor, sword, castle backdrop",
    emoji: "⚔️",
    promptTemplate:
      "Transform this pet into a medieval knight. Preserve the pet's exact face, breed, fur color, and identifying features. Dress it in polished silver plate armor with engraved details, a long red cape, holding a steel sword in its paw. Background: misty medieval castle courtyard at dawn with stone walls and banners. Photorealistic, cinematic film-still lighting, hyperdetailed fur and metal reflections, 4K.",
  },
  {
    id: "renaissance-painting",
    name: "Renaissance Painting",
    description: "Royal oil portrait, 17th century style",
    emoji: "🎨",
    promptTemplate:
      "Reimagine this pet as the subject of a 17th-century Renaissance oil painting. Preserve the pet's exact face, breed, fur color, and identifying features. Dress it in elaborate royal attire — a dark velvet doublet with golden embroidery, a white lace ruff collar, and a small crimson cape. Pose it like a formal aristocratic portrait. Background: dark moody chiaroscuro with rich brown and ochre tones, faint suggestion of a heavy curtain. Painted in the style of Rembrandt or Van Dyck, visible oil brushstrokes, dramatic lighting on the face, ornate gold frame implied.",
    seoSlug: "renaissance-pet-portrait",
    seoVolume: 1900,
  },
  {
    id: "superhero",
    name: "Superhero",
    description: "Cape, mask, city skyline at sunset",
    emoji: "🦸",
    promptTemplate:
      "Transform this pet into a superhero. Keep the pet's exact face, breed, fur color, and identifying features. Dress it in a fitted blue and red superhero costume with a yellow lightning bolt emblem on the chest, a flowing red cape behind, and a small black domino mask around its eyes. Background: city rooftop at sunset with skyscrapers in soft focus, dramatic golden hour clouds. Heroic low-angle composition, photorealistic, cinematic lighting, hyperdetailed fur, 4K.",
  },
  {
    id: "samurai",
    name: "Samurai",
    description: "Japanese armor, katana, cherry blossoms",
    emoji: "🗡️",
    promptTemplate:
      "Transform this pet into a samurai warrior. Preserve the pet's exact face, breed, fur color, and identifying features. Dress it in detailed traditional Japanese samurai armor (do-maru) in lacquered black and red with gold accents, holding a katana sword. Background: cherry blossom garden in spring, soft pink petals falling, Mount Fuji in the misty distance. Photorealistic, cinematic film-still composition, hyperdetailed fur and armor lacquer, 4K.",
  },
  {
    id: "business-ceo",
    name: "Business CEO",
    description: "Navy suit, glasses, modern office",
    emoji: "💼",
    promptTemplate:
      "Transform this pet into a serious business CEO. Keep the pet's exact face, breed, fur color, and identifying features. Dress it in a perfectly tailored navy blue business suit, a crisp white shirt, and a burgundy silk tie. Place small round glasses on its nose. Background: floor-to-ceiling glass windows of a top-floor modern office overlooking a city skyline, blurred for depth of field. Pose: sitting in a leather executive chair, paws resting confidently on a wooden desk. Photorealistic, cinematic corporate lighting, hyperdetailed fur and fabric, 4K.",
  },
  {
    id: "rockstar",
    name: "Rockstar",
    description: "Leather jacket, sunglasses, electric guitar",
    emoji: "🎸",
    promptTemplate:
      "Transform this pet into a rockstar. Preserve the pet's exact face, breed, fur color, and identifying features. Dress it in a black leather biker jacket with chrome zippers, a torn band t-shirt underneath, and small black sunglasses. Pose it on stage holding a red electric guitar. Background: dark concert stage with stage lights, smoke, and lens flare. Photorealistic, dramatic concert lighting, hyperdetailed fur and leather texture, 4K.",
  },
  {
    id: "wizard",
    name: "Wizard",
    description: "Robe, staff, magical glow",
    emoji: "🧙",
    promptTemplate:
      "Transform this pet into a wise wizard. Keep the pet's exact face, breed, fur color, and identifying features. Dress it in a long flowing midnight-blue robe embroidered with silver stars and moons, a tall pointed wizard hat, and a small wooden staff with a glowing crystal at the top in its paw. Background: ancient stone library with stacks of leather-bound books, candles, soft floating magical glow particles. Photorealistic, magical warm lighting, hyperdetailed fur and fabric embroidery, 4K.",
  },
];

export function getPetStyle(id: string): PetPortraitStyle | undefined {
  return PET_PORTRAIT_STYLES.find((s) => s.id === id);
}

export function getPetStylesWithSeoSlug(): PetPortraitStyle[] {
  return PET_PORTRAIT_STYLES.filter((s) => s.seoSlug);
}

/**
 * Build the final image-edit prompt for Nano Banana.
 * - `style`: chosen preset
 * - `customNotes`: optional user-supplied additions (appended at end, max 200 chars)
 */
export function buildPetPrompt(
  style: PetPortraitStyle,
  customNotes?: string,
): string {
  const base = style.promptTemplate;
  const notes = (customNotes || "").trim().slice(0, 200);
  if (!notes) return base;
  return `${base} Additional details requested by user: ${notes}.`;
}
