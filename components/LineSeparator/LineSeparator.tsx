import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface LineSeparatorProps {}

const LineSeparator = React.memo<LineSeparatorProps>(() => {
    const { colors } = useTheme();
    return <View style={{ height: 1, backgroundColor: colors.border }} />;
});

export default LineSeparator;
