import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useInterimaires } from '../../hooks/useInterimaires';
import { useQualifications } from '../../hooks/useQualifications';
import { useAgences } from '../../hooks/useAgences';
import type { Interim } from '../../types';

interface InterimManagerProps {
  onClose: () => void;
  interim?: Interim | null;
}

export default function InterimManager({ onClose, interim }: InterimManagerProps) {
  const [nom, setNom] = useState(interim?.nom || '');
  const [prenom, setPrenom] = useState(interim?.prenom || '');
  const [adresse, setAdresse] = useState(interim?.adresse || '');
  const [qualification_id, setQualificationId] = useState(interim?.qualification_id || '');
  const [agence_id, setAgenceId] = useState(interim?.agence_id || '');
  const [vehicule, setVehicule] = useState(interim?.vehicule || false);
  const [error, setError] = useState<string | null>(null);

  const { createInterimaire, updateInterimaire, refresh: refreshInterims } = useInterimaires();
  const { qualifications } = useQualifications();
  const { agences } = useAgences();

  const getErrorMessage = (err: any): string => {
    // Log the full error object for debugging
    console.error('Full error object:', err);

    // Check for Supabase specific error codes
    if (err?.code === '23505') {
      return 'Un intérimaire avec ces informations existe déjà.';
    }

    if (err?.code === '23503') {
      return 'La qualification ou l\'agence sélectionnée n\'existe pas.';
    }

    // Check various error message locations
    const message = 
      err?.message || 
      err?.error?.message ||
      err?.data?.message ||
      (err?.statusText ? `Erreur serveur: ${err.statusText}` : null) ||
      (typeof err === 'object' ? JSON.stringify(err) : String(err));

    // If we have a message that's not just "Error", use it
    if (message && message !== 'Error') {
      return message;
    }

    // Default error message
    return 'Une erreur est survenue lors de la sauvegarde. Veuillez réessayer plus tard.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Client-side validation
      if (!nom.trim() || !prenom.trim() || !qualification_id || !agence_id) {
        setError('Tous les champs marqués * sont requis');
        return;
      }

      const interimData = {
        nom: nom.trim().toUpperCase(),
        prenom: prenom.trim(),
        adresse,
        qualification_id,
        agence_id,
        vehicule,
      };

      if (interim) {
        await updateInterimaire(interim.id, interimData);
      } else {
        await createInterimaire({
          ...interimData,
          disponibilite: 'Disponible',
        });
      }

      await refreshInterims();
      handleClearForm();
      onClose();
    } catch (err: any) {
      setError(getErrorMessage(err));
    }
  };

  const handleClearForm = () => {
    setNom('');
    setPrenom('');
    setAdresse('');
    setQualificationId('');
    setAgenceId('');
    setVehicule(false);
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>

        <div className="inline-block w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl">
          <div className="px-8 py-6 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#3c3c3c]">
                {interim ? "Modifier l'intérimaire" : "Ajouter un intérimaire"}
              </h2>
              <button
                onClick={onClose}
                className="text-[#afafaf] hover:text-[#3c3c3c] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="nom" className="block text-sm font-bold text-[#3c3c3c] mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent uppercase"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="prenom" className="block text-sm font-bold text-[#3c3c3c] mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="adresse" className="block text-sm font-bold text-[#3c3c3c] mb-2">
                  Adresse
                </label>
                <textarea
                  id="adresse"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="qualification" className="block text-sm font-bold text-[#3c3c3c] mb-2">
                  Qualification *
                </label>
                <select
                  id="qualification"
                  value={qualification_id}
                  onChange={(e) => setQualificationId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner une qualification</option>
                  {qualifications.map((qualification) => (
                    <option key={qualification.id} value={qualification.id}>
                      {qualification.nom} ({qualification.acronyme})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="agence" className="block text-sm font-bold text-[#3c3c3c] mb-2">
                  Agence *
                </label>
                <select
                  id="agence"
                  value={agence_id}
                  onChange={(e) => setAgenceId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner une agence</option>
                  {agences.map((agence) => (
                    <option key={agence.id} value={agence.id}>
                      {agence.nom} ({agence.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="vehicule"
                  checked={vehicule}
                  onChange={(e) => setVehicule(e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="vehicule" className="ml-2 block text-sm font-bold text-[#3c3c3c]">
                  Véhiculé
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="flex-1 px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 text-white bg-teal-500 rounded-md hover:bg-teal-600 transition-colors"
                >
                  {interim ? "Modifier l'intérimaire" : "Ajouter l'intérimaire"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}