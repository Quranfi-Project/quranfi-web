import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'src/data/roadmap.json');

function readItems() {
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

function writeItems(items: unknown[]) {
  writeFileSync(DATA_FILE, JSON.stringify(items, null, 2) + '\n', 'utf-8');
}

function isAuthorized(req: NextRequest): boolean {
  const pw = req.headers.get('x-admin-password');
  return !!pw && pw === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  return NextResponse.json(readItems());
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const items = readItems();
  const maxId = items.reduce((m: number, i: { id: number }) => Math.max(m, i.id), 0);
  const newItem = { ...body, id: maxId + 1 };
  items.push(newItem);
  writeItems(items);
  return NextResponse.json(newItem, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const items = readItems();
  const idx = items.findIndex((i: { id: number }) => i.id === body.id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  items[idx] = { ...items[idx], ...body };
  writeItems(items);
  return NextResponse.json(items[idx]);
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await req.json();
  const items = readItems();
  const filtered = items.filter((i: { id: number }) => i.id !== id);
  if (filtered.length === items.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  writeItems(filtered);
  return NextResponse.json({ ok: true });
}
