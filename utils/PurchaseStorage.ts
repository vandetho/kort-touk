import * as SecureStore from 'expo-secure-store';

export default class PurchaseStorage {
    static setFullVersion = async () => {
        await SecureStore.setItemAsync('fullVersion', 'true');
    };

    static isFullVersion = async () => {
        const fullVersion = await SecureStore.getItemAsync('fullVersion');
        return fullVersion && fullVersion === 'true';
    };

    static setPurchaseInformation = async (information: {
        productId: string;
        orderId: string;
        purchaseTime: number;
    }) => {
        await SecureStore.setItemAsync('purchase_information', JSON.stringify(information));
    };
}
