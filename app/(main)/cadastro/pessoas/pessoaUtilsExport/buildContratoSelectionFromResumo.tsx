import { ContratoEntity } from "@/app/entity/ContratoEntity";

export const buildContratoSelectionFromResumo = (contratoResumo: Partial<ContratoEntity> | null | undefined, contratoId?: number | null) => {
    const resolvedContratoId = contratoResumo?.id ?? contratoId ?? null;
    if (!resolvedContratoId) {
        return null;
    }
    return new ContratoEntity({
        id: resolvedContratoId,
        descricao: contratoResumo?.descricao ?? '',
        valor_servico: contratoResumo?.valor_servico ?? null,
        periodicidade: contratoResumo?.periodicidade ?? '',
        emitir_boleto: contratoResumo?.emitir_boleto ?? false,
        enviar_email: contratoResumo?.enviar_email ?? false,
        enviar_whatsapp: contratoResumo?.enviar_whatsapp ?? false,
        id_servico: contratoResumo?.id_servico ?? null,
        id_empresa: contratoResumo?.id_empresa ?? null,
        id_categoria_contrato: contratoResumo?.id_categoria_contrato ?? null,
        id_forma_pagamento: contratoResumo?.id_forma_pagamento ?? null,
        id_clientes_contrato: contratoResumo?.id_clientes_contrato ?? [0]
    });
};