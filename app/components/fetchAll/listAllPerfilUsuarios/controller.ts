
import api from "@/app/services/api";
import { TreeCheckboxSelectionKeys } from "primereact/tree";
import { PerfilUser } from "@/app/entity/PerfilUsuarioEntity";
import { permissionsMap } from "@/app/(main)/cadastro/perfilUsuario/controller/mapPerfilUser";

export const fetchAllPerfilUsuarios = async (): Promise<PerfilUser[]> => {
    try {
        const response = await api.get('/perfil-usuario', { params: { ativo: true } });
        let perfilUsuarios = [];
        if (Array.isArray(response.data)) {
            perfilUsuarios = response.data;
        } else if (response.data && Array.isArray(response.data.content)) {
            perfilUsuarios = response.data.content;
        }

        return perfilUsuarios.map((user: any) => ({
            id: user.id,
            nome: user.nome
        }));
    } catch (error) {
        console.error('Erro ao buscar perfis de usuário:', error);
        return [];
    }
};
export const fetchPerfilUserByID = async (
    perfilUserId: string,
    setPerfilUser: React.Dispatch<React.SetStateAction<PerfilUser>>,
    setSelectedKeys: React.Dispatch<React.SetStateAction<TreeCheckboxSelectionKeys>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        setIsLoading(true);
        const response = await api.get(`/perfil-usuario/${perfilUserId}`);
        const data = response.data;
        console.log(' Dados do Perfil U:', data);
        const perfilUserInstance = new PerfilUser(data);
        setPerfilUser(perfilUserInstance);
        const selected = Object.keys(permissionsMap).reduce((acc, key) => {
            const permission = permissionsMap[key];
            if (permission !== undefined) {  
                const isChecked = data[permission];
                const parentKey = key.split('-')[0];
                if (!acc[parentKey]) {
                    acc[parentKey] = { checked: false };
                }
                if (isChecked) {
                    acc[key] = { checked: true };
                    const childrenKeys = Object.keys(permissionsMap).filter(k => k.startsWith(parentKey));
                    const allChildrenChecked = childrenKeys.every(childKey => {
                        const perm = permissionsMap[childKey];
                        return perm !== undefined && data[perm];
                    });
                    if (allChildrenChecked) {
                        acc[parentKey] = { checked: true };
                    }
                } else {
                    acc[key] = { checked: false };
                }
            }
            return acc;
        }, {} as TreeCheckboxSelectionKeys);


        setSelectedKeys(selected);
    } catch (error) {
        console.error('Erro ao buscar Permissão ou perfis:', error);
    } finally {
        setIsLoading(false);
    }
};
export const fetchFilteredPerfilUsuarios = async (query: string): Promise<PerfilUser[]> => {
    try {
        const response = await api.get('/perfil-usuario', {
            params: {
                termo: query 
            }
        });
        return response.data.content || [];
    } catch (error) {
        console.error("Erro ao buscar perfil usuario filtradas:", error);
        return [];
    }
};