# Reflection

## What Worked

The strongest engineering decision was separating deterministic audit logic from the AI summary. The audit engine can be tested, trusted, and updated as pricing changes. OpenAI improves communication quality, but it does not own the financial math.

The UI also benefits from a low-friction flow. Users can enter spend without creating an account, see results immediately, then decide whether to save or email the report.

## Hard Parts

The hardest tradeoff is Firestore server access. The assignment environment already provides Firebase web credentials, which are enough for development if Firestore rules permit writes. A production deployment should add Firebase Admin credentials and stricter rules.

Pricing is also inherently imperfect. AI vendors change plans often, and enterprise pricing is usually negotiated. The MVP treats pricing as a benchmark, not a guaranteed invoice replacement.

## What I Would Improve Next

- Add account-based saved audit history.
- Add CSV import for vendor exports.
- Add per-seat utilization tracking.
- Add a pricing admin screen so constants can update without code deploys.
- Replace in-memory rate limiting with Redis-backed limits.

## Engineering Takeaway

For AI products that touch financial decisions, deterministic systems should create the facts and AI should explain them. That keeps the product useful without making it unpredictable.
