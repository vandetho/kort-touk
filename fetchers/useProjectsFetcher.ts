import React from 'react';
import { useTranslation } from 'react-i18next';
import Project from '@models/Project';

export const useProjectsFetcher = () => {
    const [state, setState] = React.useState<{
        errorMessage: string | undefined;
        isLoading: boolean;
        projects: Project[];
    }>({ errorMessage: undefined, isLoading: false, projects: [] });
    const { t } = useTranslation();

    const loadData = React.useCallback(async () => {
        let errorMessage: string | undefined = undefined;
        setState((prevState) => ({ ...prevState, errorMessage: undefined, isLoading: true }));
    }, []);

    React.useEffect(() => {
        (async () => await loadData())();
    }, [loadData]);

    return { ...state, reload: loadData };
};
