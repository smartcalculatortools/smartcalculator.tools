# Deployment And Monetization Checklist

This project is deploy-ready on Vercel. The codebase already includes:

- Static generation for calculator, category, embed, and social image routes
- SEO metadata, canonical URLs, sitemap, and robots
- Privacy, cookies, terms, about, and contact pages
- Consent-aware Analytics and AdSense loading
- `/ads.txt` generation from the AdSense publisher ID

## 0. Current production status

As of `March 28, 2026`, the site is already deployed at:

- `https://smartcalculatortools.net`

What is already working:

- The production domain is live
- `robots.txt` is live
- `sitemap.xml` is live
- Policy pages are live
- Contact page is live
- Consent-aware loading is implemented in code

What is still missing at the account/environment level:

- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_ADSENSE_CLIENT`
- `NEXT_PUBLIC_ADSENSE_SLOT_HOME`
- `NEXT_PUBLIC_ADSENSE_SLOT_CALC`

Important consequence:

- `https://smartcalculatortools.net/ads.txt` currently returns `404` because `NEXT_PUBLIC_ADSENSE_CLIENT` is not configured yet.

## 0.1 Recommended execution order

Follow this order exactly:

1. Create a public domain email address.
2. Add the public email to Vercel as `NEXT_PUBLIC_CONTACT_EMAIL`.
3. Create or finish your Google Analytics property and get the Measurement ID.
4. Add the Analytics ID to Vercel as `NEXT_PUBLIC_GA_ID`.
5. Create or finish your AdSense account and add the site in AdSense.
6. Get the AdSense publisher ID and set `NEXT_PUBLIC_ADSENSE_CLIENT`.
7. Redeploy production once so `/ads.txt` starts returning `200`.
8. In AdSense, create display ad units and collect the slot IDs.
9. Add the slot IDs to Vercel.
10. Redeploy production again.
11. In AdSense Privacy & messaging, configure the European regulations message if you serve EEA/UK/Switzerland traffic.
12. In Search Console, verify the domain property and submit the sitemap.

## 1. Environment variables

Copy `.env.example` to `.env.local` for local development.

Required for production identity:

```env
NEXT_PUBLIC_SITE_URL=https://smartcalculatortools.net
NEXT_PUBLIC_CONTACT_EMAIL=support@smartcalculatortools.net
```

Optional Google Analytics:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Optional Google AdSense:

```env
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456
NEXT_PUBLIC_ADSENSE_SLOT_HOME=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_CALC=0987654321
```

## 2. How to get the missing values

### Contact email

Create a public inbox on the production domain such as `support@smartcalculatortools.net` or `privacy@smartcalculatortools.net`. Then set:

```env
NEXT_PUBLIC_CONTACT_EMAIL=support@smartcalculatortools.net
```

#### Recommended method if your DNS is on Cloudflare

This is the simplest setup if the domain is managed in Cloudflare DNS.

1. Sign in to Cloudflare.
2. Open the `smartcalculatortools.net` zone.
3. Open `Email`.
4. Open `Email Routing`.
5. If Email Routing is not enabled yet, click `Get started` or `Enable`.
6. Let Cloudflare add the required `MX` and `TXT` records automatically.
7. Go to `Routing rules`.
8. Click `Create address`.
9. In `Custom address`, enter `support` or `privacy`.
10. In `Destination`, enter the inbox that should receive the forwarded mail, for example your Gmail address.
11. Save the rule.
12. Open the verification email that Cloudflare sends to the destination inbox.
13. Confirm the destination inbox.
14. Test the route by sending a message from a different email address to `support@smartcalculatortools.net`.

Notes:

- Cloudflare Email Routing is forwarding only. It is not a full mailbox provider.
- If you need to send mail from the same address, you may also need an outbound mail provider such as Google Workspace, Zoho Mail, or another SMTP-capable provider.

After that, add this value in Vercel:

```env
NEXT_PUBLIC_CONTACT_EMAIL=support@smartcalculatortools.net
```

### Google Analytics measurement ID

