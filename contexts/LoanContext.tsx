import React from 'react';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import Transaction from '@models/Transaction';
import { Loan } from '@interfaces';

export const LoanContext = React.createContext<{
    isLoading: boolean;
    isLoadingMore: boolean;
    loan: Loan | undefined;
    loans: Loan[];
    index: number | undefined;
    onSelect: (loan: Loan | undefined, index: number | undefined) => void;
    addLoan: (loan: Loan) => void;
    onUpdate: (loans: Loan[]) => void;
    refreshCurrentLoan: () => void;
    fetch: () => void;
    fetchMore: () => void;
}>({
    isLoading: false,
    isLoadingMore: false,
    loan: undefined,
    loans: [],
    index: undefined,
    onSelect: (loan: Loan | undefined, index: number | undefined) => {
        console.log({ loan, index });
    },
    addLoan: (loan: Loan) => {
        console.log({ loan });
    },
    onUpdate: (loans: Loan[]) => {
        console.log({ loans });
    },
    refreshCurrentLoan: () => {
        console.log();
    },
    fetch: () => {
        console.log();
    },
    fetchMore: () => {
        console.log();
    },
});

export const LoanProvider: React.FunctionComponent = ({ children }) => {
    const [state, setState] = React.useState<{
        loans: Loan[];
        loan: Loan | undefined;
        index: number | undefined;
        isLoading: boolean;
        isLoadingMore: boolean;
    }>({
        isLoading: false,
        isLoadingMore: false,
        loan: undefined,
        index: undefined,
        loans: [],
    });
    const { projectRepository, transactionRepository } = useDatabaseConnection();

    const loadData = React.useCallback(async () => {
        const projects = await projectRepository.getLoans();
        const transactions: { [key: string]: Transaction | undefined } = {};
        const projectIds = projects.map((project) => project.id);
        (await transactionRepository.getNextPayment(projectIds)).forEach((transaction) => {
            transactions[transaction.project.id] = transaction;
        });
        const remains: { [key: string]: number | undefined } = {};
        (await transactionRepository.getRemainAmounts(projectIds)).forEach((item) => {
            remains[item.projectId] = item.amount;
        });
        const loans = [];
        projects.forEach((project) =>
            loans.push(
                new Loan({ ...project, nextTransaction: transactions[project.id], remains: remains[project.id] }),
            ),
        );
        setState((prevState) => ({ ...prevState, loans }));
    }, [projectRepository, transactionRepository]);

    const loadMoreData = React.useCallback(async () => {
        const projects = await projectRepository.getLoans();
        const transactions: { [key: string]: Transaction | undefined } = {};
        const projectIds = projects.map((project) => project.id);
        (await transactionRepository.getNextPayment(projectIds)).forEach((transaction) => {
            transactions[transaction.project.id] = transaction;
        });
        const remains: { [key: string]: number | undefined } = {};
        (await transactionRepository.getRemainAmounts(projectIds)).forEach((item) => {
            remains[item.projectId] = item.amount;
        });
        const loans = [];
        projects.forEach((project) =>
            loans.push(
                new Loan({ ...project, nextTransaction: transactions[project.id], remains: remains[project.id] }),
            ),
        );
        setState((prevState) => ({ ...prevState, loans }));
    }, [projectRepository, transactionRepository]);

    React.useEffect(() => {
        (async () => await loadData())();
    }, [loadData]);

    const addLoan = React.useCallback(
        (loan: Loan) => {
            const loans = [...state.loans];
            loans.unshift(loan);
            setState((prevState) => ({ ...prevState, loan, loans }));
        },
        [state.loans],
    );

    const onSelect = React.useCallback((loan: Loan | undefined, index: number | undefined) => {
        setState((prevState) => ({ ...prevState, loan, index }));
    }, []);

    const onUpdate = React.useCallback((loans: Loan[]) => {
        setState((prevState) => ({ ...prevState, loans }));
    }, []);

    const refreshCurrentLoan = React.useCallback(() => {}, []);

    return (
        <LoanContext.Provider
            value={{
                ...state,
                addLoan,
                onSelect,
                refreshCurrentLoan,
                onUpdate,
                fetch: loadData,
                fetchMore: loadMoreData,
            }}
        >
            {children}
        </LoanContext.Provider>
    );
};

export const useLoans = () => {
    return React.useContext(LoanContext);
};
