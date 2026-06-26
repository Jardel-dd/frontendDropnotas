export const remocaoCaractereFiltro = (value: string): string => {
    return /^[\d./-]+$/.test(value)
        ? value.replace(/\D/g, '')
        : value;
};