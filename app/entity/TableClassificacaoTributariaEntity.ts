export class TableClassificacaoTributariaEntity {
    id!: number;
    descricao!: string;
    codigo!: string;
    codigoCst!:string;
    constructor({
        id,
        descricao,
        codigo,
        codigoCst

    }: {
        id: number;
        descricao: string;
        codigo: string;
        codigoCst: string;

    }) {
        Object.assign(this, {
            id,
            descricao,
            codigo,
            codigoCst
        });
    }

    copyWith({
        id,
        descricao,
        codigo,
        codigoCst
    }: {
        id?: number;
        descricao?: string;
        codigo?: string;
        codigoCst?:string;

    }): TableClassificacaoTributariaEntity {
        return new TableClassificacaoTributariaEntity({
            id: id ?? this.id,
            descricao: descricao ?? this.descricao,
            codigo: codigo ?? this.codigo,
            codigoCst: codigoCst ?? this.codigoCst

        });
    }
}
