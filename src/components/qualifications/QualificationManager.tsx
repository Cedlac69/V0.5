import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useQualifications } from '../../hooks/useQualifications';
import type { Qualification } from '../../types';

interface QualificationManagerProps {
  onClose: () => void;
}

export default function QualificationManager({ onClose }: QualificationManagerProps) {
  const [qualification, setQualification] = useState('');
  const [acronym, setAcronym] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingQualification, setEditingQualification] = useState<Qualification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { qualifications, createQualification, updateQualification, deleteQualification } = useQualifications();

  const filteredAndSortedQualifications = useMemo(() => {
    return [...qualifications]
      .filter(qual => {
        const search = searchTerm.toLowerCase();
        return (
          qual.nom.toLowerCase().includes(search) ||
          qual.acronyme.toLowerCase().includes(search)
        );
      })
      .sort((a, b) => a.nom.localeCompare(b.nom));
  }, [qualifications, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!qualification.trim() || !acronym.trim()) {
      setError('La qualification et l\'acronyme sont requis');
      return;
    }

    try {
      if (editingQualification) {
        const existingQualification = qualifications.find(
          qual => qual.id !== editingQualification.id && 
          qual.nom.toLowerCase() === qualification.trim().toLowerCase()
        );
        const existingAcronym = qualifications.find(
          qual => qual.id !== editingQualification.id && 
          qual.acronyme.toLowerCase() === acronym.trim().toLowerCase()
        );

        if (existingQualification) {
          setError('Cette qualification existe déjà');
          return;
        }

        if (existingAcronym) {
          setError('Cet acronyme existe déjà');
          return;
        }

        await updateQualification(editingQualification.id, {
          nom: qualification.toUpperCase(),
          acronyme: acronym.toUpperCase(),
        });
      } else {
        const existingQualification = qualifications.find(
          qual => qual.nom.toLowerCase() === qualification.trim().toLowerCase()
        );
        const existingAcronym = qualifications.find(
          qual => qual.acronyme.toLowerCase() === acronym.trim().toLowerCase()
        );

        if (existingQualification) {
          setError('Cette qualification existe déjà');
          return;
        }

        if (existingAcronym) {
          setError('Cet acronyme existe déjà');
          return;
        }

        await createQualification({ 
          nom: qualification.toUpperCase(), 
          acronyme: acronym.toUpperCase() 
        });
      }

      handleClearForm();
    } catch (err: any) {
      console.error('Error saving qualification:', err);
      setError('Une erreur est survenue lors de la sauvegarde de la qualification');
    }
  };

  const handleClearForm = () => {
    setQualification('');
    setAcronym('');
    setEditingQualification(null);
    setError(null);
  };

  const startEditing = (qual: Qualification) => {
    setEditingQualification(qual);
    setQualification(qual.nom);
    setAcronym(qual.acronyme);
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

        <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl">
          <div className="px-8 py-6 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#3c3c3c]">Gestion des Qualifs</h2>
              <button
                onClick={onClose}
                className="text-[#afafaf] hover:text-[#3c3c3c] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-100 rounded-lg">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="qualification" className="block text-sm font-bold text-[#3c3c3c] mb-2">
                      Qualif
                    </label>
                    <input
                      type="text"
                      id="qualification"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent uppercase"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="acronym" className="block text-sm font-bold text-[#3c3c3c] mb-2">
                      Acronyme
                    </label>
                    <input
                      type="text"
                      id="acronym"
                      value={acronym}
                      onChange={(e) => setAcronym(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent uppercase"
                      required
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
                      {editingQualification ? 'Enregistrer les modifications' : 'Ajouter la Qualif'}
                    </button>
                  </div>
                </form>
              </div>

              <div>
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher une qualif..."
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
                          Qualif
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-[#3c3c3c] uppercase tracking-wider">
                          Acronyme
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-[#3c3c3c] uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAndSortedQualifications.map((qual) => (
                        <tr key={qual.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-[#3c3c3c]">
                            <span className="uppercase">{qual.nom}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#3c3c3c]">
                            <span className="uppercase">{qual.acronyme}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                            <button
                              onClick={() => startEditing(qual)}
                              className="text-[#1cb0f6] hover:text-[#0095e2] transition-colors"
                            >
                              <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteQualification(qual.id)}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}