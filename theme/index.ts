import { DarkTheme as DefaultDarkTheme, DefaultTheme } from '@react-navigation/native';

export const PRIMARY = '#28ACEA';
export const SECONDARY = '#6BEEAA';
export const ERROR = '#F44336';
export const INFO = '#036CD5';
export const WARNING = '#DEB801';
export const SUCCESS = '#4CAF50';
export const DISABLED = '#DDDDDD';

export const DarkTheme = {
    ...DefaultDarkTheme,
    primary: PRIMARY,
};

export const LightTheme = {
    ...DefaultTheme,
    primary: PRIMARY,
};
