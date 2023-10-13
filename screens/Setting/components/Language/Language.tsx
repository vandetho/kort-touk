import React from 'react';
import { StyleSheet, TextStyle, TouchableWithoutFeedback, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { useTheme } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useVisible } from '@hooks';
import { Language as LanguageConstant } from '@constants';
import { useSettings } from '@contexts';
import { Text } from '@components';
import i18n from '../../../../i18n';

const styles = StyleSheet.create({
    valueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        alignItems: 'center',
    },
    pickerContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    picker: {
        height: '100%',
        flex: 1,
    },
});

interface LanguageProps {}

const Language: React.FunctionComponent<LanguageProps> = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { visible, onToggle } = useVisible({ initial: true });
    const { settings, updateSettings } = useSettings();
    const [state, setState] = React.useState<string>(settings.language);

    const textColor = React.useMemo<TextStyle>(() => ({ color: colors.text }), [colors.text]);
    const borderBottom = React.useMemo<TextStyle>(
        () => ({
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        }),
        [colors.border],
    );

    const renderValue = React.useCallback(() => {
        const items: JSX.Element[] = [];
        const languages = Object.keys(LanguageConstant);
        for (let i = 0; i < languages.length; ++i) {
            items.push(
                <Picker.Item
                    value={LanguageConstant[languages[i]].locale}
                    label={LanguageConstant[languages[i]].name}
                    style={textColor}
                    color={colors.text}
                    key={`language-picker-item-${i}`}
                />,
            );
        }
        return items;
    }, [colors.text, textColor]);

    const handleChange = React.useCallback(
        (itemValue: string) => {
            const tmp = { ...settings };
            tmp.language = itemValue;
            i18n.changeLanguage(itemValue);
            updateSettings(tmp);
            setState(itemValue);
        },
        [settings, updateSettings],
    );

    return (
        <React.Fragment>
            <TouchableWithoutFeedback onPress={onToggle}>
                <View style={[styles.valueContainer, borderBottom, { backgroundColor: colors.card }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View
                            style={{
                                backgroundColor: '#61EE02',
                                width: 35,
                                height: 35,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 5,
                            }}
                        >
                            <FontAwesome5 name="language" color="#FFFFFF" size={24} />
                        </View>
                        <Text style={[textColor, { marginLeft: 10 }]}>{t('language')}</Text>
                    </View>
                    <Text style={[textColor, { fontWeight: 'bold' }]}>
                        {LanguageConstant[state]?.name || 'English'}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
            <Collapsible collapsed={visible}>
                <View style={[styles.pickerContainer, borderBottom]}>
                    <Picker selectedValue={state} style={styles.picker} onValueChange={handleChange}>
                        {renderValue()}
                    </Picker>
                </View>
            </Collapsible>
        </React.Fragment>
    );
};

export default Language;
