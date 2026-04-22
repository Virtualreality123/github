# ECHO — Product Spec (v0.1)

**Tagline:** *Someone already lived your life. Find them.*

## 1) Product Positioning

ECHO is an AI-powered "trajectory matching" app that combines:
- visual similarity,
- psychological profile alignment,
- and milestone-timeline comparison.

The key differentiator is not "you look like X" but "your path resembles X at your current life stage."

## 2) Target Users

1. **Self-discovery seekers (18–35):** enjoy quizzes, identity content, and social sharing.
2. **Career optimizers (22–40):** looking for models of success and decision guidance.
3. **Pop-culture users:** motivated by celebrity and historical comparisons.

## 3) Core User Promise

In under 3 minutes, users get:
- one compelling identity match,
- a trajectory explanation,
- and a clear reason to share or subscribe.

## 4) MVP Scope

### 4.1 Onboarding
- Email/social login
- Consent + privacy disclosures
- Optional selfie upload

### 4.2 Face Similarity
- Input: selfie
- Output: top 3 visual matches (celebrity + opted-in public profiles)
- Note: result labeled as "visual resemblance score" only.

### 4.3 Life DNA Quiz
Collect structured traits across:
- ambition & achievement orientation,
- risk tolerance,
- money mindset,
- social style,
- adversity profile,
- work preference.

### 4.4 Timeline Sync
Generate age-based comparisons:
- "At age N, your top match was doing..."
- "Common pivot moments for your trajectory cluster."

### 4.5 Share Card
- Side-by-side match card
- Short narrative headline
- Watermarked for organic distribution

## 5) Premium Features (Subscription)

- Unlimited matches
- Historical figure database
- "Future Path" scenario narratives (3 branches)
- Deeper trait diagnostics + action plan
- Weekly trajectory update

## 6) Matching System (High-Level)

`Final Score = 0.35*Face + 0.40*LifeDNA + 0.25*Timeline`

Where:
- **Face:** embedding distance from vision model
- **LifeDNA:** vector similarity over psychometric traits
- **Timeline:** milestone sequence alignment by age window

Guardrails:
- Never claim deterministic destiny
- Never assert identity equivalence
- Always frame as probabilistic pattern matching

## 7) Monetization

- **Free tier:** 1 full match + limited share
- **Pro monthly:** $9.99
- **Pro annual:** $79.99 (intro pricing)

Upgrade triggers:
- blur locked insights,
- show "2 more high-confidence matches",
- preview 1 branch of future path, lock remaining branches.

## 8) Safety, Legal, and Trust

1. **Claims language:** avoid deterministic wording.
2. **Consent:** explicit permission for facial analysis.
3. **Data controls:** delete selfie and profile on demand.
4. **Sensitive categories:** avoid health/legal/credit predictions.
5. **Bias checks:** monitor model output skew across demographics.

## 9) Success Metrics

### Activation
- Selfie completion rate
- Quiz completion rate
- Time-to-first-match

### Engagement
- Share rate
- D7 retention
- Weekly return rate

### Revenue
- Free→paid conversion
- ARPU
- Churn (monthly)

## 10) Technical Starter Stack

- **Frontend:** Next.js + React
- **Backend:** Node.js (API routes or Express)
- **AI Services:**
  - Face embeddings (e.g., Rekognition or equivalent)
  - LLM for narrative generation
- **Data:** Postgres (users, traits, matches, events)
- **Queue:** background jobs for embedding and narrative regeneration

## 11) 4-Week Execution Plan

### Week 1
- Data model + auth + onboarding
- Quiz v1 + basic scoring

### Week 2
- Face upload + embedding pipeline
- Matching endpoint + first result UI

### Week 3
- Timeline Sync narrative
- Share card generation

### Week 4
- Paywall + subscription events
- Analytics dashboard and A/B tests

## 12) Messaging Examples

- "You are 82% trajectory-aligned with [Profile] at age 32."
- "People on your path typically hit a major pivot in 12–18 months."
- "This is pattern intelligence, not fate."

## 13) Risks and Mitigations

- **Risk:** novelty fades quickly.
  - **Mitigation:** weekly updated insights and streak mechanics.
- **Risk:** privacy concerns around selfies.
  - **Mitigation:** transparent retention windows + quick delete controls.
- **Risk:** overclaiming outcomes.
  - **Mitigation:** strict language policy and confidence labels.

---

## One-Sentence Pitch

ECHO turns lookalike matching into trajectory intelligence: a shareable AI experience that tells users who they resemble, where their path is heading, and what to do next.