#### If you do not already have a GA4 property

1. Open Google Analytics.
2. Click `Admin`.
3. Create a new `Account` if needed.
4. Create a new `Property`.
5. Choose a `Web` data stream for `https://smartcalculatortools.net`.
6. Finish the setup wizard.

#### If you already have a GA4 property

1. Open Google Analytics.
2. Click `Admin`.
3. Under `Data streams`, open the website stream for `smartcalculatortools.net`.
4. Copy the Measurement ID.
5. The Measurement ID always starts with `G-`.

Set it as:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### What happens after setting it

- The site will start loading the Google tag only when the visitor allows analytics.
- The local consent implementation already sends Google consent mode signals.
- Browser-local usage personalization in this project is also gated behind analytics consent.

#### How to add it in Vercel

Dashboard method:

1. Open Vercel.
2. Open the `smartcalculator-tools` project.
3. Open `Settings`.
4. Open `Environment Variables`.
5. Add:
   - Name: `NEXT_PUBLIC_GA_ID`
   - Value: your `G-...` ID
   - Environments: `Production` and optionally `Preview`
6. Save.

CLI method:

```bash
vercel env add NEXT_PUBLIC_GA_ID production
vercel env add NEXT_PUBLIC_GA_ID preview
```

### Google AdSense publisher ID and slot IDs

There are two separate things here:

1. The **publisher ID**:
   This activates the AdSense script and powers `/ads.txt`.
2. The **slot IDs**:
   These are for the actual ad placements used by the homepage and calculator pages.

#### Step A: Get or activate the AdSense account

1. Sign in to AdSense.
2. Complete any account activation steps shown to you.
3. Make sure the account is for website monetization, not just another Google surface.

#### Step B: Add the site to AdSense

1. In AdSense, open `Sites`.
2. Add the root domain: `smartcalculatortools.net`.
3. Do not add a page URL like `/calc/mortgage`.
4. Wait for AdSense site review.

Important:

- Google states that the `Sites` page is the place where you add a new site for monetization.
- Since the project already has policy pages, robots, sitemap, and contact page, the code side is ready for review.

#### Step C: Find the publisher ID

1. In AdSense, open `Account`.
2. Look for the publisher ID.
3. It looks like `pub-1234567890123456`.
4. For this project, convert it to:

```env
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456
```

The `ca-` prefix is required because the ad script URL and ad tags expect that format.

#### Step D: Put the publisher ID in Vercel first

Add only this first, even before slot IDs if needed:

```env
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456
```

Why first?

- The production site will start returning a valid `/ads.txt`.
- AdSense will be able to recrawl the seller record.
- This moves you out of the current `404 ads.txt` state.

Then redeploy production immediately.

#### Step E: Create the ad units after approval or when your account allows it

1. In AdSense, open `Ads`.
2. Open `By ad unit`.
3. Click `Display ads`.
4. Create one unit for the homepage.
5. Create one unit for calculator pages.
6. Use clear names such as:
   - `home_display_main`
   - `calculator_display_main`
7. Keep them `Responsive`.
8. Click `Save and get code`.
9. In the generated code, find `data-ad-slot="1234567890"`.
10. Copy only the numeric slot value.

Set them as:

```env
NEXT_PUBLIC_ADSENSE_SLOT_HOME=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_CALC=0987654321
```

Set them as:

```env
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890123456
NEXT_PUBLIC_ADSENSE_SLOT_HOME=1234567890
NEXT_PUBLIC_ADSENSE_SLOT_CALC=0987654321
```

After that, verify that:

- `https://your-domain/ads.txt` returns the Google seller line
- AdSense no longer reports a missing `ads.txt` issue after recrawl time

#### Important review timing note

Google says ads.txt updates may take a few days to appear in AdSense, and on low-traffic sites the review can take up to a month.

That means:

- If `/ads.txt` is correct on the live site but AdSense still says `Not found`, do not keep changing it every hour.
- Leave it stable and wait for AdSense recrawl.

### Consent management for EEA, UK, and Switzerland

