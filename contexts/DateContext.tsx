import React from 'react';

export const DateContext = React.createContext({
    date: new Date(),
    updateDate: (date: Date) => {
        console.log(date);
    },
});

export const DateProvider: React.FunctionComponent = ({ children }) => {
    const [state, setState] = React.useState({ date: new Date() });

    const updateDate = React.useCallback((date: Date) => {
        setState((prevState) => ({ ...prevState, date }));
    }, []);

    return <DateContext.Provider value={{ ...state, updateDate }}>{children}</DateContext.Provider>;
};

export const useDate = () => {
    return React.useContext(DateContext);
};
