import { PerfilUsuario } from "./CreatedAccountEntity";
export class UsuarioContaEntity {
    ativo?: boolean;
    id!: number;
    foto_perfil?: string;
    nome!: string;
    email!: string;
    senha!: string;
    perfilUsuario?: PerfilUsuario;
    constructor({
        ativo,
        id,
        foto_perfil,
        nome,
        email,
        senha,
        perfilUsuario,
    }: {
        ativo?: boolean;
        id?: number;
        foto_perfil?: string;
        nome: string;
        email: string;
        senha: string;
        perfilUsuario?: PerfilUsuario;
    }) {
        Object.assign(this, {
            ativo,
            id,
            foto_perfil,
            nome,
            email,
            senha,
            perfilUsuario,
        });
    }
    copyWith({
        ativo,
        id,
        foto_perfil,
        nome,
        email,
        senha,
        perfilUsuario,
    }: {
        ativo?: boolean;
        id?: number;
        foto_perfil?: string;
        nome?: string;
        email?: string;
        senha?: string;
        perfilUsuario?: PerfilUsuario;
    }): UsuarioContaEntity {
        return new UsuarioContaEntity({
            ativo: ativo ?? this.ativo,
            id: id ?? this.id,
            foto_perfil: foto_perfil ?? this.foto_perfil,
            nome: nome ?? this.nome,
            email: email ?? this.email,
            senha: senha ?? this.senha,
            perfilUsuario: perfilUsuario ?? this.perfilUsuario,
        });
    }
}