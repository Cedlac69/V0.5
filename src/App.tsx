import React from 'react';
import { useState, useRef, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import { Users, Building2, ClipboardList, UserCheck, Search, Plus, Pencil, Trash2, Car, AlertCircle } from 'lucide-react';
import StatCard from './components/dashboard/StatCard';
import ContentLayout from './components/layout/ContentLayout';
import { useInterimaires } from './hooks/useInterimaires';
import { useQualifications } from './hooks/useQualifications';
import { useCommandes } from './hooks/useCommandes';
import { useAgences } from './hooks/useAgences';
import { useClients } from './hooks/useClients';
import InterimManager from './components/interims/InterimManager';
import CommandeManager from './components/commandes/CommandeManager';
import ClientManager from './components/clients/ClientManager';
import { useCallback } from 'react';
import type { Interim, Client } from './types';

function App() {
  const [activeView, setActiveView] = useState<'commandes' | 'interimaires' | 'clients'>('commandes');
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const [showInterimModal, setShowInterimModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; interim: Interim | null }>({
    show: false,
    interim: null
  });
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingInterim, setEditingInterim] = useState<Interim | null>(null);
  const [showCommandeModal, setShowCommandeModal] = useState(false);
  const { interimaires, refresh: refreshInterims, deleteInterimaire } = useInterimaires();
  const { qualifications } = useQualifications();
  const { agences } = useAgences();
  const { commandes } = useCommandes();
  const { clients, refresh: refreshClients } = useClients();

  const handleDeleteClick = (interim: Interim) => {
    // Vérifier si l'intérimaire est sur une commande
    const isAssigned = commandes.some(commande => 
      commande.interim_id === interim.id && 
      ['en attente', 'servie'].includes(commande.status)
    );

    if (isAssigned) {
      alert("Impossible de supprimer cet intérimaire car il est positionné sur une commande en cours.");
      return;
    }

    setDeleteConfirmation({ show: true, interim });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmation.interim) {
      try {
        await deleteInterimaire(deleteConfirmation.interim.id);
        setDeleteConfirmation({ show: false, interim: null });
        refreshInterims();
      } catch (err) {
        console.error('Error deleting interim:', err);
        alert('Une erreur est survenue lors de la suppression');
      }
    }
  };

  const handleInterimModalClose = useCallback(() => {
    setShowInterimModal(false);
    setEditingInterim(null);
    refreshInterims();
  }, [refreshInterims]);

  const handleClientModalClose = useCallback(() => {
    setShowClientModal(false);
    setEditingClient(null);
    refreshClients();
  }, [refreshClients]);

  const getQualificationName = (id: string) => {
    const qualification = qualifications.find(q => q.id === id);
    return qualification ? qualification.nom : '';
  };

  const getAgenceName = (id: string) => {
    const agence = agences.find(a => a.id === id);
    return agence ? agence.nom : '';
  };

  const filteredInterimaires = interimaires.filter(interim => 
    interim.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interim.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getQualificationName(interim.qualification_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getAgenceName(interim.agence_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClients = clients.filter(client => 
    client.nom_etablissement.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.ville?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.code_postal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getAgenceName(client.agence_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommandes = commandes.filter(commande => 
    commande.client?.nom_etablissement.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commande.client?.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getQualificationName(commande.qualification_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    commande.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#1B4D3E]">
      <Navbar onViewChange={setActiveView} className="bg-[#1B4D3E] border-b border-[#4CAF50]/20" />
      <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 pt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Intérimaires actifs"
              value={124}
              icon={Users}
              trend={{ value: 12, isPositive: true, color: "#FF9F00" }}
            />
            <StatCard
              title="Clients"
              value={48}
              icon={Building2}
              trend={{ value: 8, isPositive: true, color: "#FF9F00" }}
            />
            <StatCard
              title="Commandes en cours"
              value={35}
              icon={ClipboardList}
              trend={{ value: 5, isPositive: false, color: "#FF9F00" }}
            />
            <StatCard
              title="Placements du mois"
              value={89}
              icon={UserCheck}
              trend={{ value: 15, isPositive: true, color: "#FF9F00" }}
            />
          </div>

          <div className="mt-6 mb-6">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  ref={searchRef}
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 text-lg border border-gray-200 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pl-14"
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>

          {activeView === 'commandes' ? (
            <ContentLayout 
              title="Commandes récentes"
              actions={
                <button
                  onClick={() => setShowCommandeModal(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Nouvelle commande
                </button>
              }
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qualification
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCommandes.map((commande) => (
                      <tr key={commande.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {commande.client?.nom_etablissement}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {commande.client?.service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getQualificationName(commande.qualification_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            commande.status === 'en attente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : commande.status === 'servie'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {commande.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ContentLayout>
          ) : activeView === 'interimaires' ? (
            <ContentLayout 
              title="Liste des intérimaires"
              actions={
                <button
                  onClick={() => setShowInterimModal(true)}
                  className="inline-flex items-center p-2 text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <Plus className="w-5 h-5" />
                </button>
              }
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prénom
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qualification
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Agence
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Véhiculé
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInterimaires.map((interim) => (
                      <tr key={interim.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {interim.nom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {interim.prenom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getQualificationName(interim.qualification_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getAgenceName(interim.agence_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {interim.vehicule && (
                            <Car className="w-5 h-5 text-teal-500" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingInterim(interim);
                              setShowInterimModal(true);
                            }}
                            className="text-[#1cb0f6] hover:text-[#0095e2] transition-colors"
                          >
                            <Pencil className="w-5 h-5 inline-block" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(interim)}
                            className="text-[#ff4b4b] hover:text-[#e63e3e] transition-colors"
                          >
                            <Trash2 className="w-5 h-5 inline-block" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ContentLayout>
          ) : (
            <ContentLayout 
              title="Liste des clients"
              actions={
                <button
                  onClick={() => setShowClientModal(true)}
                  className="inline-flex items-center p-2 text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <Plus className="w-5 h-5" />
                </button>
              }
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Établissement
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Agence
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClients.map((client) => (
                      <tr key={client.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {client.nom_etablissement}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {client.service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getAgenceName(client.agence_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingClient(client);
                              setShowClientModal(true);
                            }}
                            className="text-[#1cb0f6] hover:text-[#0095e2] transition-colors"
                          >
                            <Pencil className="w-5 h-5 inline-block" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(client)}
                            className="text-[#ff4b4b] hover:text-[#e63e3e] transition-colors"
                          >
                            <Trash2 className="w-5 h-5 inline-block" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ContentLayout>
          )}
          
          {showInterimModal && (
            <InterimManager 
              onClose={handleInterimModalClose}
              interim={editingInterim}
            />
          )}
          
          {/* Boîte de dialogue de confirmation de suppression */}
          {deleteConfirmation.show && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="fixed inset-0 bg-black bg-opacity-50"></div>
              <div className="relative bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                <div className="flex items-center mb-4 text-red-600">
                  <AlertCircle className="w-6 h-6 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Confirmer la suppression
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Êtes-vous sûr de vouloir supprimer l'intérimaire {deleteConfirmation.interim?.prenom} {deleteConfirmation.interim?.nom} ?
                  Cette action est irréversible.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirmation({ show: false, interim: null })}
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
          
          {showCommandeModal && (
            <CommandeManager onClose={() => setShowCommandeModal(false)} />
          )}
          
          {showClientModal && (
            <ClientManager
              onClose={handleClientModalClose}
              client={editingClient}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;