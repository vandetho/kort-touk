import React from 'react';
import { Alert, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import { PRIMARY } from '@theme';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '../../Text';

const styles = StyleSheet.create({
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    buttonIconContainer: {
        marginHorizontal: 10,
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    buttonIcon: {
        width: 40,
        height: 40,
        borderRadius: 25 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginRight: 20,
    },
});

interface GalleryOrCameraButtonsProps {
    onSelectImage: (uri: string) => void;
}

const GalleryOrCameraButtons = React.memo<GalleryOrCameraButtonsProps>(({ onSelectImage }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const onGallery = React.useCallback(async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert(t('gallery_permission'));
            return;
        }

        const pickedImage = await ImagePicker.launchImageLibraryAsync({
            quality: 0,
        });

        if (pickedImage.cancelled !== true) {
            onSelectImage(pickedImage.uri);
        }
    }, [onSelectImage, t]);

    const onCamera = React.useCallback(async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert(t('camera_permission'));
            return;
        }

        const pickedImage = await ImagePicker.launchCameraAsync({
            quality: 0,
        });

        if (pickedImage.cancelled !== true) {
            onSelectImage(pickedImage.uri);
        }
    }, [onSelectImage, t]);

    return (
        <View style={styles.buttons}>
            <View style={{ marginLeft: 20 }}>
                <Text style={{ fontSize: 16, paddingTop: 10, fontWeight: 'bold' }}>{t('images')}</Text>
            </View>
            <View style={styles.buttonIconContainer}>
                <TouchableWithoutFeedback onPress={onGallery}>
                    <View
                        style={[
                            styles.buttonIcon,
                            {
                                marginLeft: 15,
                                backgroundColor: colors.card,
                            },
                        ]}
                    >
                        <MaterialIcons name="image" color={PRIMARY} size={26} />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={onCamera}>
                    <View
                        style={[
                            styles.buttonIcon,
                            {
                                backgroundColor: colors.card,
                            },
                        ]}
                    >
                        <MaterialIcons name="photo-camera" color={PRIMARY} size={26} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
});

export default GalleryOrCameraButtons;
