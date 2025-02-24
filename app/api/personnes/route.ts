// /app/api/personnes/route.ts
import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

import { Personne } from '../../../app/interface/personne';

// Répond à un appel http://serveur/api/personnes qui permet de récupérer tous les personnes
export async function GET(/*request: Request*/) {
  console.log('côté serveur : Retourne toutes les personnes');
  try {
    // const dbPath = '/src/data/ma_base_sqlite3.db';
    const dbPath = path.join(process.cwd(), 'public', 'ma_base_sqlite3.db');

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
      });
    
    const data = await db.all<Personne[]>('SELECT * FROM personnes');
    return NextResponse.json(data);
  } catch (error) {
    console.log('Erreur API : ', error)
    return NextResponse.json({ error: 'Failed to fetch data 1' }, { status: 500 });
  }
}