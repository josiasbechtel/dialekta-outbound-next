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
          :root { --text: #142544; --text-muted: #72829b; --primary: #0b5f82; --accent: #21c7cb; }
          body, .app, .sheet, .result-item, .card, .list-item, button, a { color: var(--text) !important; }
          .bottom-nav { position: relative; z-index: 45; flex-shrink: 0; }
          .overlay { inset: 0 0 calc(78px + env(safe-area-inset-bottom)) 0; z-index: 30; }
          .sheet { max-height: 100%; border-radius: 28px 28px 0 0; }
          .header-action-row .compact-btn, .header-row + .sub-copy, .termin-block-context { display: none !important; }
          .company-text, .company-text i { color: #19aaaa !important; }
          .company-text { align-items: center; gap: 8px; flex-wrap: wrap; font-weight: 800; }
          .company-text-row { display: flex; align-items: center; justify-content: flex-start; gap: 8px 10px; flex-wrap: wrap; }
          .company-text-main { display: inline-flex; align-items: center; gap: 8px; min-width: 0; }
          .location-chip-soft, .result-meta.location-meta, .detail-location-chip.compact, .call-context-pill.call-location { display: inline-flex !important; align-items: center; gap: 6px; min-height: 28px; padding: 4px 11px; border-radius: 999px; background: rgba(33,199,203,.12) !important; color: #0d7383 !important; border: 1px solid rgba(33,199,203,.28) !important; font-size: .7rem !important; font-weight: 800 !important; letter-spacing: .03em; text-transform: uppercase; white-space: nowrap; }
          .result-name-line { gap: 8px 14px; }
          .result-name, .detail-contact-name, .sheet-title, .big-number, .import-count, .list-info h3, .preview-lead-name { color: var(--text) !important; }
          .result-meta, .lead-card-links, .detail-primary-links a, .preview-lead-meta, .preview-lead-side, .sub-copy, .old-contact-inline, .detail-old-contact-inline { color: var(--text-muted) !important; }
          .lead-card-links { border-top: 1px solid var(--border); padding-top: 12px; }
          .old-contact-inline { display: flex; flex-wrap: wrap; gap: 8px 16px; padding-top: 10px; margin-top: 4px; border-top: 1px dashed rgba(114,130,155,.3); font-size: .8rem; }
          .old-contact-inline span, .detail-old-contact-inline span { display: inline-flex; align-items: center; gap: 7px; text-decoration: line-through; }
          .call-btn-action, .call-btn-action span, .call-btn-action i, .detail-call-button, .detail-call-button span, .detail-call-button i { color: #ffffff !important; }
          .badge-card-label, .queue-list-icon-btn, .group-list-btn { min-height: 42px !important; height: 42px !important; }
          .group-list-btn, .queue-list-icon-btn { width: 42px !important; border-radius: 14px !important; }
          .pill-row-tight { gap: 10px; align-items: center; }
          .detail-header-company, .detail-company-row { flex-wrap: wrap; align-items: center; }
          .detail-primary-line { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; }
          .detail-primary-phone { color: var(--text-muted) !important; font-weight: 700; }
          .detail-old-contact-inline { display: flex; flex-wrap: wrap; gap: 8px 16px; padding: 12px; margin-bottom: 16px; border-radius: 12px; background: rgba(15,23,42,.02); border: 1px dashed rgba(114,130,155,.35); font-size: .82rem; }
          .s-appointment, .s-interest, .s-callback { color: #fff !important; }
          .badge-new-ap { background: rgba(33,199,203,.14) !important; color: var(--primary) !important; border: 1px solid rgba(33,199,203,.4) !important; }
        `}</style>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
