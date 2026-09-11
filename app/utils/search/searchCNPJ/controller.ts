import axios from 'axios';
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
    const endpoint = '/empresa/cnpj';
    const payload = {
        certificado_digital,
        senha_certificado_digital
    };
    const startedAt = performance.now();

    // Nunca registrar o payload real ou o objeto Axios: podem conter certificado, senha e token.
    console.info('[Busca Certificado A1] Enviando requisicao', {
        metodo: 'POST',
        url: api.getUri({ url: endpoint }),
        contentType: 'application/json',
        payload: {
            certificado_digital: '[BASE64 OMITIDO]',
            senha_certificado_digital: '[SENHA OMITIDA]'
        },
        certificadoBase64Caracteres: certificado_digital.length,
        certificadoComPrefixoDataUrl: certificado_digital.startsWith('data:'),
        senhaInformada: Boolean(senha_certificado_digital)
    });

    try {
        const response = await api.post(endpoint, payload);

        console.info('[Busca Certificado A1] Resposta recebida', {
            status: response.status,
            duracaoMs: Math.round(performance.now() - startedAt),
            dadosRecebidos: Boolean(response.data)
        });

        return response.data;
    } catch (error) {
        console.error('[Busca Certificado A1] Falha na requisicao', {
            status: axios.isAxiosError(error) ? error.response?.status ?? null : null,
            codigo: axios.isAxiosError(error) ? error.code : undefined,
            duracaoMs: Math.round(performance.now() - startedAt)
        });
        throw error;
    }
};
