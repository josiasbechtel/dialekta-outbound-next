import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dialekta Outbound Workflow",
  description: "Migration des bestehenden Dialekta Outbound Dashboards nach Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <style>{`
          :root { --text: #142544; --text-muted: #72829b; --primary: #075a78; --accent: #10cfd0; }
          body, .app, .sheet, .result-item, .card, .list-item, button, a { color: var(--text); }
          .header-action-row .compact-btn, .header-row + .sub-copy { display: none !important; }
          .company-text, .company-text i { color: #12aaa9 !important; }
          .company-text { align-items: center; gap: 8px; flex-wrap: wrap; }
          .location-chip-soft, .result-meta.location-meta, .detail-location-chip.compact, .call-context-pill.call-location { display: inline-flex !important; align-items: center; gap: 5px; min-height: 24px; padding: 4px 9px; border-radius: 999px; background: rgba(16,207,208,.12) !important; color: #087a86 !important; border: 1px solid rgba(16,207,208,.24) !important; font-size: .68rem !important; font-weight: 800 !important; letter-spacing: .02em; text-transform: uppercase; white-space: nowrap; }
          .result-name-line .location-meta { order: -1; margin-left: 0; }
          .result-name-line { gap: 8px 10px; }
          .result-name, .detail-contact-name, .sheet-title, .big-number, .import-count, .list-info h3, .preview-lead-name { color: var(--text) !important; }
          .result-meta, .lead-card-links, .detail-primary-links a, .preview-lead-meta, .preview-lead-side, .sub-copy, .termin-block-context { color: var(--text-muted) !important; }
          .call-btn-action, .call-btn-action span, .call-btn-action i, .detail-call-button, .detail-call-button span, .detail-call-button i { color: #ffffff !important; }
          .termin-block-context { display: none !important; }
          .detail-location-chip:not(.compact) { min-height: 24px !important; padding: 4px 9px !important; border-radius: 999px !important; background: rgba(16,207,208,.12) !important; color: #087a86 !important; border: 1px solid rgba(16,207,208,.24) !important; font-size: .68rem !important; }
          .detail-header-company { flex-wrap: wrap; align-items: center; }
        `}</style>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
