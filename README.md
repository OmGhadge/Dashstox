# Dashstox - Trading Dashboard

A comprehensive trading dashboard built with Next.js, featuring real-time stock charts, financial news, community features, and more.

## Features

- **Dashboard**: Overview of market data and portfolio
- **Charts**: Interactive stock charts with watchlist functionality
- **News**: Latest financial news with search and filtering
- **Community**: Share and discuss trade ideas
- **Authentication**: User authentication with NextAuth.js
- **Database**: Prisma ORM with PostgreSQL

## API Endpoints

The application includes the following API routes:

- `GET /api/stocks/[symbol]` - Fetch stock data from Yahoo Finance
- `GET /api/trade-ideas` - Get community trade ideas
- `POST /api/trade-ideas` - Submit new trade ideas with image upload

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000)** with your browser to see the result.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
DATABASE_URL="your_database_url"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Project Structure

- `app/` - Next.js app router pages and API routes
- `components/` - Reusable React components
- `lib/` - Utility functions and database client
- `prisma/` - Database schema and migrations
- `public/` - Static assets and uploaded files

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
