import { BACKEND_BASE_URL } from '@/app/services/backendBaseUrl';

export const dynamic = 'force-dynamic';

const PDF_CONTENT_TYPE = 'application/pdf';

const sanitizeFileName = (value: string | null | undefined, fallback: string) => {
    const normalizedValue = (value ?? '')
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[\\/:*?"<>|]/g, '')
        .replace(/[\r\n]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    return normalizedValue || fallback;
};

const extractBackendErrorMessage = (payload: any, fallback: string) => {
    if (!payload) {
        return fallback;
    }

    if (typeof payload === 'string') {
        return payload.trim() || fallback;
    }

    if (typeof payload?.message === 'string' && payload.message.trim()) {
        return payload.message.trim();
    }

    if (typeof payload?.mensagem === 'string' && payload.mensagem.trim()) {
        return payload.mensagem.trim();
    }

    return fallback;
};

const textResponse = (message: string, status: number) =>
    new Response(message, {
        status,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-store'
        }
    });

export async function POST(request: Request) {
    let formData: FormData;

    try {
        formData = await request.formData();
    } catch {
        return textResponse('Dados invalidos para visualizar a nota.', 400);
    }

    const notaId = String(formData.get('notaId') ?? '').trim();
    const token = String(formData.get('token') ?? '').trim();
    const rawFileName = String(formData.get('fileName') ?? '').trim();

    if (!notaId) {
        return textResponse('Identificador da nota nao informado.', 400);
    }

    if (!token) {
        return textResponse('Sessao expirada. Faca login novamente.', 401);
    }

    const backendUrl = `${BACKEND_BASE_URL}/nfse/${notaId}/pdf`;

    let backendResponse: Response;

    try {
        backendResponse = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: PDF_CONTENT_TYPE
            },
            cache: 'no-store'
        });
    } catch (error) {
        console.error('[nfse-view] Falha ao acessar backend:', error);
        return textResponse('Nao foi possivel abrir o PDF da nota.', 502);
    }

    if (!backendResponse.ok) {
        let backendMessage = 'Nao foi possivel abrir o PDF da nota.';

        try {
            const responseContentType = backendResponse.headers.get('content-type') ?? '';

            if (responseContentType.includes('application/json')) {
                const payload = await backendResponse.json();
                backendMessage = extractBackendErrorMessage(payload, backendMessage);
            } else {
                const rawText = await backendResponse.text();
                backendMessage = extractBackendErrorMessage(rawText, backendMessage);
            }
        } catch (error) {
            console.error('[nfse-view] Falha ao ler retorno de erro:', error);
        }

        return textResponse(backendMessage, backendResponse.status);
    }

    const fileName = sanitizeFileName(rawFileName, `nfse-${notaId}.pdf`);
    const headers = new Headers();

    headers.set('Content-Type', backendResponse.headers.get('content-type') || PDF_CONTENT_TYPE);
    headers.set('Content-Disposition', `inline; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`);
    headers.set('Cache-Control', 'no-store');

    const contentLength = backendResponse.headers.get('content-length');
    if (contentLength) {
        headers.set('Content-Length', contentLength);
    }

    return new Response(backendResponse.body, {
        status: 200,
        headers
    });
}
