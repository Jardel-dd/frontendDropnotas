import api from "../../../services/api";

export const searchByCNPJ = async (_cnpj: string) => {
        const cnpj = _cnpj.replace(/\D/g, ''); 
        const response = await api.get(`/empresa/cnpj/${cnpj}`);
        console.log('Retorno CNPJ:', response); 
        return response.data;
    };

export const searchByCertificate = async ({
    certificado_digital,
    senha_certificado_digital
}: {
    certificado_digital: string;
    senha_certificado_digital: string;
}) => {
    const response = await api.post('/empresa/cnpj', {
        certificado_digital,
        senha_certificado_digital
    });

    console.log('Retorno certificado digital:', response);
    return response.data;
};
