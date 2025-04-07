/*
  # Ajout du champ véhiculé pour les intérimaires

  1. Modifications
    - Ajout de la colonne `vehicule` à la table `interimaires`
    - La colonne est de type boolean avec une valeur par défaut à false
    
  2. Sécurité
    - Maintien des politiques de sécurité existantes
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'interimaires' AND column_name = 'vehicule'
  ) THEN
    ALTER TABLE interimaires ADD COLUMN vehicule boolean DEFAULT false;
  END IF;
END $$;