/*
  # Suppression de la colonne description des qualifications

  1. Changements
    - Suppression de la colonne `description` de la table `qualifications`
*/

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'qualifications' AND column_name = 'description'
  ) THEN
    ALTER TABLE qualifications DROP COLUMN description;
  END IF;
END $$;