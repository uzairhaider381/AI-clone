import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Simple file-based database for AI Clone
const DB_PATH = path.join(process.cwd(), 'src/lib/database.json');

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [
        { id: '1', name: 'Admin User', email: 'admin@aiclone.com', password: 'admin1234', role: 'admin' },
        { id: '2', name: 'Uzair Haider', email: 'uzair@aiclone.com', password: 'user1234', role: 'user' }
      ]
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = readDB();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();
    const data = readDB();

    if (action === 'addUser') {
      data.users.push(payload);
    } else if (action === 'updateUser') {
      data.users = data.users.map((u: any) => u.id === payload.id ? { ...u, ...payload.updates } : u);
    } else if (action === 'deleteUser') {
      data.users = data.users.filter((u: any) => u.id !== payload.id);
    }

    writeDB(data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
  }
}
