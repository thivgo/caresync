import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../services/dbService';
import { Avatar } from '../components/ui/Avatar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Plus, Trash2, HeartPulse, StickyNote, AlertTriangle, X } from 'lucide-react';

export const Profiles: React.FC = () => {
  const { elderlyProfiles, refreshProfiles, deleteElderlyProfile, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  
  // Basic Info only - Removed Appearance customization
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [newConditions, setNewConditions] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; name: string }>({
      isOpen: false,
      id: '',
      name: ''
  });

  // Simple Random URL based on Name (Seed)
  const getPreviewUrl = (name: string) => {
    const seed = name.trim() || 'novo-perfil';
    // Using v7.x standard endpoint without complex parameters
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4`;
  };
  
  const handleAdd = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const profile = {
          id: `e${Date.now()}`,
          name: newName,
          gender: newGender,
          avatarUrl: getPreviewUrl(newName), 
          conditions: newConditions.split(',').map(c => c.trim()).filter(Boolean),
          notes: newNotes
      };
      
      await db.createElderlyProfile(profile);
      await refreshProfiles();
      resetForm();
  };

  const resetForm = () => {
      setShowForm(false);
      setNewName('');
      setNewGender('MALE');
      setNewConditions('');
      setNewNotes('');
  };

  const confirmDelete = async () => {
      if (deleteModal.id) {
          await deleteElderlyProfile(deleteModal.id);
          setDeleteModal({ isOpen: false, id: '', name: '' });
      }
  };

  const previewUrl = getPreviewUrl(newName);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Perfis de Cuidado</h2>
          {!showForm && (
            <button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 shadow-md shadow-blue-500/20"
            >
                <Plus className="w-4 h-4" /> Novo
            </button>
          )}
      </div>

      {showForm && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 animate-in slide-in-from-top-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Criar Novo Perfil</h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
              </div>

              <form onSubmit={handleAdd} className="space-y-6">
                  
                  <div className="flex flex-col md:flex-row gap-8">
                      {/* Left: Avatar Preview */}
                      <div className="flex flex-col items-center space-y-3">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Avatar Gerado</label>
                          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-slate-700 shadow-lg overflow-hidden bg-blue-50 relative">
                              <img 
                                key={previewUrl}
                                src={previewUrl} 
                                alt="Avatar Preview" 
                                className="w-full h-full object-cover"
                              />
                          </div>
                          <div className="text-center">
                              <p className="text-sm text-gray-500 dark:text-gray-400">Gerado automaticamente com base no nome</p>
                          </div>
                      </div>

                      {/* Right: Form Fields */}
                      <div className="flex-1 space-y-4">
                          {/* Basic Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nome Completo</label>
                                  <input 
                                    placeholder="Ex: Vó Maria" 
                                    className="w-full border p-2.5 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                  />
                              </div>
                              
                              <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Gênero</label>
                                  <select
                                    className="w-full border p-2.5 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newGender}
                                    onChange={e => setNewGender(e.target.value as 'MALE' | 'FEMALE')}
                                  >
                                      <option value="MALE">Masculino</option>
                                      <option value="FEMALE">Feminino</option>
                                  </select>
                              </div>
                          </div>

                          <div className="h-px bg-gray-100 dark:bg-slate-700 my-4"></div>

                          {/* Health Info */}
                          <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Condições Médicas</label>
                              <input 
                                placeholder="Ex: Diabetes, Hipertensão" 
                                className="w-full border p-2.5 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newConditions}
                                onChange={e => setNewConditions(e.target.value)}
                              />
                          </div>

                          <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Observações</label>
                              <textarea 
                                placeholder="Notas importantes sobre o idoso..."
                                rows={2}
                                className="w-full border p-2.5 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                value={newNotes}
                                onChange={e => setNewNotes(e.target.value)}
                              />
                          </div>
                      </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                      <button type="button" onClick={resetForm} className="px-5 py-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl text-sm font-medium">Cancelar</button>
                      <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-bold shadow-lg shadow-blue-500/20">Salvar Perfil</button>
                  </div>
              </form>
          </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
          {elderlyProfiles.map(profile => (
              <div key={profile.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col gap-4 relative group">
                  <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                          <Avatar src={profile.avatarUrl} alt={profile.name} size="lg" />
                          <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{profile.name}</h3>
                                {profile.gender === 'FEMALE' ? (
                                    <span className="text-[10px] bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300 px-1.5 py-0.5 rounded font-bold">F</span>
                                ) : (
                                    <span className="text-[10px] bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold">M</span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500 bg-gray-100 dark:bg-slate-700 dark:text-gray-300 px-2 py-0.5 rounded-full mt-1 inline-block">ID: {profile.id}</span>
                          </div>
                      </div>
                      
                      {currentUser?.role === 'ADMIN' && (
                          <button 
                            onClick={() => setDeleteModal({ isOpen: true, id: profile.id, name: profile.name })} 
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Excluir Idoso"
                          >
                              <Trash2 className="w-5 h-5" />
                          </button>
                      )}
                  </div>

                  <div className="space-y-2">
                      <div className="flex items-start gap-2">
                          <HeartPulse className="w-4 h-4 text-rose-500 mt-1" />
                          <div className="flex flex-wrap gap-1">
                              {profile.conditions.length > 0 ? profile.conditions.map(c => (
                                  <span key={c} className="text-xs border border-rose-100 bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-300">
                                      {c}
                                  </span>
                              )) : <span className="text-sm text-gray-400">Nenhuma condição registrada.</span>}
                          </div>
                      </div>
                      {profile.notes && (
                         <div className="flex items-start gap-2">
                             <StickyNote className="w-4 h-4 text-yellow-500 mt-1" />
                             <p className="text-sm text-gray-600 dark:text-gray-400">{profile.notes}</p>
                         </div>
                      )}
                  </div>
              </div>
          ))}
          
          {elderlyProfiles.length === 0 && !showForm && (
              <div className="col-span-full text-center py-10 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                  <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">Nenhum idoso cadastrado.</p>
                  <button onClick={() => setShowForm(true)} className="text-blue-600 text-sm font-bold mt-2">Cadastrar primeiro perfil</button>
              </div>
          )}
      </div>

      <ConfirmDialog 
         isOpen={deleteModal.isOpen}
         title="Excluir Perfil de Idoso"
         description={`ATENÇÃO: Você está prestes a excluir "${deleteModal.name}". Isso apagará TODAS as tarefas associadas a este idoso permanentemente.`}
         confirmText="Excluir Definitivamente"
         variant="danger"
         onConfirm={confirmDelete}
         onCancel={() => setDeleteModal({ isOpen: false, id: '', name: '' })}
      />
    </div>
  );
};