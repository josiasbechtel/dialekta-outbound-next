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
          .app { height: 100dvh !important; overflow: hidden !important; display: flex !important; flex-direction: column !important; }
          .main-content, main { flex: 1 1 auto !important; min-height: 0 !important; overflow-y: auto !important; padding-bottom: 18px !important; }
          .bottom-nav { position: sticky !important; bottom: 0 !important; z-index: 80 !important; flex-shrink: 0 !important; background: #ffffff !important; }
          .overlay { inset: 0 0 calc(78px + env(safe-area-inset-bottom)) 0; z-index: 30; }
          .sheet { max-height: 100%; border-radius: 28px 28px 0 0; }
          .header-action-row .compact-btn, .header-row + .sub-copy, .termin-block-context { display: none !important; }
          .company-text, .company-text i { color: #19aaaa !important; }
          .company-text { align-items: center; gap: 6px; flex-wrap: wrap; font-weight: 800; }
          .company-text-row { display: flex; align-items: center; justify-content: flex-start; gap: 6px 8px; flex-wrap: wrap; }
          .company-text-main { display: inline-flex; align-items: center; gap: 8px; min-width: 0; }
          .location-chip-soft, .result-meta.location-meta, .detail-location-chip.compact, .call-context-pill.call-location { display: inline-flex !important; align-items: center; gap: 4px; min-height: 22px; padding: 2px 8px; border-radius: 999px; background: rgba(33,199,203,.10) !important; color: #0d7383 !important; border: 1px solid rgba(33,199,203,.22) !important; font-size: .58rem !important; font-weight: 800 !important; letter-spacing: .02em; text-transform: uppercase; white-space: nowrap; opacity: .92; }
          .live-run-card .call-context-pill.call-location { background: rgba(255,255,255,.12) !important; color: #ffffff !important; border-color: rgba(255,255,255,.26) !important; opacity: .8; }
          .result-name-line { gap: 8px 14px; }
          .result-name, .detail-contact-name, .sheet-title, .big-number, .import-count, .list-info h3, .preview-lead-name { color: var(--text) !important; }
          .result-meta, .lead-card-links, .detail-primary-links a, .preview-lead-meta, .preview-lead-side, .sub-copy, .old-contact-inline, .detail-old-contact-inline { color: var(--text-muted) !important; }
          .lead-card-links { border-top: 1px solid var(--border); padding-top: 12px; }
          .old-contact-inline { display: flex; flex-wrap: wrap; gap: 8px 16px; padding-top: 10px; margin-top: 4px; border-top: 1px dashed rgba(114,130,155,.3); font-size: .8rem; }
          .old-contact-inline span, .detail-old-contact-inline span { display: inline-flex; align-items: center; gap: 7px; text-decoration: line-through; }
          .badge-card-label, .queue-list-icon-btn, .group-list-btn { min-height: 42px !important; height: 42px !important; }
          .group-list-btn, .queue-list-icon-btn { width: 42px !important; border-radius: 14px !important; padding: 0 !important; }
          .group-list-btn i, .queue-list-icon-btn i { font-size: 1.05rem !important; line-height: 1 !important; }
          .pill-row, .pill-row-tight { gap: 10px; align-items: center !important; }
          .list-info-tight { align-items: center !important; }
          .detail-header-company, .detail-company-row { flex-wrap: wrap; align-items: center; }
          .detail-primary-line { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; }
          .detail-primary-phone { color: var(--text-muted) !important; font-weight: 700; }
          .detail-old-contact-inline { display: flex; flex-wrap: wrap; gap: 8px 16px; padding: 12px; margin-bottom: 16px; border-radius: 12px; background: rgba(15,23,42,.02); border: 1px dashed rgba(114,130,155,.35); font-size: .82rem; }
          .appointment-time-highlight { display: inline-flex !important; align-items: center; gap: 8px; margin: 10px 0 0 !important; padding: 8px 12px !important; border-radius: 14px; background: rgba(33,199,203,.10) !important; border: 1px solid rgba(33,199,203,.22); color: #0d7383 !important; font-weight: 800 !important; }
          .appointment-links { margin-top: 12px !important; }
          .btn-primary, .btn-primary *, .call-btn-action, .call-btn-action *, .detail-call-button, .detail-call-button *, .backup-btn, .backup-btn *, .crm-backup-btn, .crm-backup-btn *, .export-btn, .export-btn *, .dark-action, .dark-action * { color: #ffffff !important; }
          .btn-primary i, .btn-primary span, .btn-primary svg, .call-btn-action i, .call-btn-action span, .backup-btn i, .backup-btn span { color: #ffffff !important; fill: #ffffff !important; }
          .s-appointment, .s-appointment *, .s-interest, .s-interest *, .s-callback, .s-callback * { color: #ffffff !important; }
          .badge-new-ap { background: rgba(33,199,203,.14) !important; color: var(--primary) !important; border: 1px solid rgba(33,199,203,.4) !important; }
          .list-item .btn-primary, .list-item .btn-primary *, .card .btn-primary, .card .btn-primary * { color: #ffffff !important; }
          [class*="primary"], [class*="primary"] *, [class*="backup"], [class*="backup"] * { color: inherit; }
          .btn-primary, .call-btn-action, .backup-button, .backup-button *, .btn-primary span, .btn-primary i { color: #ffffff !important; }
        `}</style>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
