import React from 'react';
import { endOfMonth, startOfMonth } from 'date-fns';
import { deepEqual } from '@utils';
import Category from '@models/Category';
import PaymentMethod from '@models/PaymentMethod';

export type Parameters = {
    name: string;
    category: Category | undefined;
    paymentMethod: PaymentMethod | undefined;
    from: number;
    to: number;
};

export const SearchContext = React.createContext<
    Parameters & {
        isSearch: boolean;
        onReset: () => void;
        onSave: (parameters: Parameters) => void;
    }
>({
    name: '',
    category: undefined,
    paymentMethod: undefined,
    from: startOfMonth(new Date()).getTime(),
    to: endOfMonth(new Date()).getTime(),
    isSearch: false,
    onReset: () => {},
    onSave: (parameters: Parameters) => {
        console.log(parameters);
    },
});

const DEFAULT_SEARCH = {
    name: '',
    category: undefined,
    paymentMethod: undefined,
    from: startOfMonth(new Date()).getTime(),
    to: endOfMonth(new Date()).getTime(),
};

export const SearchProvider: React.FunctionComponent = ({ children }) => {
    const [state, setState] = React.useState<{
        name: string;
        category: Category | undefined;
        paymentMethod: PaymentMethod | undefined;
        from: number;
        to: number;
        isSearch: boolean;
    }>({ ...DEFAULT_SEARCH, isSearch: false });

    const onReset = React.useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            ...DEFAULT_SEARCH,
            isSearch: false,
        }));
    }, []);
    const onSave = React.useCallback(
        (parameters: {
            name: string;
            category: Category | undefined;
            paymentMethod: PaymentMethod | undefined;
            from: number;
            to: number;
        }) => {
            setState((prevState) => ({
                ...prevState,
                ...parameters,
                isSearch: !deepEqual(DEFAULT_SEARCH, parameters),
            }));
        },
        [],
    );

    return <SearchContext.Provider value={{ ...state, onReset, onSave }}>{children}</SearchContext.Provider>;
};

export const useSearch = () => {
    return React.useContext(SearchContext);
};
