# Test Plan

## Automated Tests

Vitest covers the deterministic audit engine and a landing-page smoke test.

Run:

```bash
npm test
```

Current core cases:

- Savings calculations for overspending.
- Downgrade logic for unnecessary enterprise plans.
- Seat reduction when seats exceed team size.
- Alternative recommendations for overlapping tools.
- Optimized-state handling when spend matches benchmarks.
- Invalid input rejection.

## Manual QA

- Run `npm run dev`.
- Open `/`.
- Click the primary CTA to `/audit/new`.
- Add multiple tools and run an audit.
- Generate a summary.
- Save a share link.
- Open `/audit/[id]`.
- Submit lead capture with a real email in development.

## Production QA

- Verify Firestore rules and indexes.
- Verify Resend sender domain.
- Confirm OpenAI key and model availability.
- Run Lighthouse on mobile and desktop.
- Confirm public audit pages do not expose email, company, or role fields.
 updtaes will be pushed in future