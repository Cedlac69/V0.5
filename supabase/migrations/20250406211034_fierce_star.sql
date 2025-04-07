/*
  # Add address fields to clients table

  1. Changes
    - Rename `nom_etablissement` to `nom_etablissement` (for consistency)
    - Add address fields: `adresse`, `code_postal`, `ville`
    
  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN
  -- Rename column if it exists with the old name
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'nometablissement'
  ) THEN
    ALTER TABLE clients RENAME COLUMN nomEtablissement TO nom_etablissement;
  END IF;

  -- Add address fields if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'adresse'
  ) THEN
    ALTER TABLE clients ADD COLUMN adresse text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'code_postal'
  ) THEN
    ALTER TABLE clients ADD COLUMN code_postal text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'ville'
  ) THEN
    ALTER TABLE clients ADD COLUMN ville text;
  END IF;
END $$;