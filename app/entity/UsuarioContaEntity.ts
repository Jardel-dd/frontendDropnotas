import { PerfilUsuario } from "./CreatedAccountEntity";
export class UsuarioContaEntity {
    ativo?: boolean;
    id!: number;
    foto_perfil?: string;
    is_usuario_principal?:boolean
    nome!: string;
    email!: string;
    senha!: string;
    id_empresas_acesso?: number[];
    esquema_cor?:string;
    perfil_usuario?: PerfilUsuario;
    tema_componente?:string;
    constructor({
        ativo,
        id,
        foto_perfil,
        nome,
        email,
        is_usuario_principal,
        senha,
        id_empresas_acesso,
        perfil_usuario,
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
        is_usuario_principal?:boolean;
        tema_componente?:string;
        perfil_usuario?: PerfilUsuario;
    }) {
        Object.assign(this, {
            ativo,
            id,
            foto_perfil,
            nome,
            email,
            senha,
            id_empresas_acesso,
            perfil_usuario,
            tema_componente,
            esquema_cor,
            is_usuario_principal
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
        perfil_usuario,
        tema_componente,
        esquema_cor,
        is_usuario_principal
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
        perfil_usuario?: PerfilUsuario;
        is_usuario_principal?:boolean;
    }): UsuarioContaEntity {
        return new UsuarioContaEntity({
            ativo: ativo ?? this.ativo,
            id: id ?? this.id,
            foto_perfil: foto_perfil ?? this.foto_perfil,
            nome: nome ?? this.nome,
            email: email ?? this.email,
            senha: senha ?? this.senha,
            is_usuario_principal: is_usuario_principal ?? this.is_usuario_principal,
            id_empresas_acesso: id_empresas_acesso ?? this.id_empresas_acesso,
            tema_componente: tema_componente ?? this.tema_componente,
            esquema_cor: esquema_cor ?? this.esquema_cor,
            perfil_usuario: perfil_usuario ?? this.perfil_usuario,
        });
    }
}
