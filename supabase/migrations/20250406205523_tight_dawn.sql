/*
  # Suppression de la colonne disponibilite de la table interimaires

  1. Changements
    - Suppression de la colonne `disponibilite` de la table `interimaires`
    - La disponibilité sera désormais déduite des commandes en cours
*/

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'interimaires' AND column_name = 'disponibilite'
  ) THEN
    ALTER TABLE interimaires DROP COLUMN disponibilite;
  END IF;
END $$;