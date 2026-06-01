import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ToastProvider } from "@/components/ToastProvider";
import { SettingsProvider } from "@/components/SettingsProvider";
import { EditorProvider } from "@/components/EditorProvider";
import { AudioProvider } from "@/components/AudioProvider";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

const isGithubActions = process.env.GITHUB_ACTIONS || false;
const basePath = isGithubActions ? "/Pomora" : "";

export const metadata: Metadata = {
  title: "Pomora",
  description: "Votre espace de productivité LiquidGlass",
  manifest: `${basePath}/manifest.json`,
  icons: {
    icon: `${basePath}/favicon.ico`,
  },
};

export const viewport = {
  themeColor: "#ff3131",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body bg-[#050505] text-white transition-colors duration-500 min-h-screen selection:bg-primary/30">
        <SettingsProvider>
          <EditorProvider>
            <AudioProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </AudioProvider>
          </EditorProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
