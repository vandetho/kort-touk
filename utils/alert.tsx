import React from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-root-toast';
import Constants from 'expo-constants';

export const alert = (title: string, message: string, onPressOk?: () => void): Promise<void> => {
    return new Promise((resolve) => {
        Alert.alert(
            title,
            message,
            [
                {
                    text: 'Ok',
                    onPress: (): void => {
                        if (onPressOk) {
                            onPressOk();
                        }
                        resolve();
                    },
                },
            ],
            { cancelable: false },
        );
    });
};

export const confirm = (message: string, onPressOk?: () => void, onPressNo?: () => void): Promise<void> => {
    return new Promise((resolve) => {
        Alert.alert(
            'Confirmation',
            message,
            [
                {
                    text: 'Yes',
                    onPress: (): void => {
                        if (onPressOk) {
                            onPressOk();
                        }
                        resolve();
                    },
                },
                {
                    text: 'No',
                    onPress: (): void => {
                        if (onPressNo) {
                            onPressNo();
                        }
                        resolve();
                    },
                },
            ],
            { cancelable: false },
        );
    });
};

export const showToast = (message: string, position = Toast.positions.TOP, duration = 3000) => {
    Toast.show(message, {
        position,
        duration,
        animation: true,
        containerStyle: {
            marginTop: Constants.statusBarHeight,
        },
    });
};
