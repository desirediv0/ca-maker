import "./globals.css";
import { Navbar } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "sonner";

export const metadata = {
  title: "CA Maker | CA Mohit Kukreja - Audit Coaching for CA Inter",
  description: "CA Maker by CA Mohit Kukreja - Expert CA Inter Audit coaching with 6 years Big 4 experience. Simple explanations, practical examples, and exam-focused preparation.",
  keywords: "CA Inter Audit, CA coaching, CA Mohit Kukreja, Audit classes, CA preparation, Standards on Auditing, CA Inter coaching",
  authors: [{ name: "CA Maker" }],
  openGraph: {
    title: "CA Maker | CA Mohit Kukreja - Audit Coaching for CA Inter",
    description: "Expert CA Inter Audit coaching with practical Big 4 experience. Making Audit simple, relatable, and scoring.",
    type: "website",
    locale: "en_IN",
    siteName: "CA Maker",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <Toaster position="top-right" richColors closeButton />
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
