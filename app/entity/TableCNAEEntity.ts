export class TableCNAEEntity {
    id!: number;
    descricao!: string;
    codigo!: string;
    constructor({
        id,
        descricao,
        codigo,

    }: {
        id: number;
        descricao: string;
        codigo: string;
    }) {
        Object.assign(this, {
            id,
            descricao,
            codigo,
        });
    }

    copyWith({
        id,
        descricao,
        codigo,
    }: {
        id?: number;
        descricao?: string;
        codigo?: string;

    }): TableCNAEEntity {
        return new TableCNAEEntity({
            id: id ?? this.id,
            descricao: descricao ?? this.descricao,
            codigo: codigo ?? this.codigo,

        });
    }
}
