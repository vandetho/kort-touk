import React from 'react';
import PaymentMethod from '@models/PaymentMethod';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';

export const PaymentMethodContext = React.createContext<{
    allPaymentMethods: PaymentMethod[];
    paymentMethods: PaymentMethod[];
    fetchAll: () => void;
    addPaymentMethod: (paymentMethod: PaymentMethod) => void;
    onUpdateSelectedPaymentMethods: (paymentMethods: PaymentMethod[]) => void;
}>({
    allPaymentMethods: [],
    paymentMethods: [],
    fetchAll: () => {
        console.log({ context: 'PaymentMethodContext', functionName: 'fetchAll' });
    },
    addPaymentMethod: (paymentMethod: PaymentMethod) => {
        console.log({ context: 'PaymentMethodContext', functionName: 'addPaymentMethod', paymentMethod });
    },
    onUpdateSelectedPaymentMethods: (paymentMethods: PaymentMethod[]) => {
        console.log({
            context: 'PaymentMethodContext',
            functionName: 'onUpdateSelectedPaymentMethods',
            paymentMethods,
        });
    },
});

export const PaymentMethodProvider: React.FunctionComponent = ({ children }) => {
    const { paymentMethodRepository } = useDatabaseConnection();
    const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>([]);
    const [allPaymentMethods, setAllPaymentMethods] = React.useState<PaymentMethod[]>([]);

    const fetchAll = React.useCallback(() => {
        paymentMethodRepository.getAll().then(setAllPaymentMethods);
    }, [paymentMethodRepository]);

    React.useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const onUpdateSelectedPaymentMethods = React.useCallback((paymentMethods: PaymentMethod[]) => {
        setPaymentMethods(paymentMethods);
    }, []);

    const addPaymentMethod = React.useCallback(
        (paymentMethod: PaymentMethod) => {
            const paymentMethods = [...allPaymentMethods, paymentMethod];
            setAllPaymentMethods(paymentMethods);
        },
        [allPaymentMethods],
    );

    return (
        <PaymentMethodContext.Provider
            value={{
                allPaymentMethods,
                paymentMethods,
                fetchAll,
                addPaymentMethod,
                onUpdateSelectedPaymentMethods,
            }}
        >
            {children}
        </PaymentMethodContext.Provider>
    );
};

export const usePaymentMethods = () => {
    return React.useContext(PaymentMethodContext);
};
