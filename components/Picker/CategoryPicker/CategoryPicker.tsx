import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useVisible } from '@hooks';
import { useTranslation } from 'react-i18next';
import Category from '@models/Category';
import { GradientIcon } from '@components/Gradient';
import { Text } from '@components/Text';
import { CategoryModal } from './components';

interface CategoryPickerProps {
    nullable?: boolean;
    name?: string;
    selected: Category | undefined;
    onValueChange: (category: Category | undefined, name?: string) => void;
}

const CategoryPicker = React.memo<CategoryPickerProps>(
    ({ nullable = false, name = 'category', selected, onValueChange }) => {
        const { colors } = useTheme();
        const { t } = useTranslation();
        const { visible, onToggle } = useVisible();

        const handleValueChange = React.useCallback(
            (category: Category) => {
                onValueChange(category, name);
                onToggle();
            },
            [onValueChange, name, onToggle],
        );

        return (
            <React.Fragment>
                <TouchableOpacity
                    onPress={onToggle}
                    style={{
                        height: 60,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}
                >
                    <Text style={{ color: colors.text }}>{selected?.name || t('select_category_placeholder')}</Text>
                    {selected && <GradientIcon name={selected.icon} />}
                </TouchableOpacity>
                <CategoryModal
                    nullable={nullable}
                    selected={selected}
                    visible={visible}
                    onChange={handleValueChange}
                    onClose={onToggle}
                />
            </React.Fragment>
        );
    },
);

export default CategoryPicker;
