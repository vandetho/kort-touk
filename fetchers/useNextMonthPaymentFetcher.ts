import React from 'react';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';

export const useNextMonthPaymentFetcher = () => {
    const { transactionRepository } = useDatabaseConnection();
    const [state, setState] = React.useState({ expense: 0, income: 0, isLoading: false });

    const loadData = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, isLoading: true }));
        const balance = await transactionRepository.getNextMonthPayment();
        setState((prevState) => ({
            ...prevState,
            isLoading: false,
            expense: balance.expense || 0,
            income: balance.income || 0,
        }));
    }, [transactionRepository]);

    return { ...state, fetch: loadData };
};
