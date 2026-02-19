import { CategoryContratosEntity } from "@/app/entity/CategoryContratEntity";


export const validateFieldsCategoriaContrato = (
    categoriaContrato: CategoryContratosEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: React.RefObject<any> 
) => {
    let valid = true;
    let errorMessages: string[] = [];
    let newErrors: { [key: string]: string } = {};
    msgs.current?.clear();
    if (!categoriaContrato.descricao || categoriaContrato.descricao.trim().length < 2) {
        newErrors.descricao = 'A descricao deve ter pelo menos 2 caracteres.';
        valid = false;
    } else {
        valid = true;
    }
    setErrors(newErrors);
    if (errorMessages.length > 0) {
        msgs.current?.show({ severity: 'error', summary: 'Erro', detail: errorMessages[0] });
    }
    return valid;
};
