import React from 'react';
import { useQualifications } from '../../hooks/useQualifications';
import { X } from 'lucide-react';
import type { Qualification } from '../../types';

interface QualificationFormProps {
  qualification?: Qualification;
  onClose: () => void;
}

export default function QualificationForm({ qualification, onClose }: QualificationFormProps) {
  const { createQualification, updateQualification, refresh } = useQualifications();
  const [formData, setFormData] = React.useState({
    nom: qualification?.nom || '',
    acronyme: qualification?.acronyme || '',
  });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        nom: formData.nom.toUpperCase(),
        acronyme: formData.acronyme.toUpperCase(),
      };

      if (qualification) {
        await updateQualification(qualification.id, dataToSubmit);
      } else {
        await createQualification(dataToSubmit);
      }
      await refresh(); // Refresh the list after successful operation
      onClose();
    } catch (err) {
      alert('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {qualification ? 'Modifier la qualification' : 'Gestion des Qualifs'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
              Qualif
            </label>
            <input
              type="text"
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value.toUpperCase() }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="acronyme" className="block text-sm font-medium text-gray-700 mb-1">
              Acronyme
            </label>
            <input
              type="text"
              id="acronyme"
              value={formData.acronyme}
              onChange={(e) => setFormData(prev => ({ ...prev, acronyme: e.target.value.toUpperCase() }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-teal-500 rounded-md hover:bg-teal-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : qualification ? 'Modifier' : 'Ajouter la Qualif'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}