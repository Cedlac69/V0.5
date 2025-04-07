export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  agenceId: string;
  dateCreation: Date;
}

export interface Interim {
  id: string;
  nom: string;
  prenom: string;
  adresse: string;
  qualification_id: string;
  agence_id: string;
  vehicule: boolean;
  dateCreation: Date;
  disponibilite: 'Disponible' | 'Occupé' | 'En poste';
}

export interface Client {
  id: string;
  nom_etablissement: string;
  service: string;
  adresse: string;
  code_postal: string;
  ville: string;
  agence_id: string;
  dateCreation: Date;
}

export interface Commande {
  id: string;
  client_id: string;
  qualification_id: string;
  dates: Date[];
  status: 'en attente' | 'servie' | 'annulée client' | 'annulée intérimaire';
  motifAnnulation?: string;
  agence_id: string;
  dateCreation: Date;
}

export interface Agence {
  id: string;
  nom: string;
  code: string;
  telephone: string;
  email: string;
  dateCreation: Date;
}

export interface Qualification {
  id: string;
  nom: string;
  acronyme: string;
  created_at: string; // Changed from dateCreation: Date to match Supabase's column name
}