export const MOBILE_LOAD_MORE_PAGE_SIZE = 20;

type PaginationPageable = {
    pageNumber?: number;
    pageSize?: number;
    [key: string]: any;
};

export type PaginatedResponse<T> = {
    content?: T[];
    totalElements?: number;
    totalPages?: number;
    last?: boolean;
    first?: boolean;
    number?: number;
    numberOfElements?: number;
    size?: number;
    pageable?: PaginationPageable;
    [key: string]: any;
};

const getItemKey = <T extends Record<string, any>>(item: T, index: number) => {
    const candidateKey = item.id ?? item.codigo ?? item.cnpj ?? item.cpf ?? item.numero;

    if (candidateKey !== undefined && candidateKey !== null) {
        return String(candidateKey);
    }

    return `${index}-${JSON.stringify(item)}`;
};

export const mergePaginatedContent = <T extends Record<string, any>>(
    current: PaginatedResponse<T> | null | undefined,
    next: PaginatedResponse<T> | null | undefined,
    pageNumber: number
) => {
    if (!next) {
        return current ?? null;
    }

    if (pageNumber <= 0) {
        return {
            ...next,
            pageable: {
                ...next.pageable,
                pageNumber
            },
            number: pageNumber,
            numberOfElements: Array.isArray(next.content) ? next.content.length : 0
        };
    }

    const currentContent = Array.isArray(current?.content) ? current.content : [];
    const nextContent = Array.isArray(next.content) ? next.content : [];
    const mergedMap = new Map<string, T>();

    currentContent.forEach((item, index) => {
        mergedMap.set(getItemKey(item, index), item);
    });

    nextContent.forEach((item, index) => {
        mergedMap.set(getItemKey(item, currentContent.length + index), item);
    });

    const mergedContent = Array.from(mergedMap.values());

    return {
        ...next,
        content: mergedContent,
        pageable: {
            ...next.pageable,
            pageNumber
        },
        number: pageNumber,
        numberOfElements: mergedContent.length,
        first: pageNumber === 0
    };
};

export const hasMoreMobileContent = <T extends Record<string, any>>(pagination: PaginatedResponse<T> | null | undefined) => {
    const currentLength = Array.isArray(pagination?.content) ? pagination.content.length : 0;

    if (typeof pagination?.totalElements === 'number') {
        return currentLength < pagination.totalElements;
    }

    return pagination?.last === false;
};

export const rebuildLoadedMobilePages = async <T extends Record<string, any>>({
    lastLoadedPage,
    fetchPage
}: {
    lastLoadedPage: number;
    fetchPage: (pageNumber: number) => Promise<PaginatedResponse<T> | null | undefined>;
}) => {
    let mergedResponse: PaginatedResponse<T> | null = null;

    for (let currentPage = 0; currentPage <= lastLoadedPage; currentPage += 1) {
        const nextPage = await fetchPage(currentPage);

        if (!nextPage) {
            continue;
        }

        mergedResponse = mergePaginatedContent(mergedResponse, nextPage, currentPage);

        if (nextPage.last) {
            break;
        }
    }

    return mergedResponse;
};
