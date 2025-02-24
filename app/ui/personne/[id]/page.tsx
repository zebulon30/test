"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Personne } from '../../../interface/personne'; // Correct relative path
import { Card, CardHeader, CardContent, /* Input, */ TextField, Button /*, FormControl, FormLabel, InputLabel */ } from '@mui/material';

// Fonction d'appel de l'api permettant de récupérer une seule personne par son id
async function getPersonne(id: string) {
  const res = await fetch(`/api/personnes/${id}`, { method: 'GET' });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP error ${res.status}: ${errorText || res.statusText}`);
  }
  return res.json();
}

export default function ModifierPersonnePage(/*{ params }: { params: { id: string } }*/) {
  const params = useParams<{ id: string }>()

  const router = useRouter();
  const [personne, setPersonne] = useState<Personne | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { // la récupération les datas se fait lors du premier rendu ou lorsque 'params' change.
    if ( params.id ) {
      async function fetchPersonne() {
        try {
          setIsLoading(true);
          const dataPersonne = await getPersonne(params.id);
          setPersonne(dataPersonne);
          setIsLoading(false);
        } catch (err) {
          setError("Error fetching data: " + err);
          setIsLoading(false);
        }
      }
      fetchPersonne();
    }
  }, [params]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!personne) return;
    setPersonne({
      ...personne,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!personne) return;
    try {
      const res = await fetch(`/api/personnes/${personne.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personne),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      // Redirect or update state as needed after successful update
      router.push('/');
    } catch (error) {
      console.error('Error updating personne:', error);
      setError("Error updating data: " + error); // Update error state
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!personne) return <div>Personne not found.</div>;

  return (
    <Card>
      <CardHeader title={`Modifier Personne ${personne.id}`} />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <TextField label="Nom" name="nom" value={personne.nom} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Prenom" name="prenom" value={personne.prenom} onChange={handleChange} fullWidth margin="normal" />
          <TextField
              label="Date de naissance"
              type="date"
              name="date_naissance"
              value={personne.date_naissance.toString().split('T')[0]}
              onChange={handleChange}
              fullWidth
              margin="normal"
          />
          <TextField label="Ville de naissance" name="ville_naissance" value={personne.ville_naissance} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Adresse" name="adresse" value={personne.adresse} onChange={handleChange} fullWidth margin="normal" />
          
          <TextField label="Code postal" name="code_postal" value={personne.code_postal} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Ville" name="ville" value={personne.ville} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Téléphone" name="telephone" value={personne.telephone} onChange={handleChange} fullWidth margin="normal" />
          
          {/* ... other input fields for Personne properties */}
          <Button type="submit" variant="contained" color="primary">
                        Enregistrer
                    </Button>
        </form>
      </CardContent>
    </Card>
  );
}
