# Stripe-Integration Setup

## Übersicht

Die Website ist vorbereitet für Stripe Checkout. Du musst noch:

1. Stripe-Account erstellen
2. Stripe Keys konfigurieren
3. Backend-Endpoint für Checkout-Sessions erstellen
4. Price IDs in der Pricing-Komponente eintragen

## Schritt 1: Stripe-Account erstellen

1. Gehe zu https://stripe.com
2. Erstelle einen Account (kostenlos)
3. Aktiviere den Test-Modus für Entwicklung

## Schritt 2: Stripe Keys abrufen

1. Stripe Dashboard → Developers → API Keys
2. Kopiere:
   - **Publishable Key** (beginnt mit `pk_test_...` oder `pk_live_...`)
   - **Secret Key** (beginnt mit `sk_test_...` oder `sk_live_...`)

## Schritt 3: Environment Variables in Vercel setzen

1. Gehe zu Vercel Dashboard → Settings → Environment Variables
2. Füge hinzu:

   **Production:**
   - Key: `PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Value: `pk_live_...` (dein Live Key)
   - Environment: Production

   **Preview/Development:**
   - Key: `PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Value: `pk_test_...` (dein Test Key)
   - Environment: Preview, Development

   **Secret Key (für Backend):**
   - Key: `STRIPE_SECRET_KEY`
   - Value: `sk_live_...` (dein Live Secret Key)
   - Environment: Production

   - Key: `STRIPE_SECRET_KEY`
   - Value: `sk_test_...` (dein Test Secret Key)
   - Environment: Preview, Development

## Schritt 4: Products & Prices in Stripe erstellen

1. Stripe Dashboard → Products
2. Erstelle Products für:
   - **Team Plan** (€29/seat/month)
   - **Business Plan** (€59/seat/month)

3. Für jeden Product:
   - Name: "Noyrax Team" / "Noyrax Business"
   - Description: Plan-Beschreibung
   - Pricing: Recurring, Monthly, €29 / €59
   - Kopiere die **Price ID** (beginnt mit `price_...`)

## Schritt 5: Price IDs in Pricing-Komponente eintragen

Öffne `website/src/components/Pricing.astro` und ersetze:

```typescript
// Zeile ~100: Team Plan
createCheckoutSession('price_TEAM_PRICE_ID');  // ← Ersetze mit deiner Price ID

// Zeile ~110: Business Plan
createCheckoutSession('price_BUSINESS_PRICE_ID');  // ← Ersetze mit deiner Price ID
```

## Schritt 6: Backend-Endpoint erstellen

Erstelle `website/src/pages/api/create-checkout-session.ts`:

```typescript
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const { priceId } = await request.json();
  
  // Stripe SDK importieren (npm install stripe)
  const stripe = require('stripe')(import.meta.env.STRIPE_SECRET_KEY);
  
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${new URL(request.url).origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(request.url).origin}/pricing?canceled=true`,
      metadata: {
        plan: priceId.includes('TEAM') ? 'team' : 'business',
      },
    });
    
    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

## Schritt 7: Stripe SDK installieren

```bash
cd website
npm install stripe
npm install --save-dev @types/stripe
```

## Schritt 8: Success/Cancel Pages erstellen

Erstelle `website/src/pages/success.astro`:

```astro
---
const url = Astro.url;
const sessionId = url.searchParams.get('session_id');
---

<Layout title="Payment Successful - Noyrax">
  <div class="container mx-auto px-4 py-20 text-center">
    <div class="max-w-2xl mx-auto">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h1 class="text-4xl font-headline font-bold text-doc-navy mb-4">
        Payment Successful!
      </h1>
      <p class="text-xl text-slate-600 mb-8">
        Vielen Dank für deine Anmeldung. Wir haben deine Zahlung erhalten.
      </p>
      {sessionId && (
        <p class="text-sm text-slate-500 mb-8">
          Session ID: {sessionId}
        </p>
      )}
      <a href="#quick-start" class="px-8 py-4 bg-noyrax-blue text-white rounded-lg hover:bg-opacity-90 transition-colors font-semibold text-lg">
        Get Started
      </a>
    </div>
  </div>
</Layout>
```

## Schritt 9: Webhook für Subscription-Events (optional)

Für automatische Subscription-Verwaltung:

1. Stripe Dashboard → Developers → Webhooks
2. Endpoint hinzufügen: `https://noyrax.vercel.app/api/webhook`
3. Events auswählen:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

4. Erstelle `website/src/pages/api/webhook.ts`:

```typescript
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const stripe = require('stripe')(import.meta.env.STRIPE_SECRET_KEY);
  const sig = request.headers.get('stripe-signature');
  const body = await request.text();
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      import.meta.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
  
  // Handle events
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Create user account, send welcome email, etc.
      break;
    case 'customer.subscription.deleted':
      // Cancel user access
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

## Testen

1. **Test-Modus aktivieren:**
   - Verwende Test-Keys (`pk_test_...`, `sk_test_...`)
   - Test-Card: `4242 4242 4242 4242`
   - Beliebiger zukünftiger Ablauf, beliebige CVC

2. **Lokal testen:**
   ```bash
   cd website
   npm run dev
   ```
   - Gehe zu Pricing-Sektion
   - Klicke auf "Start Free Trial"
   - Teste Checkout-Flow

3. **Production testen:**
   - Nach Deployment auf Vercel
   - Verwende echte Kreditkarte (wird nicht belastet in Test-Modus)

## Troubleshooting

**"Stripe is not defined":**
- Stripe.js wird nicht geladen → Prüfe, ob `PUBLIC_STRIPE_PUBLISHABLE_KEY` gesetzt ist

**"Invalid API Key":**
- Prüfe Environment Variables in Vercel
- Stelle sicher, dass Test-Keys für Preview, Live-Keys für Production

**Checkout öffnet nicht:**
- Prüfe Browser-Konsole auf Fehler
- Prüfe, ob Backend-Endpoint `/api/create-checkout-session` existiert
- Prüfe Network-Tab für API-Requests

## Nächste Schritte

1. **Customer Portal:** Für Subscription-Management
2. **Usage Tracking:** Für usage-basierte Abrechnung
3. **Coupons:** Für Beta-Tester-Rabatte
4. **Invoicing:** Für Enterprise-Kunden

Siehe Stripe-Dokumentation: https://stripe.com/docs

