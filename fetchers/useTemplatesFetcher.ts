import React from 'react';
import Template from '@models/Template';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';

export const useTemplatesFetcher = () => {
    const { templateRepository } = useDatabaseConnection();
    const [state, setState] = React.useState<{
        errorMessage: string | undefined;
        isLoading: boolean;
        templates: Template[];
        totalRows: number;
        offset: number;
    }>({
        isLoading: false,
        errorMessage: undefined,
        templates: [],
        offset: 0,
        totalRows: 0,
    });

    const loadData = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, isLoading: true, errorMessage: undefined }));
        const templates = await templateRepository.getAll(0, 10);
        const totalRows = await templateRepository.count();
        setState((prevState) => ({ ...prevState, isLoading: false, templates, totalRows, offset: 10 }));
    }, [templateRepository]);

    const loadMore = React.useCallback(async () => {
        if (state.totalRows > state.offset) {
            setState((prevState) => ({ ...prevState, isLoading: true, errorMessage: undefined }));
            const templates = await templateRepository.getAll(state.offset, 10);
            setState((prevState) => ({ ...prevState, isLoading: false, templates, offset: 10 }));
        }
    }, [state.offset, state.totalRows, templateRepository]);

    return { ...state, reload: loadData, loadMore };
};
