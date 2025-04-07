import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useAgences } from '../../hooks/useAgences';
import type { Agence } from '../../types';

interface AgencyManagerProps {
  onClose: () => void;
}

export default function AgencyManager({ onClose }: AgencyManagerProps) {
  const [nom, setNom] = useState('');
  const [code, setCode] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAgency, setEditingAgency] = useState<Agence | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; agency: Agence | null }>({
    show: false,
    agency: null
  });
  const { agences, createAgence, updateAgence, deleteAgence } = useAgences();

  const filteredAndSortedAgencies = useMemo(() => {
    return [...agences]
      .filter(agency => {
        const search = searchTerm.toLowerCase();
        return (
          agency.nom.toLowerCase().includes(search) ||
          agency.code.toLowerCase().includes(search) ||
          agency.email.toLowerCase().includes(search)
        );
      })
      .sort((a, b) => a.nom.localeCompare(b.nom));
  }, [agences, searchTerm]);

  const validateCode = (code: string) => {
    const codeRegex = /^[A-Z]{3}[0-9]$/;
    return codeRegex.test(code);
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
    if (numbers.length <= 6) return `${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 6)} ${numbers.slice(6)}`;
    return `${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 6)} ${numbers.slice(6, 8)} ${numbers.slice(8, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    if (formattedPhone.length <= 14) { // "XX XX XX XX XX" = 14 characters
      setTelephone(formattedPhone);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();
    if (value.length <= 4) {
      setCode(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nom.trim() || !code.trim()) {
      setError('Le nom et le code sont requis');
      return;
    }

    if (!validateCode(code)) {
      setError('Format de code invalide');
      return;
    }

    try {
      if (editingAgency) {
        const existingAgency = agences.find(
          agency => agency.id !== editingAgency.id && 
          agency.code.toLowerCase() === code.trim().toLowerCase()
        );

        if (existingAgency) {
          setError('Ce code d\'agence existe déjà');
          return;
        }

        await updateAgence(editingAgency.id, {
          nom: nom.trim().toUpperCase(),
          code: code.toUpperCase(),
          telephone,
          email: email.toLowerCase(),
        });
      } else {
        const existingAgency = agences.find(
          agency => agency.code.toLowerCase() === code.trim().toLowerCase()
        );

        if (existingAgency) {
          setError('Ce code d\'agence existe déjà');
          return;
        }

        await createAgence({ 
          nom: nom.trim().toUpperCase(),
          code: code.toUpperCase(),
          telephone,
          email: email.toLowerCase(),
        });
      }

      handleClearForm();
    } catch (err: any) {
      console.error('Error saving agency:', err);
      setError('Une erreur est survenue lors de la sauvegarde de l\'agence');
    }
  };

  const handleClearForm = () => {
    setNom('');
    setCode('');
    setTelephone('');
    setEmail('');
    setEditingAgency(null);
    setError(null);
  };

  const startEditing = (agency: Agence) => {
    setEditingAgency(agency);
    setNom(agency.nom);
    setCode(agency.code);
    setTelephone(agency.telephone || '');
    setEmail(agency.email || '');
    setError(null);
  };

  const handleDeleteClick = (agency: Agence) => {
    setDeleteConfirmation({ show: true, agency });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmation.agency) {
      try {
        await deleteAgence(deleteConfirmation.agency.id);
        setDeleteConfirmation({ show: false, agency: null });
      } catch (err) {
        setError('Une erreur est survenue lors de la suppression de l\'agence');
      }
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

        <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl">
          <div className="px-8 py-6 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#3c3c3c]">Gestion des Agences</h2>
              <button
                onClick={onClose}
                className="text-[#afafaf] hover:text-[#3c3c3c] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-100 rounded-lg">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="nom" className="block text-sm font-bold text-[#3c3c3c] mb-2">
                      Nom de l'agence
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
                    <label htmlFor="code" className="block text-sm font-bold text-[#3c3c3c] mb-2">
                      Code
                    </label>
                    <input
                      type="text"
                      id="code"
                      value={code}
                      onChange={handleCodeChange}
                      maxLength={4}
                      placeholder="Code"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent uppercase ${
                        code && !validateCode(code) ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="telephone" className="block text-sm font-bold text-[#3c3c3c] mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="telephone"
                      value={telephone}
                      onChange={handlePhoneChange}
                      placeholder="01 23 45 67 89"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-[#3c3c3c] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.toLowerCase())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
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
                      {editingAgency ? 'Enregistrer les modifications' : 'Ajouter l\'agence'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="col-span-8">
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher une agence..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-[#3c3c3c] uppercase tracking-wider">
                          Nom
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-[#3c3c3c] uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-[#3c3c3c] uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-[#3c3c3c] uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAndSortedAgencies.map((agency) => (
                        <tr key={agency.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-[#3c3c3c]">
                            <span className="uppercase">{agency.nom}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#3c3c3c]">
                            <span className="uppercase">{agency.code}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#3c3c3c]">
                            <div className="text-gray-500">{agency.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                            <button
                              onClick={() => startEditing(agency)}
                              className="text-[#1cb0f6] hover:text-[#0095e2] transition-colors"
                            >
                              <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(agency)}
                              className="text-[#ff4b4b] hover:text-[#e63e3e] transition-colors"
                            >
                              <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Boîte de dialogue de confirmation de suppression */}
              {deleteConfirmation.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="fixed inset-0 bg-black bg-opacity-50"></div>
                  <div className="relative bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Confirmer la suppression
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Êtes-vous sûr de vouloir supprimer l'agence {deleteConfirmation.agency?.nom} ?
                      Cette action est irréversible.
                    </p>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setDeleteConfirmation({ show: false, agency: null })}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleConfirmDelete}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}