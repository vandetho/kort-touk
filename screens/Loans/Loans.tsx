import React from 'react';
import { Animated, View } from 'react-native';
import { Header, LoanList, NewLoanButton } from './components';

interface LoansProps {}

const LoansComponent: React.FunctionComponent<LoansProps> = () => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    return (
        <View style={{ flex: 1 }}>
            <Header animatedValue={animatedValue} />
            <LoanList
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                    useNativeDriver: true,
                })}
            />
            <NewLoanButton animatedValue={animatedValue} />
        </View>
    );
};

const Loans = React.memo(LoansComponent);

export default Loans;
