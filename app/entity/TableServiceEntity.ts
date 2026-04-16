export class TableService {
    id!: number;
    descricao!: string;
    codigo!: string;
    constructor({
        id,
        descricao,
        codigo

    }: {
        id: number;
        descricao: string;
        codigo?: string;
    }) {
        Object.assign(this, {
            id,
            descricao,
            codigo
        });
    }

    copyWith({
        id,
        descricao,
        codigo
    }: {
        id?: number;
        descricao?: string;
        codigo?: string;


    }): TableService {
        return new TableService({
            id: id ?? this.id,
            descricao: descricao ?? this.descricao,
            codigo: codigo ?? this.codigo,

        });
    }
}
