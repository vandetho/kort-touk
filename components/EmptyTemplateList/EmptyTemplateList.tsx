import React from 'react';
import { View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Text } from '@components/Text';

interface EmptyTemplateListListProps {}

const EmptyTemplateList: React.FunctionComponent<EmptyTemplateListListProps> = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
        <View style={{ flex: 1, marginTop: 150, alignItems: 'center' }}>
            <View style={{ marginVertical: 10 }}>
                <FontAwesome5 name="comment-slash" size={60} color={colors.text} />
            </View>
            <View style={{ marginVertical: 10 }}>
                <Text bold fontSize={20} style={{ color: colors.text }}>
                    {t('no_template_found')}
                </Text>
            </View>
        </View>
    );
};

export default EmptyTemplateList;
