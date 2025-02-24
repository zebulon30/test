"use client";

import { useState } from 'react';
import { Personne } from './interface/personne';
import { useRouter } from 'next/navigation';

// import Modal from './components/Modal';


// Lecture de toutes les Personne
async function fetchData (){
  try {
    // Appel l'api qui se trouve dans /src/app/api/personne/route.ts
    const res = await fetch('/api/personnes', { method: 'GET' });
    if (!res.ok) {
      const errorText = await res.text(); // Get error message from the server, if any
      throw new Error(`HTTP error ${res.status}: ${errorText || res.statusText}`); // Throw error with details
    }
    const jsonData = res.json();
    return jsonData;
  } catch (error) {
    console.error('Erreur fetchData : ', error);
    alert("Error fetching data: "+error);
    return [];
  }
}

export default function Home() {
  const [data, setData] = useState<Personne[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetchData = async () => {
    setLoading(true);
    const response = await fetchData();
    setData(response);
    setLoading(false);
  }

  const router = useRouter();

  const handleClickModifierPersonne= (item: Personne) => {
    router.push(`/ui/personne/${item.id}`);
  }

  const handleClickSupprimerPersonne = (item: Personne) => {
    router.push('/ui/personne/supprimer/'+item.id);
  }

  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {/*  <Modal />  */}
        Cliquez sur le bouton pour charger les données.
        <button onClick={handleFetchData} disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-0 px-4 rounded">
          {loading ? 'Loading...' : 'Fetch Data'}
        </button>

        {data && data.length > 0 && (
          <div className=""> 
            <table className="table-auto mt-8">
              <thead className="stick-to-top">
                <tr>
                  <th className="px-4 py-2">Nom</th>
                  <th className="px-4 py-2">Prénom</th>
                  <th className="px-4 py-2">Date de naissance</th>
                  <th className="px-4 py-2">Ville naissance</th>
                  <th className="px-4 py-2">Adresse</th>
                  <th className="px-4 py-2">Code postal</th>
                  <th className="px-4 py-2">Ville</th>
                  <th className="px-4 py-2">Téléphone</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                    <td className="border px-4 py-2">{item.nom}</td>
                    <td className="border px-4 py-2">{item.prenom}</td>
                    <td className="border px-4 py-2">{item.date_naissance}</td>
                    <td className="border px-4 py-2">{item.ville_naissance}</td>
                    <td className="border px-4 py-2">{item.adresse}</td>
                    <td className="border px-4 py-2">{item.code_postal}</td>
                    <td className="border px-4 py-2">{item.ville}</td>
                    <td className="border px-4 py-2">{item.telephone}</td>
                    <td className="border px-4 py-2">
                      <button onClick={() => handleClickModifierPersonne(item)} key={item.id} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-1 rounded">
                        Modifier</button>
                        <button onClick={() => handleClickSupprimerPersonne(item)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded ml-2">
                        Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
  );
}