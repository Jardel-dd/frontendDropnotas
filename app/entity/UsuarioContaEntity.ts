import { PerfilUsuario } from "./CreatedAccountEntity";
export class UsuarioContaEntity {
    ativo?: boolean;
    id!: number;
    foto_perfil?: string;
    nome!: string;
    email!: string;
    senha!: string;
    id_empresas_acesso?: number[];
    esquema_cor?:string;
    perfilUsuario?: PerfilUsuario;
    tema_componente?:string;
    constructor({
        ativo,
        id,
        foto_perfil,
        nome,
        email,
        senha,
        id_empresas_acesso,
        perfilUsuario,
        tema_componente,
        esquema_cor
    }: {
        ativo?: boolean;
        id?: number;
        foto_perfil?: string;
        nome: string;
        email: string;
        senha: string;
        id_empresas_acesso?: number[];
        esquema_cor?:string;
        tema_componente?:string;
        perfilUsuario?: PerfilUsuario;
    }) {
        Object.assign(this, {
            ativo,
            id,
            foto_perfil,
            nome,
            email,
            senha,
            id_empresas_acesso,
            perfilUsuario,
            tema_componente,
            esquema_cor
        });
    }
    copyWith({
        ativo,
        id,
        foto_perfil,
        nome,
        email,
        senha,
        id_empresas_acesso,
        perfilUsuario,
        tema_componente,
        esquema_cor
    }: {
        ativo?: boolean;
        id?: number;
        foto_perfil?: string;
        nome?: string;
        email?: string;
        senha?: string;
        id_empresas_acesso?: number[];
        tema_componente?:string;
        esquema_cor?:string;
        perfilUsuario?: PerfilUsuario;
    }): UsuarioContaEntity {
        return new UsuarioContaEntity({
            ativo: ativo ?? this.ativo,
            id: id ?? this.id,
            foto_perfil: foto_perfil ?? this.foto_perfil,
            nome: nome ?? this.nome,
            email: email ?? this.email,
            senha: senha ?? this.senha,
            id_empresas_acesso: id_empresas_acesso ?? this.id_empresas_acesso,
            tema_componente: tema_componente ?? this.tema_componente,
            esquema_cor: esquema_cor ?? this.esquema_cor,
            perfilUsuario: perfilUsuario ?? this.perfilUsuario,
        });
    }
}
