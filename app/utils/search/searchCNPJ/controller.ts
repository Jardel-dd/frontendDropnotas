import api from "../../../services/api";
export const searchByCNPJ = async (_cnpj: string) => {
        const cnpj = _cnpj.replace(/\D/g, ''); 
        const response = await api.get(`/empresa/cnpj/${cnpj}`);
        console.log('Retorno CNPJ:', response); 
        return response.data;
    };