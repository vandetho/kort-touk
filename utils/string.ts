import 'intl';
import 'intl/locale-data/jsonp/en';

export const replaceSpace = (str: string): string => {
    return str.replace(/\u0020/, '\u00a0');
};

export const currencyFormat = (value: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('US', { style: 'currency', currency }).format(value);
};
