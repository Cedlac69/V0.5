/*
  # Ajout du champ acronyme à la table des qualifications

  1. Modifications
    - Ajout de la colonne `acronyme` à la table `qualifications`
    
  2. Sécurité
    - Maintien des politiques de sécurité existantes
*/

-- Ajout de la colonne acronyme
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'qualifications' AND column_name = 'acronyme'
  ) THEN
    ALTER TABLE qualifications ADD COLUMN acronyme text;
  END IF;
END $$;