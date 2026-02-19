const formatValue = (value: string) => {
    let formatted = '';
    let i = 0;
    const mask = '99.999.999/9999-99';
    for (let j = 0; j < mask.length && i < value.length; j++) {
        if (mask[j] === '9') {
            formatted += value[i];
            i++;
        } else {
            formatted += mask[j];
        }
    }
    return formatted;
};

