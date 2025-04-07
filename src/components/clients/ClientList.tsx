import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import { useAgences } from '../../hooks/useAgences';
import ClientManager from './ClientManager';
import type { Client } from '../../types';

export default function ClientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; client: Client | null }>({
    show: false,
    client: null
  });

  const { clients, deleteClient, refresh: refreshClients } = useClients();
  const { agences } = useAgences();

  const getAgenceName = (id: string) => {
    const agence = agences.find(a => a.id === id);
    return agence ? agence.nom : '';
  };

  const filteredClients = clients.filter(client => 
    client.nomEtablissement.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getAgenceName(client.agence_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (client: Client) => {
    setDeleteConfirmation({ show: true, client });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmation.client) {
      try {
        await deleteClient(deleteConfirmation.client.id);
        setDeleteConfirmation({ show: false, client: null });
        refreshClients();
      } catch (err) {
        console.error('Error deleting client:', err);
        alert('Une erreur est survenue lors de la suppression');
      }
    }
  };

  const handleClientModalClose = () => {
    setShowClientModal(false);
    setEditingClient(null);
    refreshClients();
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Gestion des Clients</h1>
          <button
            onClick={() => setShowClientModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter un client
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Établissement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agence
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.nomEtablissement}
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

        {showClientModal && (
          <ClientManager
            onClose={handleClientModalClose}
            client={editingClient}
          />
        )}

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
                Êtes-vous sûr de vouloir supprimer le client {deleteConfirmation.client?.nomEtablissement} ?
                Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmation({ show: false, client: null })}
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
  );
}