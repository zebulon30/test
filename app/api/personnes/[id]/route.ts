// /app/api/personnes[id]/route.ts
//
// Les fonctions PUT, GET, POST, ... avec juste l'id en paramètre.
import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

import { Personne } from '../../../interface/personne';

// Retourne une Personne (on passe l'id en paramêtre)
// export async function GET( request: NextRequest, {params,}: {params: Promise<{ id: string }>} ) {
export async function GET( request: NextRequest ) {
  // const id = (await params).id;
  const body = await request.json();
  const { id } = body;
  try {
    const dbPath = path.join(process.cwd(), 'public', 'ma_base_sqlite3.db');
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
      });
    const data = await db.get<Personne>('SELECT * FROM personnes WHERE id = ?', parseInt(id, 10) );
    if (!data) {
      return NextResponse.json({ error: 'Personne not found' }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.log('Erreur API : ', error)
    return NextResponse.json({ error: 'Failed to fetch data 2 because id=' + id }, { status: 500 });
  }
}

// Mettre à jour une personne
export async function PUT(request: NextRequest) {
  // const id  = (await params).id;
  const body = await request.json();
  const { id } = body;
  console.log("Update de l'id : "+id+"");
  try {
    const dbPath = path.join(process.cwd(), 'public', 'ma_base_sqlite3.db');

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    const { nom, prenom, date_naissance, ville_naissance, adresse, code_postal, ville, telephone } = body;

    await db.run(
      'UPDATE personnes SET nom = ?, prenom = ?, date_naissance = ?, ville_naissance = ?, adresse = ?, code_postal = ?, ville = ?, telephone = ? WHERE id = ?',
      nom, prenom, date_naissance, ville_naissance, adresse, code_postal, ville, telephone, parseInt(id, 10)
    );

    const updatedData = await db.get<Personne>('SELECT * FROM personnes WHERE id = ?', parseInt(id, 10));

    return NextResponse.json(updatedData, { status: 200 });
  } catch (error) {
    console.error("Update error: ", error);
    return NextResponse.json({ error: "Update failed on record with id "+id }, { status: 500});
  }
}