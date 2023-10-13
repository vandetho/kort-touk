import React from 'react';

export const PortalContext = React.createContext<{
    gates: { [key: string]: JSX.Element };
    teleport: (gateName: string, element: JSX.Element) => void;
}>({
    gates: {},
    teleport: () => {
        return;
    },
});

export const PortalProvider: React.FunctionComponent = ({ children }) => {
    const [state, setState] = React.useState({ gates: {} });

    const teleport = React.useCallback(
        (gateName: string, element: JSX.Element) =>
            setState((prevState) => ({ ...prevState, gates: { ...prevState.gates, [gateName]: element } })),
        [],
    );

    return <PortalContext.Provider value={{ ...state, teleport }}>{children}</PortalContext.Provider>;
};

interface PortalGateProps {
    gateName: string;
    children?: (teleport: (gateName: string, element: JSX.Element) => void) => JSX.Element;
}

export const PortalGate: React.FunctionComponent<PortalGateProps> = ({ gateName, children }) => {
    return (
        <PortalContext.Consumer>
            {(value) => {
                return (
                    <React.Fragment>
                        {value.gates[gateName]}
                        {children && children(value.teleport)}
                    </React.Fragment>
                );
            }}
        </PortalContext.Consumer>
    );
};
