# Pricing Data

## Source Strategy

The MVP uses static pricing constants in `src/lib/audit/pricing.ts`. These constants are benchmarks for optimization logic, not invoice guarantees.

## Included Tools

| Tool | Category | Plans Modeled |
| --- | --- | --- |
| Cursor | Coding | Hobby, Pro, Business |
| ChatGPT | Chat | Free, Plus, Team, Enterprise |
| Claude | Chat | Free, Pro, Team, Enterprise |
| Gemini | Chat | Free, Advanced, Business, Enterprise |
| GitHub Copilot | Coding | Individual, Business, Enterprise |
| OpenAI API | API | Usage |
| Anthropic API | API | Usage |
| Windsurf | Coding | Free, Pro, Teams, Enterprise |

## Update Process

1. Review vendor pricing pages.
2. Update `pricingCatalog`.
3. Add or update audit engine tests.
4. Record the pricing update date in this file.
5. Rebuild and redeploy.

## Known Limitations

- Enterprise prices are estimates because real contracts vary.
- API optimization is modeled as a percentage savings opportunity because usage mix matters more than a flat plan price.
- The app should eventually store pricing data in Firestore or a CMS for faster updates.
