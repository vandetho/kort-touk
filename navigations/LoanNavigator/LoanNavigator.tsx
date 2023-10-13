import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { LoanScreen, LoansScreen, NewLoanPeriodScreen, NewLoanScreen } from '@screens';

export type LoanStackParamList = {
    Loan: undefined;
    Loans: undefined;
    NewLoan: undefined;
    NewLoanPeriod: undefined;
};

const LoanStack = createStackNavigator<LoanStackParamList>();

interface LoanNavigatorProps {}

const LoanNavigatorComponent: React.FunctionComponent<LoanNavigatorProps> = () => {
    return (
        <LoanStack.Navigator screenOptions={{ headerShown: false }}>
            <LoanStack.Screen name="Loans" component={LoansScreen} />
            <LoanStack.Screen name="Loan" component={LoanScreen} />
            <LoanStack.Screen name="NewLoan" component={NewLoanScreen} />
            <LoanStack.Screen
                name="NewLoanPeriod"
                component={NewLoanPeriodScreen}
                options={{
                    presentation: 'modal',
                    cardOverlayEnabled: true,
                    gestureEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS,
                }}
            />
        </LoanStack.Navigator>
    );
};

const LoanNavigator = React.memo(LoanNavigatorComponent);

export default LoanNavigator;
