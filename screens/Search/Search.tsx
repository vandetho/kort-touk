import React from 'react';
import {
    Animated,
    Keyboard,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useSearch } from '@contexts';
import { CategoryPicker, DatePicker, Header, PaymentMethodPicker, TextField } from '@components';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation, useTheme } from '@react-navigation/native';
import Category from '@models/Category';
import PaymentMethod from '@models/PaymentMethod';

const SPACING = 10;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 60,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING,
    },
});

interface SearchProps {}

const Search: React.FunctionComponent<SearchProps> = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();
    const { from, category, to, paymentMethod, name, onReset, onSave } = useSearch();
    const [state, setState] = React.useState<{
        name: string;
        from: Date;
        to: Date;
        category: Category | undefined;
        paymentMethod: PaymentMethod | undefined;
    }>({
        category,
        from: new Date(from),
        paymentMethod,
        to: new Date(to),
        name,
    });

    const handleSearch = React.useCallback(() => {
        onSave({ ...state, from: state.from.getTime(), to: state.to.getTime() });
        navigation.goBack();
    }, [navigation, onSave, state]);

    const handleReset = React.useCallback(() => {
        onReset();
        navigation.goBack();
    }, [navigation, onReset]);

    const onChange = React.useCallback((value: any, name: string) => {
        setState((prevState) => ({ ...prevState, [name]: value }));
    }, []);
    const onScroll = React.useCallback(
        ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
            const y = nativeEvent.contentOffset.y;

            if (y >= 0 && y <= nativeEvent.contentSize.height - nativeEvent.layoutMeasurement.height) {
                animatedValue.setValue(y);
            }
        },
        [animatedValue],
    );

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                <Animated.View
                    style={{
                        backgroundColor: colors.background,
                        position: 'absolute',
                        zIndex: 1,
                        top: 20,
                        left: 20,
                        right: 20,
                        transform: [
                            {
                                translateY: Animated.diffClamp(animatedValue, 0, 60).interpolate({
                                    inputRange: [0, 60],
                                    outputRange: [0, -200],
                                }),
                            },
                        ],
                    }}
                >
                    <Header
                        goBackIcon="times"
                        goBackTitle={t('close')}
                        onMiddleButtonPress={handleReset}
                        headerMiddleIcon="redo"
                        headerMiddleTitle={t('reset')}
                        onRightButtonPress={handleSearch}
                        headerRightTitle={t('search')}
                        headerRightIcon="search"
                    />
                </Animated.View>
                <ScrollView scrollEventThrottle={8} bounces={false} onScroll={onScroll} style={styles.container}>
                    <TextField
                        label={t('name')}
                        name="name"
                        value={state.name}
                        startIcon={<MaterialIcons name="article" size={26} color={colors.text} />}
                        onChangeText={onChange}
                        returnKeyType="next"
                    />
                    <DatePicker value={state.from} name="from" label={t('from')} onChange={onChange} />
                    <DatePicker value={state.to} name="to" label={t('to')} onChange={onChange} />
                    <CategoryPicker selected={state.category} onValueChange={onChange} />
                    <PaymentMethodPicker selected={state.paymentMethod} onValueChange={onChange} />
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Search;
