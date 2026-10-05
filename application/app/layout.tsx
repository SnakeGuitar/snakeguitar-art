import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnakeGuitar — Illustration & Commissions",
  description: "Furry art, character design, fineliner illustrations with graphite details and custom commissions by SnakeGuitar.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('sg-theme');document.documentElement.dataset.theme=t==='dark'||t==='light'?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){}})()` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
