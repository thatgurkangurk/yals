import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { getUser } from "@/lib/auth/config";
import { JotaiProvider } from "@/components/jotai-provider";
import { SessionProvider } from "@/components/session-provider";
import { getServerSettingsOrInit } from "@/lib/settings";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "yals",
  description: "yet another link shortener",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const serverSettings = await getServerSettingsOrInit();

  const { registrationEnabled } = serverSettings;
  const session = await getUser();
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.className} flex min-h-screen w-full flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <JotaiProvider>
            <SessionProvider session={session}>
              <div vaul-drawer-wrapper="">
                <Navbar registrationEnabled={registrationEnabled} />
                <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col bg-muted/40 p-4 md:p-10">
                  {children}
                </main>
              </div>
            </SessionProvider>
          </JotaiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
