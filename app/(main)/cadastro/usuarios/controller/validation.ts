import { CompanyEntity } from "@/app/entity/CompanyEntity";
import { PerfilUser } from "@/app/entity/PerfilUsuarioEntity";
import { UsuarioContaEntity } from "@/app/entity/UsuarioContaEntity";

export const validateFieldsUserConta = (
    userConta: UsuarioContaEntity,
    confirmPassword: string,
    selectedPerfilUser: PerfilUser | null,
    selectedEmpresa: CompanyEntity[],
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.RefObject<any>,
    userContaID?: string
): boolean => {
    let valid = true;
    let errorMessages: string[] = [];
    let newErrors: { [key: string]: string } = {};
    const hasSelectedEmpresa = Array.isArray(selectedEmpresa) && selectedEmpresa.length > 0;
    const hasSavedEmpresaIds = Array.isArray(userConta.id_empresas_acesso) && userConta.id_empresas_acesso.length > 0;
    msgs.current?.clear();


    if (!userConta.nome || userConta.nome.trim().length < 2) {
        newErrors.nome = 'O Nome deve ter pelo menos 2 caracteres.';
        valid = false;
    } else if (!userConta.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userConta.email)) {
        newErrors.email = 'Email inválido.';
        valid = false;
    } else if (!userContaID && (!userConta.senha || userConta.senha.length < 6)) {
        newErrors.senha = 'Senha é obrigatória e deve ter pelo menos 6 caracteres.';
        valid = false;
    } else if (confirmPassword !== userConta.senha) {
        newErrors.confirmPassword = 'A confirmação de senha deve ser igual à senha.';
        valid = false;
    } else if (!selectedPerfilUser) {
        newErrors.selectedPerfilUser = 'Este Campo deve ser selecionado.';
        valid = false;
    } else if (!hasSelectedEmpresa && !hasSavedEmpresaIds) {
        newErrors.selectedEmpresa = 'Este Campo deve ser selecionado.';
        valid = false;
    }
    setErrors(newErrors);
    if (errorMessages.length > 0) {
        msgs.current?.show({ severity: 'error', summary: 'Atenção:', detail: errorMessages[0] });
    }

    return valid;
};
