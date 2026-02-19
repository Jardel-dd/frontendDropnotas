import { UsuarioContaEntity } from "@/app/entity/UsuarioContaEntity";

export const validateFormSignIn = (
    userConta: UsuarioContaEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any
) => {
    let valid = true;
    let errorMessages: string[] = [];
    let newErrors: { [key: string]: string } = {};
    msgs.current?.clear();
    
   if (!userConta.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userConta.email || '')) {
        newErrors.email = 'Email inválido. Por favor, digite um email válido.';
        valid = false;
    } else if (!userConta.senha || userConta.senha.length < 6) {
        newErrors.senha = 'A senha deve ter pelo menos 6 caracteres.';
        valid = false;
    } else{
        valid = true;
    }
    setErrors(newErrors);
    if (errorMessages.length > 0) {
        msgs.current?.show({ severity: 'error', summary: 'Erro', detail: errorMessages[0] });
    }
    return valid;
};
