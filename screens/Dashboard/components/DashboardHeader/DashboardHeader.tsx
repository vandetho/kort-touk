import React from 'react';
import { Animated, View } from 'react-native';
import { IncomeDetail, MenuModal, ProjectList, TopHeader } from './components';
import { Header } from '@components';
import { useTranslation } from 'react-i18next';
import { useProjects } from '@contexts';
import { useProjectBalanceFetcher } from '@fetchers';
import { useVisible } from '@hooks';

export const HEADER_HEIGHT = 330;

interface DashboardHeaderProps {
    animatedValue: Animated.Value;
    onShowMenu: () => void;
}

const DashboardHeader = React.memo<DashboardHeaderProps>(({ animatedValue, onShowMenu }) => {
    const { t } = useTranslation();
    const { project } = useProjects();
    const { visible, onToggle } = useVisible();
    const headerTranslateY = animatedValue.interpolate({
        inputRange: [0, 75],
        outputRange: [0, -HEADER_HEIGHT],
        extrapolate: 'clamp',
    });
    const { income, expense, reload } = useProjectBalanceFetcher();

    React.useEffect(() => {
        (async () => await reload(project?.id))();
    }, [project, reload]);

    return (
        <React.Fragment>
            <TopHeader
                project={project}
                animatedValue={animatedValue}
                expense={expense}
                income={income}
                onShowMenu={onShowMenu}
                onShowModal={onToggle}
            />
            <Animated.View
                style={{
                    position: 'absolute',
                    zIndex: 1,
                    top: 0,
                    left: 0,
                    right: 0,
                    height: HEADER_HEIGHT,
                    opacity: animatedValue.interpolate({
                        inputRange: [0, 75],
                        outputRange: [1, 0],
                        extrapolate: 'clamp',
                    }),
                    transform: [{ translateY: headerTranslateY }],
                }}
            >
                <View style={{ paddingHorizontal: 10 }}>
                    {project && (
                        <Header
                            onGoBack={onShowMenu}
                            goBackIcon="bars"
                            goBackTitle={t('menu')}
                            headerRightIcon="plus"
                            headerRightTitle={t('new_transaction')}
                            onRightButtonPress={onToggle}
                        />
                    )}
                </View>
                <ProjectList />
                <IncomeDetail expense={expense} income={income} />
            </Animated.View>
            <MenuModal visible={visible} onClose={onToggle} />
        </React.Fragment>
    );
});

export default DashboardHeader;
