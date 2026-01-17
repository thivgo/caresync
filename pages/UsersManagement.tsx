import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/ui/Avatar';
import { Shield, Trash2, ShieldAlert, UserMinus, Lock } from 'lucide-react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Role } from '../types';

export const UsersManagement: React.FC = () => {
  const { currentUser, users, deleteUser, updateUserRole } = useApp();
  
  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'DELETE' | 'ROLE' | null;
    targetId: string;
    targetName: string;
    targetRole?: Role; // Only for ROLE action
  }>({
    isOpen: false,
    type: null,
    targetId: '',
    targetName: '',
  });

  // Security check
  if (currentUser?.role !== 'ADMIN') {
      return <div className="p-8 text-center text-red-500">Acesso negado. Apenas administradores.</div>;
  }

  // --- Handlers to OPEN Modal ---

  const clickDelete = (userId: string, userName: string) => {
      if (userId === currentUser.id) {
          alert("Você não pode excluir sua própria conta.");
          return;
      }
      // PROTECT PRIMARY ADMIN
      if (userId === 'admin_user') {
          alert("O administrador principal do sistema não pode ser excluído.");
          return;
      }
      setModalConfig({
          isOpen: true,
          type: 'DELETE',
          targetId: userId,
          targetName: userName
      });
  };

  const clickRole = (userId: string, currentRole: Role, userName: string) => {
      if (userId === currentUser.id) {
          alert("Você não pode alterar seu próprio cargo.");
          return;
      }
      // PROTECT PRIMARY ADMIN
      if (userId === 'admin_user') {
          alert("O cargo do administrador principal não pode ser alterado.");
          return;
      }
      setModalConfig({
          isOpen: true,
          type: 'ROLE',
          targetId: userId,
          targetName: userName,
          targetRole: currentRole
      });
  };

  // --- Action Execution ---

  const handleConfirm = async () => {
      const { type, targetId, targetRole } = modalConfig;
      
      try {
          if (type === 'DELETE') {
              console.log('Executing DELETE for:', targetId);
              await deleteUser(targetId);
          } else if (type === 'ROLE' && targetRole) {
              const newRole = targetRole === 'ADMIN' ? 'MEMBER' : 'ADMIN';
              console.log('Executing ROLE UPDATE for:', targetId, newRole);
              await updateUserRole(targetId, newRole);
          }
      } catch (error) {
          console.error("Action failed:", error);
          alert("Ocorreu um erro ao executar a ação.");
      } finally {
          setModalConfig({ isOpen: false, type: null, targetId: '', targetName: '' });
      }
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gerenciar Usuários</h2>
         <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium dark:bg-blue-900/30 dark:text-blue-300">
             {users.length} cadastrados
         </span>
      </div>

      <div className="space-y-3">
          {users.map(user => {
              const isPrimaryAdmin = user.id === 'admin_user';
              const isMe = user.id === currentUser.id;

              return (
                <div key={user.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Avatar src={user.avatarUrl} alt={user.name} size="md" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900 dark:text-white">{user.name}</h3>
                                {user.role === 'ADMIN' && (
                                    <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold ${isPrimaryAdmin ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'}`}>
                                        <Shield className="w-3 h-3" /> {isPrimaryAdmin ? 'MASTER' : 'ADMIN'}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                    </div>

                    {!isMe && (
                        <div className="flex items-center gap-2 self-end md:self-auto border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
                            {isPrimaryAdmin ? (
                                <span className="flex items-center gap-1 text-xs text-gray-400 italic bg-gray-50 dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-slate-600">
                                    <Lock className="w-3 h-3" /> Protegido pelo Sistema
                                </span>
                            ) : (
                                <>
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clickRole(user.id, user.role, user.name);
                                        }}
                                        className={`
                                        flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors border shadow-sm z-10
                                        ${user.role === 'ADMIN' 
                                            ? 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400' 
                                            : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                                        }
                                        `}
                                    >
                                        {user.role === 'ADMIN' ? 'Remover Admin' : 'Tornar Admin'}
                                    </button>
                                    
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clickDelete(user.id, user.name);
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30 z-10"
                                        title="Excluir Usuário"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    
                    {isMe && (
                         <span className="text-xs text-gray-400 italic px-3 bg-gray-50 dark:bg-slate-700/50 rounded py-1 self-end md:self-auto">Você</span>
                    )}
                </div>
              );
          })}
      </div>

      {/* Confirmation Modal */}
      <ConfirmDialog 
        isOpen={modalConfig.isOpen}
        title={modalConfig.type === 'DELETE' ? 'Excluir Usuário' : 'Alterar Permissões'}
        description={
            modalConfig.type === 'DELETE' 
                ? `Você tem certeza que deseja excluir ${modalConfig.targetName}? O usuário perderá o acesso imediatamente.`
                : `Deseja alterar o nível de acesso de ${modalConfig.targetName}?`
        }
        confirmText={modalConfig.type === 'DELETE' ? 'Sim, Excluir' : 'Confirmar'}
        variant={modalConfig.type === 'DELETE' ? 'danger' : 'warning'}
        onConfirm={handleConfirm}
        onCancel={() => setModalConfig({ isOpen: false, type: null, targetId: '', targetName: '' })}
      />
    </div>
  );
};