The site now includes a local consent layer and Google consent mode signals, but that alone is not the same as a Google-certified CMP.

If you serve ads in the EEA, UK, or Switzerland, complete one of these account-level paths in AdSense:

1. Use Google's `Privacy & messaging` European regulations message.
2. Or use a Google-certified CMP that integrates with the IAB TCF.

Do not rely on the built-in site banner alone for those regions.

#### Recommended path: use Google Privacy & messaging

If you want the easiest path inside the Google stack:

1. Sign in to AdSense.
2. Open `Privacy & messaging`.
3. Open the `European regulations` message type.
4. Open `Settings`.
5. Add your privacy policy URL.
6. Add your cookie policy URL.
7. Review the ad technology provider settings.
8. Review the "purposes for your own use" settings.
9. If you want Google products to interpret consent signals, enable the relevant consent mode settings.
10. Publish the message.

You should use your live policy URLs:

- `https://smartcalculatortools.net/privacy`
- `https://smartcalculatortools.net/cookies`

Important date:

- Google requires a certified CMP for relevant EEA/UK/Switzerland ad serving from `January 16, 2024`.

## 3. Vercel production env setup

Add the production values in Vercel for the linked project:

```bash
vercel env add NEXT_PUBLIC_CONTACT_EMAIL production
vercel env add NEXT_PUBLIC_GA_ID production
vercel env add NEXT_PUBLIC_ADSENSE_CLIENT production
vercel env add NEXT_PUBLIC_ADSENSE_SLOT_HOME production
vercel env add NEXT_PUBLIC_ADSENSE_SLOT_CALC production
```

Repeat for `preview` if you want preview deployments to use them.

### Exact Vercel dashboard steps

1. Open Vercel.
2. Select the project `smartcalculator-tools`.
3. Open `Settings`.
4. Open `Environment Variables`.
5. Add one variable at a time.
6. Choose `Production`.
7. Save.
8. Repeat for `Preview` if needed.

Recommended order in Vercel:

1. `NEXT_PUBLIC_CONTACT_EMAIL`
2. `NEXT_PUBLIC_GA_ID`
3. `NEXT_PUBLIC_ADSENSE_CLIENT`
4. Redeploy production
5. `NEXT_PUBLIC_ADSENSE_SLOT_HOME`
6. `NEXT_PUBLIC_ADSENSE_SLOT_CALC`
7. Redeploy production again

## 4. Local verification

Run before publishing:

```bash
npm run lint
npm test
npm run build
npm run status:prod
```

## 5. Publish to production

If the Vercel project is already linked:

```bash
vercel --prod
```

Or with an explicit token:

```bash
vercel --prod --token <VERCEL_TOKEN>
```

### Current project note

This repository is already linked to a Vercel project, and production has already been published successfully from this machine. After changing production environment variables, you should redeploy production so those values become active.

## 6. Post-publish checks

After deployment, verify:

1. Homepage loads on the production domain.
2. `/sitemap.xml` and `/robots.txt` respond correctly.
3. `/contact`, `/privacy`, `/cookies`, and `/terms` are public.
4. `/ads.txt` returns `200` once AdSense is configured.
5. Search Console can fetch the sitemap.
6. AdSense sees the site and policy pages correctly.

### Exact post-publish check commands

You can run these in PowerShell:

```powershell
Invoke-WebRequest -Uri 'https://smartcalculatortools.net' -UseBasicParsing | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -Uri 'https://smartcalculatortools.net/sitemap.xml' -UseBasicParsing | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -Uri 'https://smartcalculatortools.net/robots.txt' -UseBasicParsing | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -Uri 'https://smartcalculatortools.net/contact' -UseBasicParsing | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -Uri 'https://smartcalculatortools.net/privacy' -UseBasicParsing | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -Uri 'https://smartcalculatortools.net/cookies' -UseBasicParsing | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -Uri 'https://smartcalculatortools.net/terms' -UseBasicParsing | Select-Object -ExpandProperty StatusCode
```

For `ads.txt`:

