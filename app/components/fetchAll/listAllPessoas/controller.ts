import api from "@/app/services/api";
import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { VendedorEntity } from "@/app/entity/VendedorEntity";

export const fetchAllPessoas = async (): Promise<PessoaEntity[]> => {
    try {
        const idsResponse = await api.get('/pessoa');
                console.log('[fetchAllPessoas] response.data:', idsResponse.data);
        let pessoas = [];
        if (Array.isArray(idsResponse.data)) {
            pessoas = idsResponse.data;
        } else if (idsResponse.data && Array.isArray(idsResponse.data.content)) {
            pessoas = idsResponse.data.content;
        } else {
            throw new Error("Dados recebidos de pessoas não são um array ou não contêm um array na propriedade 'content'");
        }
        return pessoas.map((user: any) => ({
            id: user.id,
            razao_social: user.razao_social || 'Nome não disponível',
        }));
    } catch (error) {
        console.error('Erro ao buscar pessoas do endpoint /pessoas:', error);
        return [];
    }
};
export const fetchFilteredPessoas = async (termo: string) => {
    try {
        const response = await api.get(`/pessoa`, {
            params: {
                termo: termo
            }
        });
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content.map((user: any) => ({
                id: user.id,
                razao_social: user.razao_social || 'Nome não disponível',
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao filtrar clientes:", error);
        return [];
    }
};
export const fetchPessoasById = async (pessoaId: string) => {
    try {
        const { data: dataPessoa } = await api.get(`/pessoa/${pessoaId}`);
        console.log("Pessoa selecionada:", dataPessoa);
        const pessoaInstanciada = new PessoaEntity(dataPessoa);
        const { data: VendedorResponse } = await api.get("/vendedor");
        const empresaList = Array.isArray(VendedorResponse.content) ? VendedorResponse.content : [];
        const VendedorListFormatada: VendedorEntity[] = empresaList.map((vendedor: any) => ({
            id: vendedor.id,
            nome: vendedor.razao_social,
        }));
        const selectedVendedor: VendedorEntity | null = VendedorListFormatada.find(
            (vendedor: any) => vendedor.id === dataPessoa.id_vendedor_padrao
        ) || null;
        return {
            dataPessoa: pessoaInstanciada,
            vendedor: VendedorListFormatada,
            selectedVendedor,
        };
    } catch (error) {
        console.error(" Erro ao buscar cliente/fornecedor:", error);
        throw error;
    }
};
export const listThePessoas = async () => {
    try {
        const response = await api.get("/pessoa");
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar serviços:", error);
        return [];
    }
};

