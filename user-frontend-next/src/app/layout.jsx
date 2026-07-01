import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import BackgroundEffects from "@/components/BackgroundEffects";
import PremiumExtras from "@/components/PremiumExtras";

export const metadata = {
  title: "Leo Crackers | Premium Quality Crackers from Sivakasi",
  description: "Buy premium quality fireworks and crackers directly from Sivakasi. Best prices, fast delivery, and safe celebrations with Leo Crackers.",
  keywords: "crackers online, sivakasi crackers, buy fireworks, diwali crackers, leo crackers, premium fireworks, cheap crackers",
  openGraph: {
    title: "Leo Crackers | Premium Fireworks from Sivakasi",
    description: "Buy premium quality fireworks and crackers directly from Sivakasi. Best prices for Diwali and all celebrations.",
    url: "https://www.leocrackers.com/",
    type: "website",
    images: ["/leo-crackers-logo.png"],
  },
  alternates: {
    canonical: "https://www.leocrackers.com/",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <div className="min-h-screen flex flex-col relative">
            <BackgroundEffects />
            <PremiumExtras />
            <main className="flex-grow z-10 relative">
              {children}
            </main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
