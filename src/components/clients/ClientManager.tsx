import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import { useAgences } from '../../hooks/useAgences';
import type { Client } from '../../types';

interface ClientManagerProps {
  onClose: () => void;
  client?: Client | null;
}

export default function ClientManager({ onClose, client }: ClientManagerProps) {
  const [nom_etablissement, setNomEtablissement] = useState(client?.nom_etablissement || '');
  const [service, setService] = useState(client?.service || '');
  const [adresse, setAdresse] = useState(client?.adresse || '');
  const [code_postal, setCodePostal] = useState(client?.code_postal || '');
  const [ville, setVille] = useState(client?.ville || '');
  const [agence_id, setAgenceId] = useState(client?.agence_id || '');
  const [error, setError] = useState<string | null>(null);

  const { createClient, updateClient, refresh: refreshClients } = useClients();
  const { agences } = useAgences();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!nom_etablissement.trim() || !agence_id) {
        setError('Le nom de l\'établissement et l\'agence sont requis');
        return;
      }

      const clientData = {
        nom_etablissement: nom_etablissement.trim().toUpperCase(),
        service: service.trim(),
        adresse: adresse.trim(),
        code_postal: code_postal.trim(),
        ville: ville.trim().toUpperCase(),
        agence_id,
      };

      if (client) {
        await updateClient(client.id, clientData);
      } else {
        await createClient(clientData);
      }

      await refreshClients();
      onClose();
    } catch (err: any) {
      console.error('Error saving client:', err);
      setError('Une erreur est survenue lors de la sauvegarde');
    }
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
                {client ? "Modifier le client" : "Ajouter un client"}
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
                <label htmlFor="nomEtablissement" className="block text-sm font-bold text-[#3c3c3c] mb-2">
                  Nom de l'établissement *
                </label>
                <input
                  type="text"
                  id="nomEtablissement"
                  value={nom_etablissement}
                  onChange={(e) => setNomEtablissement(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent uppercase"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="adresse" className="block text-sm font-bold text-[#3c3c3c] mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  id="adresse"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="code_postal" className="block text-sm font-bold text-[#3c3c3c] mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    id="code_postal"
                    value={code_postal}
                    onChange={(e) => setCodePostal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="ville" className="block text-sm font-bold text-[#3c3c3c] mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    id="ville"
                    value={ville}
                    onChange={(e) => setVille(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent uppercase"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-bold text-[#3c3c3c] mb-2">
                  Service
                </label>
                <input
                  type="text"
                  id="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
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

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 text-white bg-teal-500 rounded-md hover:bg-teal-600 transition-colors"
                >
                  {client ? "Modifier le client" : "Ajouter le client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}