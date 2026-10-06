import { NextResponse } from 'next/server';

type MetaEventRequestBody = {
    event_name?: string;
    event_time?: number;
    event_source_url?: string;
    action_source?: 'website' | 'app' | 'phone_call' | 'chat' | 'physical_store' | 'system_generated' | 'email' | 'other';
    user_data?: Record<string, unknown>;
    custom_data?: Record<string, unknown>;
};

const jsonNoStore = (body: unknown, status = 200) =>
    NextResponse.json(body, {
        status,
        headers: {
            'Cache-Control': 'no-store'
        }
    });

export async function POST(request: Request) {
    const pixelId = process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;
    const apiVersion = process.env.META_API_VERSION ?? 'v21.0';

    if (!pixelId || !accessToken) {
        return jsonNoStore(
            {
                message: 'As variaveis META_PIXEL_ID e META_ACCESS_TOKEN precisam estar configuradas no servidor.'
            },
            500
        );
    }

    let body: MetaEventRequestBody | null = null;

    try {
        body = (await request.json()) as MetaEventRequestBody;
    } catch {
        return jsonNoStore({ message: 'Payload inválido para envio do evento ao Meta.' }, 400);
    }

    if (!body?.event_name?.trim()) {
        return jsonNoStore({ message: 'event_name e obrigatorio.' }, 400);
    }

    const metaPayload = {
        data: [
            {
                event_name: body.event_name.trim(),
                event_time: body.event_time ?? Math.floor(Date.now() / 1000),
                action_source: body.action_source ?? 'website',
                event_source_url: body.event_source_url,
                user_data: body.user_data ?? {},
                custom_data: body.custom_data ?? {}
            }
        ]
    };

    const endpoint = `https://graph.facebook.com/${apiVersion}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(metaPayload),
            cache: 'no-store'
        });

        const responseBody = await response.json();

        if (!response.ok) {
            return jsonNoStore(
                {
                    message: 'O Meta rejeitou o evento.',
                    meta: responseBody
                },
                response.status
            );
        }

        return jsonNoStore({
            message: 'Evento enviado ao Meta com sucesso.',
            meta: responseBody
        });
    } catch (error) {
        return jsonNoStore(
            {
                message: 'Falha ao enviar o evento ao Meta.',
                error: error instanceof Error ? error.message : 'Erro desconhecido.'
            },
            500
        );
    }
}
