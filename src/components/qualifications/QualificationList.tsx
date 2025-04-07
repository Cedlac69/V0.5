import React from 'react';
import { useQualifications } from '../../hooks/useQualifications';
import { Pencil, Trash2 } from 'lucide-react';
import QualificationForm from './QualificationForm';
import type { Qualification } from '../../types';

interface QualificationListProps {
  searchTerm: string;
}

export default function QualificationList({ searchTerm }: QualificationListProps) {
  const { qualifications, loading, error, deleteQualification, refresh } = useQualifications();
  const [editingQualification, setEditingQualification] = React.useState<Qualification | undefined>();

  const handleEdit = (qualification: Qualification) => {
    setEditingQualification(qualification);
  };

  const handleClose = () => {
    setEditingQualification(undefined);
    refresh();
  };

  const handleDelete = async (qualification: Qualification) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette qualification ?')) {
      try {
        await deleteQualification(qualification.id);
        refresh();
      } catch (err) {
        alert('Une erreur est survenue lors de la suppression');
      }
    }
  };

  const filteredQualifications = qualifications.filter(qual => 
    qual.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qual.acronyme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <p className="text-sm text-red-700">Une erreur est survenue lors du chargement des qualifications.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full">
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 px-6 py-3">
              <div className="col-span-5">
                <span className="text-xs font-medium text-gray-500 uppercase">Qualif</span>
              </div>
              <div className="col-span-5">
                <span className="text-xs font-medium text-gray-500 uppercase">Acronyme</span>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-xs font-medium text-gray-500 uppercase">Actions</span>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredQualifications.map((qualification) => (
              <div key={qualification.id} className="grid grid-cols-12 gap-4 px-6 py-3 hover:bg-gray-50">
                <div className="col-span-5">
                  <span className="text-sm text-gray-900">{qualification.nom}</span>
                </div>
                <div className="col-span-5">
                  <span className="text-sm text-gray-500">{qualification.acronyme}</span>
                </div>
                <div className="col-span-2 text-right space-x-3">
                  <button
                    onClick={() => handleEdit(qualification)}
                    className="text-gray-400 hover:text-teal-500"
                    title="Modifier"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(qualification)}
                    className="text-gray-400 hover:text-red-500"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editingQualification && (
        <QualificationForm
          qualification={editingQualification}
          onClose={handleClose}
        />
      )}
    </>
  );
}