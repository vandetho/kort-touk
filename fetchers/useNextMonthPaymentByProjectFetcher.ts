import React from 'react';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { useLoans } from '@contexts';
import Transaction from '@models/Transaction';

export const useNextMonthPaymentByProjectFetcher = () => {
    const { transactionRepository } = useDatabaseConnection();
    const { loan } = useLoans();
    const [state, setState] = React.useState<{ transaction: Transaction; isLoading: boolean }>({
        transaction: undefined,
        isLoading: false,
    });

    const loadData = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, isLoading: true }));
        const transactions = await transactionRepository.getNextPayment([loan.id]);
        setState((prevState) => ({ ...prevState, isLoading: false, transaction: transactions[0] }));
    }, [loan, transactionRepository]);

    React.useEffect(() => {
        (async () => await loadData())();
    }, [loadData]);

    return { ...state, fetch: loadData };
};
