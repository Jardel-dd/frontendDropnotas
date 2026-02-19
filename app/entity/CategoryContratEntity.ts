export class CategoryContratosEntity {
    id!: number;
    descricao!: string;
    observacoes?: string;
    ativo!: boolean;

    constructor({
        id,
        descricao,
        observacoes,
        ativo,
    }: {
        id: number;
        descricao: string;
        observacoes?: string;
        ativo: boolean;
    }) {
        Object.assign(this, {
            id,
            descricao,
            observacoes,
            ativo,
        });
    }
    copyWith({
        id,
        descricao,
        observacoes,
        ativo,
    }: {
        id?: number;
        descricao?: string;
        observacoes?: string;
        ativo?: boolean;
    }): CategoryContratosEntity {
        return new CategoryContratosEntity({
            id: id ?? this.id,
            descricao: descricao ?? this.descricao,
            observacoes: observacoes ?? this.observacoes,
            ativo: ativo ?? this.ativo,
        });
    }
}