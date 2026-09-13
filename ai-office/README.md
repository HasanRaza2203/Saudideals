# SaudiDeals AI Office

Local autonomous operations layer for SaudiDeals.

## What runs automatically
- Website health monitoring
- Git/repository readiness checks
- Department/agent status updates
- Operating-cycle logging every 5 minutes
- Owner approval queue for high-risk actions

## Owner approval required
Money, contracts, paid-ad budgets, banking/payouts, irreversible production changes, secrets/private data, OTP/CAPTCHA, and risky legal/public actions.

## Dashboard
Open `http://127.0.0.1:4310` on the SaudiDeals PC.
The service starts automatically when Windows signs in.

## Current boundary
This version contains the autonomous office engine and deterministic workers. Generative AI actions that require a model API are not enabled until an approved model connection is configured.