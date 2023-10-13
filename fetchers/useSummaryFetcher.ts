import React from 'react';
import { useSearch } from '@contexts';
import { Summary } from '@interfaces';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { useTheme } from '@react-navigation/native';

export const useSummaryFetcher = () => {
    const { colors } = useTheme();
    const { transactionRepository } = useDatabaseConnection();
    const { name, from, paymentMethod, to, category } = useSearch();
    const [state, setState] = React.useState<{
        errorMessage: string | undefined;
        isLoading: boolean;
        summaries: Summary[];
    }>({
        isLoading: false,
        errorMessage: undefined,
        summaries: [],
    });

    const fetch = React.useCallback(
        async (project: string | undefined) => {
            setState((prevState) => ({ ...prevState, isLoading: true }));
            const balances = await transactionRepository.getSummariesByCriteria({
                name,
                from,
                project: project,
                category: category?.id,
                to,
                paymentMethod: paymentMethod?.id,
            });
            const summaries = balances.map<Summary>((balance) => {
                return {
                    debit: balance.debit,
                    amount: balance.debit ? -balance.amount : balance.amount,
                    color: balance.color,
                    name: balance.name,
                    legendFontColor: colors.text,
                };
            });
            setState((prevState) => ({ ...prevState, isLoading: false, summaries }));
        },
        [category?.id, colors.text, from, name, paymentMethod?.id, to, transactionRepository],
    );

    return { ...state, fetch };
};
