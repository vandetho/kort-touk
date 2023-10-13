import React from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { CustomLinearGradient } from '@components';
import { FontAwesome5 } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoanStackParamList } from '@navigations/LoanNavigator';
import { useNavigation } from '@react-navigation/native';

const SIZE = 80;
const BORDER_RADIUS = SIZE / 2;

type NewLoanScreenNavigationProps = NativeStackNavigationProp<LoanStackParamList, 'NewLoan'>;

interface NewLoanButtonProps {
    animatedValue: Animated.Value;
}

const NewLoanButtonComponent: React.FunctionComponent<NewLoanButtonProps> = ({ animatedValue }) => {
    const navigation = useNavigation<NewLoanScreenNavigationProps>();

    const onPress = React.useCallback(() => {
        navigation.navigate('NewLoan');
    }, [navigation]);

    return (
        <TouchableOpacity onPress={onPress}>
            <Animated.View
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    opacity: animatedValue.interpolate({
                        inputRange: [0, 75],
                        outputRange: [1, 0],
                        extrapolate: 'clamp',
                    }),
                    transform: [
                        {
                            scale: animatedValue.interpolate({
                                inputRange: [0, 75],
                                outputRange: [1, 0],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                <CustomLinearGradient
                    style={{
                        height: SIZE,
                        width: SIZE,
                        borderRadius: BORDER_RADIUS,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <FontAwesome5 name="plus" size={40} color="#FFFFFF" />
                </CustomLinearGradient>
            </Animated.View>
        </TouchableOpacity>
    );
};

const NewLoanButton = React.memo(NewLoanButtonComponent);

export default NewLoanButton;
