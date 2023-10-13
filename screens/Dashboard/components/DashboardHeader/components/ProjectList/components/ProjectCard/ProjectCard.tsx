import React from 'react';
import { format } from 'date-fns';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Animated, Dimensions, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { currencyFormat, normalizeHeight } from '@utils';
import { DISPLAY_DATE_FORMAT } from '@config';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { ApplicationStackParamsList } from '@navigations/ApplicationNavigator/ApplicationNavigator';
import { color } from '@theme/colors';
import Project from '@models/Project';
import { Text } from '@components';

const BORDER_RADIUS = 15;
const WIDTH = Dimensions.get('window').width - 20;
export const CARD_HEIGHT = normalizeHeight(135);

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: WIDTH,
        left: -WIDTH / 2,
        height: CARD_HEIGHT,
        borderRadius: BORDER_RADIUS,
        padding: 20,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nameText: {
        fontSize: 20,
    },
    amountText: {
        textAlign: 'right',
        marginTop: normalizeHeight(7.46),
        fontSize: 35,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        bottom: 15,
        left: 20,
        right: 20,
        position: 'absolute',
    },
    updatedAtText: {
        fontSize: 12,
    },
    dateText: {
        fontSize: 10,
    },
});

type NewProjectScreenParamList = NativeStackNavigationProp<ApplicationStackParamsList, 'NewProject'>;

interface ProjectCardProps {
    project: Project;
    isSearch: boolean;
    from: number;
    to: number;
    index: number;
    scrollXAnimated: Animated.Value;
    visibleItems: number;
}

const ProjectCard: React.FunctionComponent<ProjectCardProps> = ({
    project,
    index,
    isSearch,
    from,
    to,
    scrollXAnimated,
    visibleItems,
}) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<NewProjectScreenParamList>();
    const amountTextColor = project.balances < 0 ? color.red : color.green;
    const amount = project.balances || 0;
    const textColor = colors.text;
    const inputRange = React.useMemo(() => [index - 1, index, index + 1], [index]);

    const translateX = scrollXAnimated.interpolate({
        inputRange,
        outputRange: [100, 0, -WIDTH - 20],
    });

    const scale = scrollXAnimated.interpolate({
        inputRange,
        outputRange: [0.8, 1, 1],
    });

    const opacity = scrollXAnimated.interpolate({
        inputRange,
        outputRange: [1 - 1 / visibleItems, 1, 1],
    });

    const onPressNewProject = React.useCallback(() => {
        navigation.navigate('NewProject');
    }, [navigation]);

    const searchIcon = React.useMemo(
        () =>
            isSearch ? (
                <View
                    style={{
                        height: 50,
                        width: 50,
                        borderRadius: 35,
                        backgroundColor: colors.background,
                        marginTop: -10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <FontAwesome5 name="search" size={26} color={colors.text} />
                </View>
            ) : undefined,
        [colors.background, colors.text, isSearch],
    );

    const renderContent = React.useCallback(() => {
        if (project.id) {
            const lastUpdate = format(new Date(project.updatedAt), DISPLAY_DATE_FORMAT);
            return (
                <React.Fragment>
                    <View style={styles.nameRow}>
                        <Text style={[styles.nameText, { color: textColor }]}>{project.name}</Text>
                        {searchIcon}
                    </View>
                    <Text bold style={[styles.amountText, { color: amountTextColor }]}>
                        {currencyFormat(amount, project.currency)}
                    </Text>
                    <View style={styles.dateContainer}>
                        <Text style={[styles.updatedAtText, { color: textColor }]}>{lastUpdate}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={[styles.updatedAtText, { color: textColor }]}>
                                {format(new Date(from), DISPLAY_DATE_FORMAT)}
                            </Text>
                            <Text style={[styles.updatedAtText, { color: textColor }]}> - </Text>
                            <Text style={[styles.updatedAtText, { color: textColor }]}>
                                {format(new Date(to), DISPLAY_DATE_FORMAT)}
                            </Text>
                        </View>
                    </View>
                </React.Fragment>
            );
        }
        return (
            <TouchableWithoutFeedback onPress={onPressNewProject}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="add" color={colors.text} size={75} />
                    <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold' }}>{t('new_project')}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }, [amount, amountTextColor, colors.text, from, onPressNewProject, project, searchIcon, t, textColor, to]);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    backgroundColor: colors.card,
                    opacity,
                    transform: [
                        {
                            translateX,
                        },
                        { scale },
                    ],
                },
            ]}
        >
            {renderContent()}
        </Animated.View>
    );
};

export default ProjectCard;
