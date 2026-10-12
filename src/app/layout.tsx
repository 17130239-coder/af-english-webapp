import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AF English",
  description: "Trực quan hóa, tra cứu và luyện tập flashcard từ vựng tiếng Anh được trích xuất từ AF Extension",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('af_theme');
                  var isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f5f7fa] dark:bg-[#0f111a] text-[#141824] dark:text-[#eff2f6] transition-colors duration-150 font-sans">
        {children}
      </body>
    </html>
  );
}