```powershell
Invoke-WebRequest -Uri 'https://smartcalculatortools.net/ads.txt' -UseBasicParsing
```

Expected behavior:

- Before `NEXT_PUBLIC_ADSENSE_CLIENT`: `404`
- After `NEXT_PUBLIC_ADSENSE_CLIENT`: `200`

## 7. Search Console setup

This is strongly recommended immediately after the environment variables are done.

### Add the property

1. Open Google Search Console.
2. Add a new property.
3. Choose `Domain property`, not `URL-prefix`, unless you have a special reason.
4. Enter `smartcalculatortools.net`.
5. Search Console will ask for DNS verification.

### Verify by DNS

1. Copy the TXT verification record from Search Console.
2. Open your DNS provider.
3. Add a TXT record to the root domain.
4. Wait for DNS propagation.
5. Return to Search Console.
6. Click `Verify`.

Important:

- Google says domain properties use DNS verification.
- Do not delete the TXT record after verification succeeds.

### Submit the sitemap

1. In Search Console, open the verified property.
2. Open `Sitemaps`.
3. Submit:

```text
https://smartcalculatortools.net/sitemap.xml
```

Google says submitting a sitemap is a hint, not a guarantee, but it is still the standard step and lets you inspect sitemap processing status.

## 8. Fastest path to finish everything

If you want the minimum practical path without getting lost:

1. Create `support@smartcalculatortools.net`.
2. Put `NEXT_PUBLIC_CONTACT_EMAIL` in Vercel.
3. Create GA4 and put `NEXT_PUBLIC_GA_ID` in Vercel.
4. Create/activate AdSense, add the site, get publisher ID.
5. Put `NEXT_PUBLIC_ADSENSE_CLIENT` in Vercel.
6. Redeploy production.
7. Confirm `/ads.txt` is `200`.
8. Create two display ad units and collect the slot IDs.
9. Put `NEXT_PUBLIC_ADSENSE_SLOT_HOME` and `NEXT_PUBLIC_ADSENSE_SLOT_CALC` in Vercel.
10. Redeploy production.
11. Create the European regulations message in AdSense Privacy & messaging if you want EEA/UK/Switzerland coverage.
12. Verify the domain in Search Console and submit the sitemap.

## Official references

- Google Analytics measurement ID: https://support.google.com/analytics/answer/9539598?hl=en
- Google Analytics measurement ID details: https://support.google.com/analytics/answer/12270356?hl=en
- Google Analytics setup flow: https://support.google.com/analytics/answer/10307594?hl=en
- AdSense publisher ID: https://support.google.com/adsense/answer/2923881?hl=en-GB
- Find your publisher ID: https://support.google.com/adsense/answer/105516?hl=en
- AdSense display ad units: https://support.google.com/adsense/answer/9274025?hl=en
- AdSense sites page note: https://support.google.com/adsense/answer/12170421?hl=en
- ads.txt guidance: https://support.google.com/adsense/answer/7679060?hl=en
- Privacy policy URLs in Privacy & messaging: https://support.google.com/adsense/answer/10961370?hl=en
- European regulations messages: https://support.google.com/adsense/answer/10961068?hl=en
- Consent mode settings in Privacy & messaging: https://support.google.com/adsense/answer/16053245?hl=en
- EU user consent policy: https://support.google.com/adsense/answer/7670013?hl=en
- Certified CMP requirement: https://support.google.com/adsense/answer/13554116?hl=en
- Google CMP consent mode update: https://support.google.com/adsense/answer/16088460
- Search Console property types: https://support.google.com/webmasters/answer/34592?hl=en
- Search Console DNS verification: https://support.google.com/webmasters/answer/9008080?hl=en
- Build and submit a sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Cloudflare Email Routing overview: https://developers.cloudflare.com/email-routing/
- Enable Cloudflare Email Routing: https://developers.cloudflare.com/email-routing/get-started/enable-email-routing/
- Cloudflare custom email addresses: https://developers.cloudflare.com/email-routing/setup/email-routing-addresses/
