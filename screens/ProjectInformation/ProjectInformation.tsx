import React from 'react';
import { Animated, Keyboard, SafeAreaView, StyleSheet, TextStyle, TouchableWithoutFeedback, View } from 'react-native';
import { showToast } from '@utils';
import { useTranslation } from 'react-i18next';
import { CurrencyPicker, Header, Switch, Text, TextField } from '@components';
import { useProjects } from '@contexts';
import { Currency } from '@interfaces';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { useTheme } from '@react-navigation/native';

const SPACING = 10;
const DURATION = 500;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: 100,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING,
    },
});

interface ProjectInformationProps {}

const ProjectInformation = React.memo<ProjectInformationProps>(() => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { project, refreshCurrentProject } = useProjects();
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const { projectRepository } = useDatabaseConnection();
    const [name, setName] = React.useState(project?.name || '');
    const [currency, setCurrency] = React.useState<Currency | undefined>((project?.currency as Currency) || 'USD');
    const [trackTransaction, setTrackTransaction] = React.useState(project.trackTransaction);

    React.useEffect(() => {
        if (trackTransaction) {
            Animated.timing(animatedValue, { toValue: 0, duration: DURATION, useNativeDriver: true }).start();
            return;
        }
        Animated.timing(animatedValue, { toValue: 1, duration: DURATION, useNativeDriver: true }).start();
    }, [animatedValue, trackTransaction]);

    const onTrackTransaction = React.useCallback(() => {
        setTrackTransaction((prevState) => !prevState);
    }, []);

    const onSave = React.useCallback(async () => {
        if (name) {
            project.name = name;
            project.currency = currency;
            project.trackTransaction = trackTransaction;
            await projectRepository.update(project);
            refreshCurrentProject();
            showToast(t('project_updated'));
        }
    }, [currency, name, project, projectRepository, refreshCurrentProject, t, trackTransaction]);

    const textColor = React.useMemo<TextStyle>(() => ({ color: colors.text }), [colors.text]);
    const borderBottom = React.useMemo<TextStyle>(
        () => ({
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        }),
        [colors.border],
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ padding: 20, flex: 1 }}>
                    <Header
                        headerRightIcon="check"
                        goBackTitle={t('back')}
                        headerRightTitle={t('save')}
                        onRightButtonPress={onSave}
                    />
                    <View style={{ paddingVertical: 20 }}>
                        <TextField label={t('project_name')} name="name" value={name} onChangeText={setName} />
                        <View style={{ marginTop: 40 }}>
                            <CurrencyPicker selected={currency} onValueChange={setCurrency} />
                        </View>
                        <TouchableWithoutFeedback onPress={onTrackTransaction}>
                            <View style={[styles.row, borderBottom]}>
                                <Text style={[textColor]}>{t('track_transaction')}</Text>
                                <Switch value={trackTransaction} onValueChange={onTrackTransaction} />
                            </View>
                        </TouchableWithoutFeedback>
                        <Animated.Text
                            style={{
                                fontFamily: 'Nunito_400Regular',
                                color: colors.text,
                                opacity: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                                transform: [
                                    {
                                        translateY: animatedValue.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [25, 50],
                                        }),
                                    },
                                ],
                            }}
                        >
                            {t('track_transaction_text')}
                        </Animated.Text>
                        <Animated.Text
                            style={{
                                fontFamily: 'Nunito_400Regular',
                                color: colors.text,
                                opacity: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                                transform: [
                                    {
                                        translateY: animatedValue.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [25, -40],
                                        }),
                                    },
                                ],
                            }}
                        >
                            {t('not_track_transaction_text')}
                        </Animated.Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
});

export default ProjectInformation;
