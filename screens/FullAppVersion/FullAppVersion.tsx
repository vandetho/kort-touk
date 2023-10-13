import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { CustomLinearGradient, GradientIcon, Header, Text } from '@components';
import { useRoute } from '@react-navigation/native';
import * as InAppPurchase from 'expo-in-app-purchases';
import { useTranslation } from 'react-i18next';
import { useIAP } from '@contexts';

const SPACING = 5;

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        marginHorizontal: 20,
    },
});

interface FullAppVersionProps {}

const FullAppVersion = React.memo<FullAppVersionProps>(() => {
    const route = useRoute();
    const { t } = useTranslation();
    const { products } = useIAP();
    const { height } = useWindowDimensions();
    const [scrollEnabled, setScrollEnabled] = React.useState(false);

    const renderHeader = React.useCallback(() => {
        if (route.params) {
            return (
                <View style={{ position: 'absolute', left: 20, top: 20, zIndex: 1 }}>
                    <Header goBackIcon="times" goBackTitle={t('close')} />
                </View>
            );
        }
        return null;
    }, [route.params, t]);

    const onContentSizeChange = React.useCallback(
        (_, h: number) => {
            setScrollEnabled(h > height);
        },
        [height],
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {renderHeader()}
            <ScrollView
                scrollEnabled={scrollEnabled}
                onContentSizeChange={onContentSizeChange}
                contentContainerStyle={{ flexGrow: 1, padding: 20, paddingTop: 50 }}
            >
                <Text bold style={{ fontSize: 20, textAlign: 'center', paddingVertical: 20 }}>
                    Get full version now
                </Text>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={require('@assets/icon.png')}
                        resizeMode="contain"
                        style={{ height: 150, width: 150, borderRadius: 30 }}
                    />
                </View>
                <View style={{ paddingTop: 50 }}>
                    <View style={{ paddingVertical: SPACING, flexDirection: 'row' }}>
                        <GradientIcon name="clone" />
                        <Text style={styles.text}>Unlimited Projects</Text>
                    </View>
                    <View style={{ paddingVertical: SPACING, flexDirection: 'row' }}>
                        <GradientIcon name="shapes" />
                        <Text style={styles.text}>Add custom categories</Text>
                    </View>
                    <View style={{ paddingVertical: SPACING, flexDirection: 'row' }}>
                        <GradientIcon name="shapes" />
                        <Text style={styles.text}>Add custom payment methods</Text>
                    </View>
                    <View style={{ paddingVertical: SPACING, flexDirection: 'row' }}>
                        <GradientIcon name="search-dollar" />
                        <Text style={styles.text}>Constant monthly expense tracking</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={async () => {
                        await InAppPurchase.purchaseItemAsync(products[0].productId);
                    }}
                    style={{ marginVertical: 20 }}
                >
                    <CustomLinearGradient
                        style={{ height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Text>Buy Now For $4.99</Text>
                    </CustomLinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
});

export default FullAppVersion;
