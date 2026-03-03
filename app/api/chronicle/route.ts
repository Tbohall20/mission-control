import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const chroniclePath = join(process.cwd(), 'CHRONICLE.md');
    const content = readFileSync(chroniclePath, 'utf-8');
    
    // Filter to last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const lines = content.split('\n');
    const filtered = lines.filter(line => {
      const match = line.match(/\[(\d{4}-\d{2}-\d{2})/);
      if (!match) return true; // keep headers/non-dated lines
      const lineDate = new Date(match[1]);
      return lineDate >= sevenDaysAgo;
    });
    
    return new NextResponse(filtered.join('\n'), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read CHRONICLE.md' }, { status: 500 });
  }
}
