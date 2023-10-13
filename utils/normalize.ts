import normalize from 'react-native-normalize';

export const normalizeWidth = (value: number): number => normalize(value, 'width');

export const normalizeHeight = (value: number): number => normalize(value, 'height');
