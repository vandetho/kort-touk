import React from 'react';
import { Animated, View } from 'react-native';
import { Header, TransactionList } from './components';

interface LoanProps {}

const LoanComponent: React.FunctionComponent<LoanProps> = () => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    return (
        <View style={{ flex: 1 }}>
            <Header animatedValue={animatedValue} />
            <TransactionList
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                    useNativeDriver: true,
                })}
            />
        </View>
    );
};

const Loan = React.memo(LoanComponent);

export default Loan;
