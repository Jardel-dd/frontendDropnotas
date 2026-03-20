import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { TreeCheckboxSelectionKeys } from 'primereact/tree';

export const validateFieldsPerfilUser = (
    perfilUser: Partial<PerfilUser>,
    selectedPerfilUser: PerfilUser[] | null,
    selectedKeys: TreeCheckboxSelectionKeys,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs?: React.RefObject<any>
) => {
    let valid = true;
    let errorMessages: string[] = [];
    let newErrors: { [key: string]: string } = {};
    msgs?.current?.clear();

    if (!perfilUser.nome || perfilUser.nome.trim().length < 2) {
        newErrors.nome = 'O nome deve ter pelo menos 2 caracteres.';
        valid = false;
    } else if (!perfilUser.ordemServicoTipoVisualizacao) {
        newErrors.selectedordemServicoTipoVisualizacao = 'O tipo de visualização de ordens de serviço é obrigatório.';
        valid = false;
    } else if (!perfilUser.contratoTipoVisualizacao) {
        newErrors.contratoTipoVisualizacao = 'O tipo de visualização de contrato é obrigatório.';
        valid = false;
         } else if (!perfilUser.nfseTipoVisualizacao) {
        newErrors.nfseTipoVisualizacao = 'O tipo de visualização da Nota Fiscal é obrigatório.';
        valid = false;
    } else if (!selectedKeys || Object.keys(selectedKeys).length === 0) {
        newErrors.selectedPerfilUser = 'É obrigatório selecionar pelo menos uma permissão.';
        valid = false;

    } else {
        valid = true;
    }
    setErrors(newErrors);
    if (errorMessages.length > 0) {
        msgs?.current?.show({ severity: 'error', summary: 'Erro', detail: errorMessages[0] });
    }
    return valid;
};
