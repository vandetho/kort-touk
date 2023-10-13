import React from 'react';
import { useSearch } from '@contexts';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';

export const useProjectBalanceFetcher = () => {
    const { from, category, to, name, paymentMethod } = useSearch();
    const { transactionRepository } = useDatabaseConnection();
    const [state, setState] = React.useState<{
        errorMessage: string | undefined;
        isLoading: boolean;
        income: number;
        expense: number;
    }>({
        errorMessage: undefined,
        expense: 0,
        income: 0,
        isLoading: false,
    });

    const loadData = React.useCallback(
        async (project: string | undefined) => {
            let errorMessage: string | undefined = undefined;
            setState((prevState) => ({ ...prevState, errorMessage: undefined, isLoading: true }));
            const balances = await transactionRepository.getBalancesByCriteria({
                name,
                from,
                project: project,
                category: category?.id,
                to,
                paymentMethod: paymentMethod?.id,
            });
            setState((prevState) => ({
                ...prevState,
                income: balances?.income || 0,
                expense: balances?.expense || 0,
                errorMessage,
                isLoading: false,
            }));
        },
        [category?.id, from, name, paymentMethod?.id, to, transactionRepository],
    );

    return { ...state, reload: loadData };
};
