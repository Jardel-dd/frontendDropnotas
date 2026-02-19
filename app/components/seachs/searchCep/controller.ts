import { searchByCep } from "@/app/utils/searchCEP/controller";

export const handleSearchCep = async <T>(
    cep: string,
    setLoading: (state: boolean) => void,
    setEntity: React.Dispatch<React.SetStateAction<T>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    msgs: any
) => {
    setLoading(true);
    try {
        const data = await searchByCep(cep, msgs);
        if (data) {
            setEntity(prevEntity => {
                const prevEndereco = (prevEntity as any).endereco || {};
                const endereco = {
                    ...prevEndereco,
                    cep: data.cep || prevEndereco.cep || '',
                    logradouro: data.logradouro || prevEndereco.logradouro || '',
                    complemento: data.complemento || prevEndereco.complemento || '',
                    bairro: data.bairro || prevEndereco.bairro || '',
                    municipio: data.municipio || prevEndereco.municipio || '',
                    uf: data.uf || prevEndereco.uf || '',
                    nome_pais: data.nome_pais || prevEndereco.nome_pais || '',
                    codigo_municipio: data.codigo_municipio || prevEndereco.codigo_municipio || '',
                    codigo_pais: data.codigo_pais || prevEndereco.codigo_pais || '',
                    numero: prevEndereco.numero || '',
                };
                return {
                    ...prevEntity,
                    endereco,
                };
            });
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        setError('Erro ao buscar o CEP.');
    } finally {
        setLoading(false);
    }
};
