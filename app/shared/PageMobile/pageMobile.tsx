export const buildMobilePickerPageResult = <T,>(data: any) => {
    const items = Array.isArray(data?.content) ? (data.content as T[]) : Array.isArray(data) ? (data as T[]) : [];
    const currentPage = Number(data?.number ?? data?.pageable?.pageNumber ?? 0);
    const totalPages = Number(data?.totalPages ?? 0);
    const hasMoreFromLastFlag = typeof data?.last === 'boolean' ? !data.last : null;
    const hasMoreFromTotalPages = totalPages > currentPage + 1;
    return {
        items,
        hasMore: hasMoreFromLastFlag ?? hasMoreFromTotalPages
    };
};