import { BACKEND_BASE_URL } from '@/app/services/backendBaseUrl';

export const dynamic = 'force-dynamic';

type DownloadKind = 'pdf' | 'xml' | 'arquivos';

const DOWNLOAD_KIND_CONFIG: Record<
    DownloadKind,
    {
        buildPath: (notaId: string) => string;
        contentType: string;
        fallbackFileName: (notaId: string) => string;
    }
> = {
    pdf: {
        buildPath: (notaId) => `/nfse/${notaId}/pdf`,
        contentType: 'application/pdf',
        fallbackFileName: (notaId) => `nfse-${notaId}.pdf`
    },
    xml: {
        buildPath: (notaId) => `/nfse/${notaId}/xml`,
        contentType: 'application/xml',
        fallbackFileName: (notaId) => `nfse-${notaId}.xml`
    },
    arquivos: {
        buildPath: (notaId) => `/nfse/${notaId}/arquivos`,
        contentType: 'application/zip',
        fallbackFileName: (notaId) => `PDFeXML-nfse-${notaId}.zip`
    }
};

const sanitizeDownloadFileName = (value: string | null | undefined, fallback: string) => {
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

const isDownloadKind = (value: string): value is DownloadKind => value in DOWNLOAD_KIND_CONFIG;

export async function POST(request: Request) {
    let formData: FormData;

    try {
        formData = await request.formData();
    } catch {
        return textResponse('Dados invalidos para download da nota.', 400);
    }

    const notaId = String(formData.get('notaId') ?? '').trim();
    const kindValue = String(formData.get('kind') ?? '').trim();
    const token = String(formData.get('token') ?? '').trim();
    const rawFileName = String(formData.get('fileName') ?? '').trim();

    if (!notaId) {
        return textResponse('Identificador da nota nao informado.', 400);
    }

    if (!isDownloadKind(kindValue)) {
        return textResponse('Tipo de download invalido.', 400);
    }

    if (!token) {
        return textResponse('Sessao expirada. Faca login novamente.', 401);
    }

    const config = DOWNLOAD_KIND_CONFIG[kindValue];
    const backendUrl = `${BACKEND_BASE_URL}${config.buildPath(notaId)}`;

    let backendResponse: Response;

    try {
        backendResponse = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: config.contentType
            },
            cache: 'no-store'
        });
    } catch (error) {
        console.error('[nfse-download] Falha ao acessar backend:', error);
        return textResponse('Nao foi possivel acessar o arquivo da nota.', 502);
    }

    if (!backendResponse.ok) {
        let backendMessage = 'Nao foi possivel baixar o arquivo da nota.';

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
            console.error('[nfse-download] Falha ao ler retorno de erro:', error);
        }

        return textResponse(backendMessage, backendResponse.status);
    }

    const fileName = sanitizeDownloadFileName(rawFileName, config.fallbackFileName(notaId));
    const headers = new Headers();

    headers.set('Content-Type', backendResponse.headers.get('content-type') || config.contentType);
    headers.set('Content-Disposition', `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`);
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
