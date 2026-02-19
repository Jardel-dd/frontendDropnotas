export class EnderecoEntity {
    cep!: string;
    logradouro!: string;
    complemento!: string;
    numero!: string;
    bairro!: string;
    municipio!: string;
    codigo_municipio!: string;
    codigo_pais!: string;
    nome_pais?: string;
    uf!: string;
    telefone!:string;

    constructor({
        cep,
        logradouro,
        complemento,
        numero,
        bairro,
        municipio,
        codigo_municipio,
        codigo_pais,
        nome_pais,
        uf,
        telefone
    }: {
        cep: string;
        logradouro: string;
        complemento: string;
        numero: string;
        bairro: string;
        municipio: string;
        codigo_municipio: string;
        codigo_pais: string;
        nome_pais?: string;
        uf: string;
        telefone:string;
    }) {
        Object.assign(this, {
            cep,
            logradouro,
            complemento,
            numero,
            bairro,
            municipio,
            codigo_municipio,
            codigo_pais,
            nome_pais,
            uf,
            telefone
        });
    }
}