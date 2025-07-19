


//     <main>
//   <h1>Welcome from root!</h1>
// <AuthButtons />
// </main>
"use client";

import AuthButtons from "@/components/AuthButtons";
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import NewsHighlights from '@/components/NewsHighlights';
import CommunityHighlights from '@/components/CommunityHighlights';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';

export default function Home() {
  return (
    <AuthGuard requireAuth={false}>
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <Features />
        <NewsHighlights />
        <CommunityHighlights />
      </main>
      <Footer />
    </div>
    </AuthGuard>
  );
}
