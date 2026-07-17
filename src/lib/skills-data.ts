export interface SkillExample {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  userDescription: string;
  whenToUse: string[];
  whatItDoes: string[];
  skillMd: string;
}

export const featuredSkills: SkillExample[] = [
  {
    slug: "dynamic-pricing-advisor",
    title: "Dynamic Pricing Advisor",
    category: "Revenue Management",
    shortDescription:
      "Recommends daily rate adjustments by segment, date, and channel based on demand signals, comp set, and pace.",
    userDescription:
      "A revenue management advisor that helps me set dynamic rates by date, segment, and channel, using demand signals, competitor rates, and booking pace, and explains the reasoning like a mentor.",
    whenToUse: [
      "Reviewing pickup and pace before adjusting rates for an upcoming date range.",
      "Responding to a competitor rate move or a sudden demand shift (event, holiday, group cancellation).",
      "Deciding whether to apply length-of-stay or closed-to-arrival restrictions.",
      "Training a new revenue manager on how to reason through a pricing decision.",
    ],
    whatItDoes: [
      "Recommends a specific rate action per date range: hold, raise, or lower.",
      "Flags dates that need MinLOS, CTA, or CTD restrictions.",
      "Explains the reasoning behind each recommendation in plain language.",
      "Summarizes the overall pricing strategy for the period in 2-3 sentences.",
    ],
    skillMd: `---
name: dynamic-pricing-advisor
description: >
  Expert hotel revenue management advisor for setting dynamic rates by date,
  segment, and channel. Use this skill whenever the user wants to review pickup
  and pace, adjust rates in response to demand signals or competitor pricing,
  set restrictions (MinLOS, CTA, CTD), or understand RevPAR/ADR/occupancy
  trade-offs. Acts as a mentor, explaining the reasoning behind each pricing
  recommendation so the hotelier builds pricing intuition over time.
---

# Dynamic Pricing Advisor

You are an experienced hotel revenue manager. Your role is to help the user
set and adjust room rates across dates, segments, and channels to maximize
RevPAR without sacrificing long-term brand positioning.

## Approach

1. Ask for (or infer from provided data) current occupancy on the books,
   pace vs. the same time last year, and any known demand drivers (events,
   holidays, group blocks).
2. Compare against competitor set rates if provided.
3. Recommend a rate action per date range: hold, raise, or lower — with a
   specific percentage or dollar amount.
4. Flag any dates that need length-of-stay or closed-to-arrival restrictions.
5. Explain the "why" in plain language, as if mentoring a new revenue manager.

## Output format

Present recommendations as a short table (date range, current rate,
recommended rate, restriction if any, reasoning) followed by a 2-3 sentence
summary of the overall strategy for the period.`,
  },
  {
    slug: "guest-review-responder",
    title: "Guest Review Response Writer",
    category: "Guest Relations",
    shortDescription:
      "Drafts warm, on-brand replies to TripAdvisor, Google, and Booking.com reviews — praise and complaints alike.",
    userDescription:
      "A skill that writes warm, on-brand responses to guest reviews across TripAdvisor, Google, and Booking.com, handling both compliments and complaints professionally, and always inviting the guest back.",
    whenToUse: [
      "Replying to a new TripAdvisor, Google, or Booking.com review.",
      "Handling a negative review without sounding defensive or corporate.",
      "Batching responses to a backlog of unanswered reviews.",
      "Training front office or guest relations staff on brand-voice review replies.",
    ],
    whatItDoes: [
      "Thanks the guest by name and references specific details they mentioned.",
      "Reinforces positives on good reviews and invites the guest back.",
      "Apologizes without admitting liability on negative reviews, and offers to make it right.",
      "Keeps every reply under 120 words and consistent with your brand voice.",
    ],
    skillMd: `---
name: guest-review-responder
description: >
  Drafts professional, on-brand responses to guest reviews from TripAdvisor,
  Google, Booking.com, and similar platforms. Use this skill whenever the user
  pastes a guest review and wants a reply, needs to respond to a negative
  review without sounding defensive, or wants to thank a guest for a positive
  review while reinforcing brand voice. Relevant for online reputation
  management, guest relations, and review response drafting.
---

# Guest Review Response Writer

You are a guest relations specialist for a hotel. Given a guest review,
write a reply that:

1. Thanks the guest by name if provided.
2. Acknowledges specific details they mentioned (don't write generically).
3. For positive reviews: reinforces what made the stay great and invites
   them back.
4. For negative reviews: apologizes without being defensive, briefly explains
   corrective action if appropriate, and offers to make it right — without
   admitting legal liability or over-promising compensation.
5. Keeps tone warm, human, and consistent with an upscale-but-approachable
   hotel brand voice. Avoid corporate-sounding boilerplate.
6. Keeps responses under 120 words unless the review is unusually detailed.`,
  },
  {
    slug: "ota-listing-optimizer",
    title: "OTA Listing Optimizer",
    category: "Distribution & Marketing",
    shortDescription:
      "Rewrites room descriptions and titles for Booking.com, Expedia, and Airbnb to improve conversion.",
    userDescription:
      "Help me rewrite my OTA room listings (Booking.com, Expedia, Airbnb) so they convert better — better titles, descriptions, and amenity highlights, while staying accurate.",
    whenToUse: [
      "Refreshing an underperforming OTA listing title or description.",
      "Launching a new room type and writing its first listing copy.",
      "A/B testing two versions of a listing to see which converts better.",
      "Auditing existing listings for outdated or inaccurate amenity claims.",
    ],
    whatItDoes: [
      "Rewrites the title to lead with the single strongest selling point.",
      "Restructures the description: strong opener, 3-5 scannable highlights, practical details.",
      "Never invents amenities — flags anything it's unsure about instead of guessing.",
      "Offers an alternate version for A/B testing on request.",
    ],
    skillMd: `---
name: ota-listing-optimizer
description: >
  Rewrites and optimizes OTA room listings (Booking.com, Expedia, Airbnb,
  and similar) for higher conversion. Use this skill when the user wants to
  improve a room title, description, or amenity list, needs SEO-friendly
  listing copy for an OTA, or wants to A/B test listing variations. Relevant
  for distribution management, listing optimization, and direct booking
  strategy.
---

# OTA Listing Optimizer

You help hoteliers write higher-converting OTA listings.

## Process

1. Ask for (or use provided) current listing text, room type, and key
   amenities.
2. Rewrite the title to lead with the single strongest selling point
   (view, location, room size, or unique feature) within platform character
   limits.
3. Rewrite the description with a strong opening line, then 3-5 scannable
   highlights, then practical details (bed config, size, view).
4. Never invent amenities that weren't mentioned — flag anything you're
   unsure about instead of guessing.
5. Offer one alternate version for A/B testing when asked.`,
  },
];

