import React from 'react';
import Transaction from '@models/Transaction';

export const TransactionContext = React.createContext<{
    transaction: Transaction | undefined;
    onSelect: (transaction: Transaction) => void;
}>({
    onSelect: (transaction: Transaction) => {
        console.log({ transaction });
    },
    transaction: undefined,
});

export const TransactionProvider: React.FunctionComponent = ({ children }) => {
    const [state, setState] = React.useState<{ transaction: Transaction | undefined }>({ transaction: undefined });

    const onSelect = (transaction: Transaction) => {
        setState((prevState) => ({ ...prevState, transaction }));
    };

    return <TransactionContext.Provider value={{ ...state, onSelect }}>{children}</TransactionContext.Provider>;
};

export const useTransaction = () => {
    return React.useContext(TransactionContext);
};
