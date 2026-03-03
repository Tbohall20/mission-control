'use client';

import React from 'react';

interface BriefingData {
  type: string;
  date: string;
  rawText: string;
  updatedAt: number;
}

interface Section {
  title: string;
  lines: string[];
  alertLevel: 'normal' | 'warning' | 'critical';
}

function highlightNumbers(text: string): React.ReactNode {
  const parts = text.split(/(\$[\d,]+(?:\.\d+)?[KMB]?|\d+(?:\.\d+)?%|[\d,]{4,}(?:\.\d+)?)/g);
  return parts.map((part, i) =>
    /(\$[\d,]+(?:\.\d+)?[KMB]?|\d+(?:\.\d+)?%|[\d,]{4,}(?:\.\d+)?)/.test(part)
      ? <span key={i} style={{ color: '#F59E0B', fontWeight: 700 }}>{part}</span>
      : part
  );
}

function detectAlertLevel(text: string): 'critical' | 'warning' | 'normal' {
  const t = text.toLowerCase();
  if (t.includes('critical') || t.includes('🚨') || t.includes('failed') || t.includes('down')) return 'critical';
  if (t.includes('warning') || t.includes('⚠️') || t.includes('flagged') || t.includes('blocked')) return 'warning';
  return 'normal';
}

function parseSections(raw: string): Section[] {
  const lines = raw.split('\n');
  const sections: Section[] = [];
  let current: Section | null = null;

  const SECTION_MARKERS = ['☀️', '🌙', '📊', '🎯', '🚨', '⚡', '💡', '📈', '📉', '🔴', '🟡', '🟢', '🏆', '💰', '📋', '🔍', '📡', '🤖', '⚠️', '🎰', '📣', '🧠'];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (current) current.lines.push('');
      continue;
    }

    const isHeader = SECTION_MARKERS.some(m => trimmed.startsWith(m)) ||
      /^#{1,3}\s/.test(trimmed) ||
      /^[A-Z][A-Z\s:]{5,}$/.test(trimmed);

    if (isHeader) {
      if (current) sections.push(current);
      const cleaned = trimmed.replace(/^#{1,3}\s*/, '').replace(/\*\*/g, '');
      current = {
        title: cleaned,
        lines: [],
        alertLevel: detectAlertLevel(cleaned),
      };
    } else {
      if (!current) {
        current = { title: 'Overview', lines: [], alertLevel: 'normal' };
      }
      const lineAlertLevel = detectAlertLevel(trimmed);
      if (lineAlertLevel !== 'normal') {
        current.alertLevel = lineAlertLevel;
      }
      current.lines.push(trimmed);
    }
  }

  if (current && (current.title !== 'Overview' || current.lines.length > 0)) {
    sections.push(current);
  }

  return sections.filter(s => s.title || s.lines.length > 0);
}

function getBorderColor(level: 'normal' | 'warning' | 'critical'): string {
  if (level === 'critical') return '#EF4444';
  if (level === 'warning') return '#F59E0B';
  return '#10B981';
}

function getTypeLabel(type: string): { label: string; icon: string; color: string } {
  if (type === 'evening') return { label: 'Evening Review', icon: '🌙', color: '#818CF8' };
  if (type === 'markets') return { label: 'Market Edges', icon: '📊', color: '#10B981' };
  return { label: 'Morning Briefing', icon: '☀️', color: '#F59E0B' };
}

export default function BriefingView({ data }: { data: BriefingData | null }) {
  if (!data) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={{ fontSize: 48 }}>📭</div>
          <h2 style={{ color: '#6B7280', marginTop: 16 }}>No briefing yet</h2>
          <p style={{ color: '#4B5563' }}>Axiom hasn&apos;t pushed a briefing for this slot.</p>
        </div>
      </div>
    );
  }

  const sections = parseSections(data.rawText);
  const typeInfo = getTypeLabel(data.type);
  const updated = new Date(data.updatedAt);
  const updatedStr = updated.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
    hour12: true,
  }) + ' EST';

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 32 }}>{typeInfo.icon}</span>
              <h1 style={{ ...styles.title, color: typeInfo.color }}>{typeInfo.label}</h1>
            </div>
            <div style={styles.meta}>
              <span style={styles.dateChip}>{data.date}</span>
              <span style={styles.updatedText}>Updated {updatedStr}</span>
            </div>
          </div>
          <div style={styles.axiomBadge}>⚡ AXIOM</div>
        </div>
      </div>

      {/* Sections */}
      <div style={styles.content}>
        {sections.map((section, i) => (
          <div key={i} style={{ ...styles.section, borderLeftColor: getBorderColor(section.alertLevel) }}>
            <div style={styles.sectionTitle}>{section.title}</div>
            <div style={styles.sectionBody}>
              {section.lines.filter(l => l !== '').map((line, j) => {
                const isBullet = line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ');
                const cleaned = isBullet ? line.slice(2) : line;
                const isBold = cleaned.startsWith('**') && cleaned.includes('**', 2);
                return (
                  <div key={j} style={isBullet ? styles.bullet : styles.line}>
                    {isBullet && <span style={styles.bulletDot}>›</span>}
                    <span style={isBold ? { fontWeight: 700 } : {}}>
                      {highlightNumbers(isBold ? cleaned.replace(/\*\*/g, '') : cleaned)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span>⚡ Axiom · Mission Control</span>
        <a href="https://mission-control-six-mocha.vercel.app" style={styles.footerLink}>
          mission-control-six-mocha.vercel.app
        </a>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#0A0A0A',
    color: '#E5E7EB',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '0 0 60px 0',
  },
  header: {
    background: 'linear-gradient(180deg, #111111 0%, #0A0A0A 100%)',
    borderBottom: '1px solid #1F2937',
    padding: '32px 24px 24px',
    maxWidth: 860,
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    margin: 0,
    letterSpacing: '-0.5px',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  dateChip: {
    background: '#1F2937',
    border: '1px solid #374151',
    borderRadius: 6,
    padding: '3px 10px',
    fontSize: 13,
    fontWeight: 600,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  updatedText: {
    fontSize: 13,
    color: '#6B7280',
  },
  axiomBadge: {
    background: '#1F2937',
    border: '1px solid #374151',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 12,
    fontWeight: 800,
    color: '#6B7280',
    letterSpacing: '2px',
  },
  content: {
    maxWidth: 860,
    margin: '0 auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  section: {
    background: '#111111',
    border: '1px solid #1F2937',
    borderLeft: '4px solid #10B981',
    borderRadius: '0 8px 8px 0',
    padding: '16px 20px',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#F9FAFB',
    marginBottom: 10,
    letterSpacing: '-0.2px',
  },
  sectionBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  bullet: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    fontSize: 14,
    lineHeight: 1.6,
    color: '#D1D5DB',
  },
  bulletDot: {
    color: '#6B7280',
    fontSize: 16,
    flexShrink: 0,
    marginTop: 1,
  },
  line: {
    fontSize: 14,
    lineHeight: 1.6,
    color: '#D1D5DB',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
  },
  footer: {
    maxWidth: 860,
    margin: '40px auto 0',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 12,
    color: '#4B5563',
    borderTop: '1px solid #1F2937',
    paddingTop: 16,
  },
  footerLink: {
    color: '#4B5563',
    textDecoration: 'none',
  },
};
