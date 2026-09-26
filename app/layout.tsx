import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen flex flex-col bg-[#FAF8F5] antialiased text-[#18181B] font-caslon selection:bg-[#EFE9DD]">
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
