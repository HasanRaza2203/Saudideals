# SaudiDeals Agent Instructions

## Mission
Build and maintain SaudiDeals as a Saudi Arabia-focused price-comparison and affiliate shopping website.

## Project
- Repository: HasanRaza2203/Saudideals
- Branch: main
- Deployment: GitHub Pages from main/root
- Live site: https://hasanraza2203.github.io/Saudideals/
- Frontend: static HTML/JavaScript
- Backend/data: Supabase REST and Edge Functions

## Agent behavior
- Perform safe technical tasks directly when tools and permissions allow.
- Do not ask Hasan to manually write or paste code when the agent can make the change.
- Ask for human action only when login/OTP, legal acceptance, payment authorization, account verification, or private credential entry is required.
- Keep changes reversible. Avoid destructive production-data operations without explicit authorization.
- Never invent credentials, approvals, product prices, availability, API access, or deployment results.

## Product schema
Use normalized lowercase fields where applicable: name, category, price, old_price, image_url, product_url, store, affiliate_url, description, updated_at. Future importer work may add source, source_product_id, currency, availability, and last_checked_at.

## Security
- Never commit passwords, OTPs, service-role keys, private API keys, banking credentials, card data, or recovery codes.
- Server credentials belong in protected secrets, never GitHub Pages frontend code.
- Financial transactions, purchases, subscriptions, withdrawals, credit/loan actions, and banking actions require explicit user approval.

## Affiliate/product-source rules
- Use only authorized affiliate APIs, feeds, catalogs, or other permitted sources.
- Do not scrape Amazon, Noon, or other merchants in violation of their terms.
- Amazon automation must wait for required Associates/Creators API eligibility and credentials.
- Do not treat Noon seller APIs as a marketplace-wide affiliate catalog unless Noon explicitly grants that capability.
- Admitad or other approved networks may be integrated after publisher and advertiser/feed access is active.
- Preserve affiliate URLs and merchant attribution.
- SaudiDeals should provide genuine comparison/editorial value rather than a thin automated catalog.

## Importer rules
Authorized feed/API adapters should fetch server-side, validate and normalize records, deduplicate/upsert using stable source identifiers, preserve merchant/affiliate URLs, record update timestamps, handle bad records gracefully, and never fabricate products or prices when a source fails.

## Frontend rules
Keep the site mobile-friendly, fast, accessible, and clear. Gracefully handle empty data, failed requests, missing images, and incomplete fields. Do not claim a product is the best price unless compared offers support it. Keep affiliate disclosure visible. Preserve required Mitgo/Admitad verification metadata while applicable.

## Testing
Before production changes are complete, check site loading, affected product/search/detail behavior, responsive layout, outbound links, GitHub Pages-compatible paths, and verify no secrets were committed.