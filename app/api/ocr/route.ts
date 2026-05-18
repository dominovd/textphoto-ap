import { NextResponse } from "next/server";

const SAMPLES = [
  `Receipt — Cafe Sunrise
Date: 2026-05-18

1x Cappuccino           $4.50
1x Almond croissant     $3.80
1x Sparkling water      $2.20
------------------------
Subtotal               $10.50
Tax (8.5%)              $0.89
------------------------
Total                  $11.39

Thank you for visiting!`,
  `Meeting notes — May 18

Topic: Q3 launch
Attendees: Alex, Sam, Priya

- Confirm landing page copy by Friday
- Email automation needs QA from marketing
- Pricing experiment goes live Monday
- Next sync: Wed 2pm`,
  `INGREDIENTS

2 cups all-purpose flour
1 tsp baking soda
1/2 tsp salt
1 cup butter, softened
3/4 cup sugar
3/4 cup brown sugar
2 large eggs
1 tsp vanilla extract
2 cups chocolate chips

Preheat oven to 375°F.
Mix dry ingredients in one bowl.
Cream butter and sugars in another.
Combine, fold in chips.
Bake 10–12 minutes.`,
];

export async function POST() {
  // Mock latency
  await new Promise((r) => setTimeout(r, 800));
  const text = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
  return NextResponse.json({ text, confidence: 0.94, language: "en" });
}
