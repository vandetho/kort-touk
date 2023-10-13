import React from 'react';
import Transaction from '@models/Transaction';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';

export type TransactionCriteria = {
    project: string | undefined;
    name?: string;
    category?: string;
    paymentMethod?: string;
    from?: number;
    to?: number;
};

export const useTransactionsFetcher = () => {
    const { transactionRepository } = useDatabaseConnection();
    const [state, setState] = React.useState<{
        errorMessage: string | undefined;
        isLoading: boolean;
        isLoadingMore: boolean;
        transactions: Transaction[];
        totalRows: number;
        offset: number;
    }>({
        isLoading: false,
        isLoadingMore: false,
        errorMessage: undefined,
        transactions: [],
        totalRows: 0,
        offset: 0,
    });

    const fetchTransactions = React.useCallback(
        async (criteria: TransactionCriteria) => {
            setState((prevState) => ({ ...prevState, isLoading: true }));
            const transactions = await transactionRepository.getByCriteria(criteria, 0);
            const totalRows = await transactionRepository.countByCriteria(criteria);
            setState((prevState) => ({ ...prevState, isLoading: false, transactions, totalRows, offset: 10 }));
        },
        [transactionRepository],
    );

    const fetchMore = React.useCallback(
        async (criteria: TransactionCriteria) => {
            if (state.offset < state.totalRows) {
                setState((prevState) => ({ ...prevState, isLoadingMore: true }));
                const transactions = await transactionRepository.getByCriteria(criteria, state.offset);
                const totalRows = await transactionRepository.countByCriteria(criteria);
                setState((prevState) => ({
                    ...prevState,
                    isLoadingMore: false,
                    transactions: [...prevState.transactions, ...transactions],
                    totalRows,
                    offset: prevState.offset + 10,
                }));
            }
        },
        [state.offset, state.totalRows, transactionRepository],
    );

    return { ...state, fetchTransactions, fetchMore };
};
