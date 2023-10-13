import React from 'react';
import * as InAppPurchases from 'expo-in-app-purchases';
import { Platform } from 'react-native';
import PurchaseStorage from '@utils/PurchaseStorage';
import { useApplication } from '@contexts/ApplicationContext';

const IAP_SKUS = Platform.select({
    ios: ['app.korttouk.mobile.full'],
    android: ['app.korttouk.mobile.full'],
});

export const IAPContext: React.Context<{ products: InAppPurchases.IAPItemDetails[]; processing: boolean }> =
    React.createContext({
        products: [],
        processing: false,
    });

export const IAPProvider: React.FunctionComponent = ({ children }) => {
    const { setFullVersion } = useApplication();
    const [state, setState] = React.useState<{
        products: InAppPurchases.IAPItemDetails[];
        processing: boolean;
    }>({
        products: [],
        processing: false,
    });
    const getProducts = React.useCallback(async () => {
        const { responseCode, results } = await InAppPurchases.getProductsAsync(IAP_SKUS);

        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            setState((prevState) => ({ ...prevState, products: results }));
        } else {
            setState((prevState) => ({ ...prevState, products: [] }));
        }
    }, []);

    const processNewPurchase = React.useCallback(
        async (purchase: InAppPurchases.InAppPurchase) => {
            const { productId, orderId, purchaseTime } = purchase;
            await PurchaseStorage.setFullVersion();
            await PurchaseStorage.setPurchaseInformation({ purchaseTime, productId, orderId });
            setFullVersion();
        },
        [setFullVersion],
    );

    const initIAPAndEventListeners = React.useCallback(async () => {
        try {
            await InAppPurchases.connectAsync();
        } catch (e) {
            console.error(e);
        }

        InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {
            if (responseCode === InAppPurchases.IAPResponseCode.OK) {
                results.forEach(async (purchase) => {
                    if (!purchase.acknowledged) {
                        await processNewPurchase(purchase);
                        await InAppPurchases.finishTransactionAsync(purchase, true);
                    }
                });
            } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
                console.log('User canceled the transaction');
            } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
                console.log('User does not have permissions to buy but requested parental approval (iOS only)');
            } else {
                console.warn(`Something went wrong with the purchase. Received errorCode ${errorCode}`);
            }
            setState((prevState) => ({ ...prevState, processing: false }));
        });
        await getProducts();
    }, [getProducts, processNewPurchase]);

    React.useEffect(() => {
        (async () => initIAPAndEventListeners())();
    }, [initIAPAndEventListeners]);

    return <IAPContext.Provider value={{ ...state }}>{children}</IAPContext.Provider>;
};

export const useIAP = () => React.useContext(IAPContext);
