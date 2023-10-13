import React from 'react';
import { Template } from '@interfaces';

export const TemplateContext = React.createContext<{
    template: Template | undefined;
    onSelect: (template: Template) => void;
}>({
    onSelect: (template: Template): void => {
        console.log({ template });
    },
    template: undefined,
});

export const TemplateProvider: React.FunctionComponent = ({ children }) => {
    const [state, setState] = React.useState<{ template: Template | undefined }>({ template: undefined });

    const onSelect = React.useCallback((template: Template) => {
        setState((prevState) => ({ ...prevState, template }));
    }, []);

    return <TemplateContext.Provider value={{ ...state, onSelect }}>{children}</TemplateContext.Provider>;
};

export const useTemplate = () => {
    return React.useContext(TemplateContext);
};
