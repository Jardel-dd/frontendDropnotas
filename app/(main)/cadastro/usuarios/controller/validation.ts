import { CompanyEntity } from "@/app/entity/CompanyEntity";
import { PerfilUser } from "@/app/entity/PerfilUsuarioEntity";
import { UsuarioContaEntity } from "@/app/entity/UsuarioContaEntity";

export const getUsuarioFormErrors = (
    userConta: UsuarioContaEntity,
    confirmPassword: string,
    selectedPerfilUser: PerfilUser | null,
    selectedEmpresa: CompanyEntity[],
    userContaID?: string
): { [key: string]: string } => {
    const newErrors: { [key: string]: string } = {};
    const isEditMode = Boolean(userContaID);
    const hasSelectedEmpresa = Array.isArray(selectedEmpresa) && selectedEmpresa.length > 0;
    const hasSavedEmpresaIds = Array.isArray(userConta.id_empresas_acesso) && userConta.id_empresas_acesso.length > 0;

    if (!userConta.nome?.trim() || userConta.nome.trim().length < 2) {
        newErrors.nome = 'Digite pelo menos 2 caracteres.';
    }
    if (!userConta.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userConta.email)) {
        newErrors.email = 'Email inválido.';
    }
    // Estes campos só estão visíveis durante o cadastro.
    if (!isEditMode) {
        if (!userConta.senha || userConta.senha.length < 6) {
            newErrors.senha = 'Senha é obrigatória e deve ter pelo menos 6 caracteres.';
        }
        if (confirmPassword !== userConta.senha) {
            newErrors.confirmPassword = 'A confirmação de senha deve ser igual à senha.';
        }
    }
    if (!selectedPerfilUser) {
        newErrors.selectedPerfilUser = 'Selecione um perfil de usuário .';
    }

    if (!hasSelectedEmpresa && !hasSavedEmpresaIds) {
        newErrors.selectedEmpresa = 'Selecione uma Empresa.';
    }

    return newErrors;
};

export const validateFieldsUserConta = (
    userConta: UsuarioContaEntity,
    confirmPassword: string,
    selectedPerfilUser: PerfilUser | null,
    selectedEmpresa: CompanyEntity[],
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.RefObject<any>,
    userContaID?: string
): boolean => {
    const newErrors = getUsuarioFormErrors(
        userConta,
        confirmPassword,
        selectedPerfilUser,
        selectedEmpresa,
        userContaID
    );

    msgs.current?.clear();
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
};
