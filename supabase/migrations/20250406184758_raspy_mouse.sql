/*
  # Schéma initial pour ArchiFlow

  1. Tables
    - `qualifications` : Liste des qualifications possibles pour les intérimaires
    - `agences` : Agences d'intérim
    - `users` : Utilisateurs de l'application
    - `interimaires` : Intérimaires disponibles pour les missions
    - `clients` : Clients qui passent des commandes
    - `commandes` : Commandes passées par les clients

  2. Sécurité
    - RLS activé sur toutes les tables
    - Politiques de sécurité pour chaque table
*/

-- Création de la table des qualifications
CREATE TABLE IF NOT EXISTS qualifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE qualifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualifications visibles par tous les utilisateurs authentifiés"
  ON qualifications
  FOR SELECT
  TO authenticated
  USING (true);

-- Création de la table des agences
CREATE TABLE IF NOT EXISTS agences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  code text UNIQUE NOT NULL,
  telephone text,
  email text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE agences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agences visibles par tous les utilisateurs authentifiés"
  ON agences
  FOR SELECT
  TO authenticated
  USING (true);

-- Création de la table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  email text UNIQUE NOT NULL,
  telephone text,
  agence_id uuid REFERENCES agences(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Création de la table des intérimaires
CREATE TABLE IF NOT EXISTS interimaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  adresse text,
  qualification_id uuid REFERENCES qualifications(id),
  agence_id uuid REFERENCES agences(id),
  disponibilite text CHECK (disponibilite IN ('Disponible', 'Occupé', 'En poste')) DEFAULT 'Disponible',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE interimaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Intérimaires visibles par tous les utilisateurs authentifiés"
  ON interimaires
  FOR SELECT
  TO authenticated
  USING (true);

-- Création de la table des clients
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_etablissement text NOT NULL,
  service text,
  agence_id uuid REFERENCES agences(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients visibles par leur agence"
  ON clients
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.agence_id = clients.agence_id
    )
  );

-- Création de la table des commandes
CREATE TABLE IF NOT EXISTS commandes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id),
  qualification_id uuid REFERENCES qualifications(id),
  dates jsonb NOT NULL DEFAULT '[]',
  status text CHECK (status IN ('en attente', 'servie', 'annulée client', 'annulée intérimaire')) DEFAULT 'en attente',
  motif_annulation text,
  agence_id uuid REFERENCES agences(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Commandes visibles par leur agence"
  ON commandes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.agence_id = commandes.agence_id
    )
  );