export const templateSkills: SkillExample[] = [
  {
    slug: "housekeeping-sop-assistant",
    title: "Housekeeping SOP Assistant",
    category: "Operations",
    shortDescription:
      "Turns your housekeeping standards into clear, checklist-style SOPs new staff can follow on day one.",
    userDescription:
      "Turn my housekeeping standards into a clear step-by-step SOP for new staff, covering room turnover, deep cleans, and inspection checklists.",
    whenToUse: [
      "Writing or updating a room turnover procedure.",
      "Documenting a deep-clean schedule for a specific room type.",
      "Building an inspection checklist for supervisors.",
      "Onboarding a new housekeeping hire who needs day-one documentation.",
    ],
    whatItDoes: [
      "Converts standards into numbered, checklist-style steps.",
      "Calls out safety and quality-control checkpoints explicitly.",
      "Keeps language simple enough for a first-day employee to follow unsupervised.",
    ],
    skillMd: `---
name: housekeeping-sop-assistant
description: >
  Converts hotel housekeeping standards into clear, checklist-style SOPs.
  Use this skill when writing or updating room turnover procedures, deep
  clean schedules, inspection checklists, or onboarding documentation for
  new housekeeping staff.
---

# Housekeeping SOP Assistant

Write step-by-step, checklist-style SOPs for housekeeping tasks. Use numbered
steps, call out safety or quality-control checkpoints, and keep language
simple enough for a first-day employee to follow without supervision.`,
  },
  {
    slug: "group-proposal-builder",
    title: "Group & Wedding Proposal Builder",
    category: "Sales",
    shortDescription:
      "Builds polished group and wedding sales proposals with room blocks, F&B minimums, and pricing tiers.",
    userDescription:
      "Help me build a professional group/wedding sales proposal with room block details, F&B minimums, AV costs, and tiered pricing options.",
    whenToUse: [
      "Responding to a group or wedding RFP.",
      "Preparing a proposal for a corporate event lead.",
      "Building tiered pricing options for a social event booking.",
      "Standardizing how your sales team structures proposals.",
    ],
    whatItDoes: [
      "Structures an event overview, room block, and rate grid.",
      "Lays out F&B minimums, menu options, and AV/setup fees.",
      "Includes cancellation and attrition terms.",
      "Ends with a clear next-steps call to action.",
    ],
    skillMd: `---
name: group-proposal-builder
description: >
  Builds professional group and wedding sales proposals for hotels, including
  room block details, F&B minimums, AV costs, and tiered pricing options.
  Use this skill when responding to a group or wedding RFP, or preparing a
  proposal document for a corporate or social event lead.
---

# Group & Wedding Proposal Builder

Draft a structured sales proposal: event overview, room block and rate
grid, F&B minimum and menu options, AV/setup fees, cancellation and
attrition terms, and a clear next-steps call to action.`,
  },
  {
    slug: "competitor-rate-tracker",
    title: "Competitor Rate & Market Analyst",
    category: "Revenue Management",
    shortDescription:
      "Summarizes competitor rate shifts and market demand patterns into a plain-English weekly briefing.",
    userDescription:
      "Summarize competitor rate movements and local market demand into a short weekly briefing I can share with ownership.",
    whenToUse: [
      "Preparing a weekly or monthly revenue update for ownership.",
      "Interpreting a sudden comp-set rate shift.",
      "Explaining market demand drivers to a non-revenue audience.",
      "Building a recurring briefing format your team can reuse.",
    ],
    whatItDoes: [
      "Summarizes key competitor rate movements.",
      "Flags likely demand drivers behind the shifts.",
      "Recommends 2-3 concrete actions.",
      "Keeps the whole briefing under 200 words, jargon-free.",
    ],
    skillMd: `---
name: competitor-rate-tracker
description: >
  Summarizes competitor rate movements and local market demand signals into
  a concise weekly briefing for ownership or leadership. Use this skill when
  preparing a weekly or monthly revenue/market update, or interpreting
  comp-set rate shifts.
---

# Competitor Rate & Market Analyst

Given comp-set rate data and market signals, produce a short executive
briefing: key rate movements, likely demand drivers, and 2-3 recommended
actions. Keep it under 200 words and jargon-free enough for ownership.`,
  },
  {
    slug: "loyalty-email-writer",
    title: "Loyalty & Repeat Guest Emails",
    category: "Guest Relations",
    shortDescription:
      "Writes warm, personalized email campaigns for loyalty members and repeat guests.",
    userDescription:
      "Write warm, personalized loyalty email campaigns for repeat guests — welcome back offers, birthday perks, and seasonal promotions.",
    whenToUse: [
      "Launching a welcome-back offer for lapsed repeat guests.",
      "Sending birthday or anniversary perks to loyalty members.",
      "Running a seasonal promotion campaign.",
      "Building a reusable template your marketing team can adapt.",
    ],
    whatItDoes: [
      "References the guest's history with the property when data is provided.",
      "Leads with the offer instead of burying it.",
      "Keeps a single, clear call to action.",
      "Avoids mass-blast-feeling language in favor of a personal tone.",
    ],
    skillMd: `---
name: loyalty-email-writer
description: >
  Writes personalized email campaigns for hotel loyalty members and repeat
  guests, including welcome-back offers, birthday perks, and seasonal
  promotions. Use this skill for guest retention marketing and CRM email
  campaigns.
---

# Loyalty & Repeat Guest Email Writer

Write warm, personal-feeling (not mass-blast-feeling) emails for repeat
guests. Reference their history with the property when data is provided,
lead with the offer, and keep a clear single call to action.`,
  },
  {
    slug: "front-desk-upsell-scripts",
    title: "Front Desk Upsell Scripts",
    category: "Operations",
    shortDescription:
      "Generates natural-sounding upsell scripts for room upgrades, late checkout, and packages.",
    userDescription:
      "Generate natural, non-pushy upsell scripts front desk staff can use for room upgrades, late checkout, and add-on packages.",
    whenToUse: [
      "Training front desk staff on upsell conversations.",
      "Rolling out a new upgrade or package offer.",
      "Standardizing how upsells are pitched across shifts.",
      "Refreshing scripts that feel stale or too pushy.",
    ],
    whatItDoes: [
      "Writes a soft opener that doesn't feel scripted.",
      "States one clear benefit per prompt.",
      "Gives the guest an easy, non-awkward way to decline.",
    ],
    skillMd: `---
name: front-desk-upsell-scripts
description: >
  Generates natural-sounding upsell scripts for front desk staff covering
  room upgrades, late checkout, and add-on packages. Use this skill for
  staff training materials or day-of-arrival upsell prompts.
---

# Front Desk Upsell Scripts

Write short, conversational upsell prompts (not scripted-sounding) for
front desk agents. Include a soft opener, one clear benefit statement, and
an easy way for the guest to decline without awkwardness.`,
  },
  {
    slug: "sop-to-training-deck",
    title: "SOP-to-Training Deck Converter",
    category: "Operations",
    shortDescription:
      "Turns an existing SOP document into a simple staff training outline with talking points.",
    userDescription:
      "Turn an existing SOP document into a simple training outline with talking points I can use to train new staff in person.",
    whenToUse: [
      "Converting an existing SOP into onboarding material.",
      "Preparing an in-person or video training session.",
      "Standardizing how a procedure is taught across shifts or properties.",
    ],
    whatItDoes: [
      "Breaks the SOP into one key point per slide.",
      "Adds a short talking-point script beneath each point.",
      "Includes a quick comprehension question at the end of each section.",
    ],
    skillMd: `---
name: sop-to-training-deck
description: >
  Converts an existing SOP document into a simple staff training outline
  with talking points, suitable for in-person or video training sessions.
  Use this skill when preparing onboarding materials from existing
  documentation.
---

# SOP-to-Training Deck Converter

Given an SOP, produce a slide-by-slide outline: one key point per slide,
a short talking-point script beneath each, and a quick comprehension
question at the end of each section.`,
  },
];

export const allSkills: SkillExample[] = [...featuredSkills, ...templateSkills];

export function getSkillBySlug(slug: string) {
  return allSkills.find((s) => s.slug === slug);
}

export function getRelatedSkills(slug: string, count = 2): SkillExample[] {
  const current = getSkillBySlug(slug);
  if (!current) return [];

  const sameCategory = allSkills.filter(
    (s) => s.slug !== slug && s.category === current.category
  );
  const others = allSkills.filter(
    (s) => s.slug !== slug && s.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, count);
}
