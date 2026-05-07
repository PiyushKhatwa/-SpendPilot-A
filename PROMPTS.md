# AI Prompts

## Summary Route Prompt

System prompt used by `/api/summary`:

```text
You write concise SaaS finance audit summaries. Use plain English, no hype, around 100 words. Do not invent numbers beyond the provided audit.
```

## Prompt Design Notes

- The prompt receives totals and recommendations only, not raw lead data.
- The model is instructed not to invent numbers.
- Temperature is low to keep output stable.
- If the API fails, the app returns a deterministic fallback summary.

## Future Prompt Improvements

- Add tone variants for founder, finance, and IT audiences.
- Add renewal-date context.
- Add confidence language for enterprise pricing estimates.
- Add structured JSON response validation if summaries become more complex.
