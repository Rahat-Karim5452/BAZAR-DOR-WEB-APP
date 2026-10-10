# বাজার দর (BazarDor)

প্রয়োজনীয় পণ্যের আজকের বাজারদর এক নজরে। চাল, ডাল, তেল, সবজি, মাছ, মাংস ও মসলার দাম, বাজারভিত্তিক তুলনা এবং দামের পরিবর্তন জানুন এক জায়গায়।

**Live Link:** https://your-domain.vercel.app
**GitHub:** https://github.com/your-username/your-repo

## প্রযুক্তি (Technologies)

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- HeroUI
- BetterAuth (Email/Password, Google, GitHub)
- MongoDB Atlas
- react-text-marquee
- react-hot-toast
- @gravity-ui/icons

## মূল বৈশিষ্ট্য (Features)

1. **লাইভ বাজারদর ticker:** নিচে scrolling strip-এ পণ্যের দাম ও দামের পরিবর্তন দেখায়।
2. **আজ দাম বেড়েছে / কমেছে:** সবচেয়ে বেশি বাড়া ও কমা ৬টি করে পণ্য আলাদাভাবে দেখায়।
3. **ক্যাটাগরি ও সাজানো:** ক্যাটাগরি অনুযায়ী পণ্য দেখা যায় এবং দাম অনুযায়ী সাজানো যায়।
4. **বাজারভিত্তিক বিস্তারিত দাম:** প্রতিটি পণ্যের সর্বনিম্ন, সর্বাধিক ও গড় দাম এবং প্রতিটি বাজারের তালিকা।
5. **অ্যাকাউন্ট ব্যবস্থা:** Email/Password ও Google/GitHub দিয়ে সাইন আপ, সাইন ইন, প্রোফাইল আপডেট ও সাইন আউট।
6. **রেসপন্সিভ ডিজাইন:** মোবাইল, ট্যাবলেট ও ডেস্কটপে ঠিকভাবে কাজ করে।

## Local-এ চালানোর নিয়ম

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
npm run dev
```

তারপর project-এর root-এ `.env.local` file বানিয়ে নিচের variable গুলো দিন:

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

পণ্য ও দামের তথ্য: `https://api.abcz.workers.dev/api/bazardor`
