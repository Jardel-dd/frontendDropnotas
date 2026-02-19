import api from "@/app/services/api";
import { VendedorEntity } from "@/app/entity/VendedorEntity";

export const fetchVendedor = async (vendedorId: string): Promise<{ dataVendedor: VendedorEntity }> => {
  try {
    const { data: dataVendedor } = await api.get(`/vendedor/${vendedorId}`);
    const vendedorInstanciado = new VendedorEntity({
      ...dataVendedor,
      percentual_comissao: dataVendedor.percentual_comissao ?? 0 
    });
    console.log("vendedor selecionado", dataVendedor);
    return {
      dataVendedor: vendedorInstanciado,
    };
  } catch (error) {
    console.error("Erro ao buscar vendedor :", error);
    throw error;
  }
};
export const fetchAllVendedores = async (): Promise<VendedorEntity[]> => {
    try {
        const response = await api.get('/vendedor');
        return response.data.content || [];
    } catch (error) {
        console.error("Erro ao buscar todas as vendedor:", error);
        return [];
    }
};
export const fetchFilteredVendedor = async (termo: string): Promise<VendedorEntity[]> => {
    try {
        const response = await api.get('/vendedor', {
            params: {
                termo: termo 
            }
        });
        return response.data.content || [];
    } catch (error) {
        console.error("Erro ao buscar vendedor filtradas:", error);
        return [];
    }
};
export const listTheVendedor = async () => {
    try {
        const response = await api.get('/vendedor');
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar Vendedor contrato:", error);
        return [];
    }
};