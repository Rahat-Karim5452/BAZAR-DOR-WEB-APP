# BazarDor (বাজার দর)

Daily market prices of essential goods at a glance. Track prices of rice, lentils, oil, vegetables, fish, meat and spices, compare prices across markets, and see daily price changes in one place.

**Live Link:** https://your-domain.vercel.app
**GitHub:** https://github.com/your-username/your-repo

## Technologies Used

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- HeroUI
- BetterAuth (Email/Password, Google, GitHub)
- MongoDB Atlas
- react-fast-marquee
- react-hot-toast
- @gravity-ui/icons

## Features

1. **Live price ticker:** A scrolling strip showing product prices and daily changes.
2. **Top risers and fallers:** Shows the top 6 products with the biggest price increases and decreases.
3. **Categories and sorting:** Browse products by category and sort them by price.
4. **Market-wise details:** Minimum, maximum and average prices for each product, with a list of markets.
5. **Authentication:** Sign up and sign in with Email/Password, Google or GitHub, update your name, and sign out.
6. **Responsive design:** Works on mobile, tablet and desktop.

## Getting Started

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
npm run dev
```

Create a `.env.local` file in the project root:

```
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_BASE_URL=http://localhost:3000
BETTER_AUTH_DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## Data Source

Product and price data: `https://api.abcz.workers.dev/api/bazardor`
