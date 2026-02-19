export class TableService {
    id!: number;
    descricao!: string;
    constructor({
        id,
        descricao,

    }: {
        id: number;
        descricao: string;
    }) {
        Object.assign(this, {
            id,
            descricao,
        });
    }

    copyWith({
        id,
        descricao,
    }: {
        id?: number;
        descricao?: string;

    }): TableService {
        return new TableService({
            id: id ?? this.id,
            descricao: descricao ?? this.descricao,
        });
    }
}
