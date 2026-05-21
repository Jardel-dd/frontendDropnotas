'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

const AcessoNegadoPage: React.FC = () => {
    const searchParams = useSearchParams();
    const from = searchParams.get('from');

    return (
        <div className="card styled-container-main-all-routes p-4">
            <div className="flex flex-column gap-3">
                <h2 className="m-0">Acesso atualizado</h2>
                <p className="m-0">
                    Suas permissoes foram atualizadas e esta tela nao esta mais disponivel para o seu perfil atual.
                </p>
                {from ? (
                    <p className="m-0 text-color-secondary">
                        Ultima rota bloqueada: <strong>{from}</strong>
                    </p>
                ) : null}
                <p className="m-0 text-color-secondary">
                    O menu lateral ja foi sincronizado. Selecione outra area liberada ou fale com um administrador caso esse acesso devesse continuar ativo.
                </p>
            </div>
        </div>
    );
};

export default AcessoNegadoPage;
