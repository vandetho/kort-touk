import React from 'react';
import { Animated, FlatList, SafeAreaView, useWindowDimensions, View } from 'react-native';
import { Currency } from '@interfaces';
import { LoanInformation, PeriodicPayment } from './components';

type StepView = {
    component: JSX.Element;
};

interface NewLoanProps {}

const NewLoanComponent: React.FunctionComponent<NewLoanProps> = () => {
    const { width } = useWindowDimensions();
    const flatListRef = React.useRef<FlatList>(null);
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const [state, setState] = React.useState<{
        name: string;
        numberOfMonth: string;
        startedOn: Date;
        currency: Currency;
        fixedAmount: boolean;
        debit: boolean;
        amount: string;
        activeStep: number;
    }>(() => {
        const startedOn = new Date();
        startedOn.setMonth(startedOn.getMonth() + 1, 1);
        return {
            name: '',
            currency: 'USD',
            fixedAmount: true,
            debit: true,
            numberOfMonth: '',
            startedOn,
            amount: '',
            activeStep: 1,
        };
    });

    React.useEffect(() => {
        if (state.fixedAmount) {
            Animated.timing(animatedValue, { toValue: 0, useNativeDriver: true }).start();
            return;
        }
        Animated.timing(animatedValue, { toValue: 1, useNativeDriver: true }).start();
    }, [animatedValue, state.fixedAmount]);

    const onFixedAmount = React.useCallback((fixedAmount: boolean) => {
        setState((prevState) => ({ ...prevState, fixedAmount }));
    }, []);

    const onSave = React.useCallback(
        (name: string, numberOfMonth: string, debit: boolean, startedOn: Date, currency: Currency) => {
            setState((prevState) => ({
                ...prevState,
                name,
                currency,
                numberOfMonth,
                debit,
                startedOn,
                activeStep: prevState.activeStep + 1,
            }));
        },
        [],
    );

    React.useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index: state.activeStep - 1, animated: true });
        }
    }, [state.activeStep]);

    const onPressBack = React.useCallback(() => {
        setState((prevState) => ({ ...prevState, activeStep: prevState.activeStep - 1 }));
    }, []);

    const data = React.useMemo<StepView[]>(
        () => [
            {
                component: <LoanInformation {...state} onFixedAmount={onFixedAmount} onSave={onSave} />,
            },
            {
                component: <PeriodicPayment {...state} onPressBack={onPressBack} />,
            },
        ],
        [onFixedAmount, onPressBack, onSave, state],
    );

    const renderItem = React.useCallback(({ item }: { item: StepView }) => item.component, []);

    const keyExtractor = React.useCallback((_, index: number) => `new-load-step-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({ index, length: width, offset: width * index }),
        [width],
    );

    return (
        <SafeAreaView>
            <View style={{ paddingHorizontal: 20 }}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    horizontal
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={keyExtractor}
                    getItemLayout={getItemLayout}
                    ref={flatListRef}
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const NewLoan = React.memo(NewLoanComponent);

export default NewLoan;
