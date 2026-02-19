import { UsuarioContaEntity } from "./UsuarioContaEntity";

export interface PerfilUsuario {
    empresa?: boolean;
    pessoa?: boolean;
    servico?: boolean;
    vendedor?: boolean;
    usuarioConta?: boolean;
    perfilUsuario?: boolean;
    formaPagamento?: boolean;
    categoriaContrato?: boolean;
    contrato?: boolean;
    ordemServico?: boolean;
}
export class CreatedAccountEntity {
    cnpj!: string;
    razao_social!: string;
    nome!: string;
    email!: string;
    senha!: string;
    usuario_conta!: UsuarioContaEntity;
    constructor({
        cnpj,
        razao_social,
        nome,
        email,
        senha,
        usuario_conta,
    }: {
        cnpj: string;
        razao_social: string;
        nome: string;
        email: string;
        senha: string;
        usuario_conta: UsuarioContaEntity;
    }) {
        this.razao_social = razao_social;
        this.cnpj = cnpj;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.usuario_conta = usuario_conta;
    }
    copyWith({
        razao_social,
        cnpj,
        nome,
        email,
        senha,
        usuario_conta,
    }: {
        cnpj?: string;
        razao_social?: string;
        nome?: string;
        email?: string;
        senha?: string;
        usuario_conta?: UsuarioContaEntity;

    }): CreatedAccountEntity {
        return new CreatedAccountEntity({
            cnpj: cnpj ?? this.cnpj,
            razao_social: razao_social ?? this.razao_social,
            nome: nome ?? this.nome,
            email: email ?? this.email,
            senha: senha ?? this.senha,
            usuario_conta: usuario_conta ?? this.usuario_conta,

        });
    }
}
