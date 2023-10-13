import React from 'react';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { useLoans } from '@contexts';

export const useRemainAmountFetcher = () => {
    const { loan } = useLoans();
    const { transactionRepository } = useDatabaseConnection();
    const [state, setState] = React.useState({ amount: 0, isLoading: false });

    const loadData = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, isLoading: true }));
        const amount = (await transactionRepository.getRemainPaymentAmount(loan.id)).amount || 0;
        setState((prevState) => ({ ...prevState, isLoading: false, amount }));
    }, [loan.id, transactionRepository]);

    React.useEffect(() => {
        (async () => await loadData())();
    }, [loadData]);

    return { ...state, fetch: loadData };
};
