import React from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const dimension = Dimensions.get('window').width / 2;
const borderWidth = 3;
const borderColor = '#FFFFFF';

const styles = StyleSheet.create({
    maskView: {
        width: dimension,
        height: dimension,
    },
    maskViewBlockContainer: {
        flex: 1,
    },
    maskViewBlockContainerRow: {
        flex: 1,
        flexDirection: 'row',
    },
    maskViewBlock: {
        flex: 1,
    },
    maskViewBlockWithBorderLeftTop: {
        flex: 1,
        borderLeftWidth: borderWidth,
        borderTopWidth: borderWidth,
        borderColor: borderColor,
    },
    maskViewBlockWithBorderLeftBottom: {
        flex: 1,
        borderLeftWidth: borderWidth,
        borderBottomWidth: borderWidth,
        borderColor: borderColor,
    },
    maskViewBlockWithBorderRightTop: {
        flex: 1,
        borderRightWidth: borderWidth,
        borderTopWidth: borderWidth,
        borderColor: borderColor,
    },
    maskViewBlockWithBorderRightBottom: {
        flex: 1,
        borderRightWidth: borderWidth,
        borderBottomWidth: borderWidth,
        borderColor: borderColor,
    },
});

interface ScannerMaskProps {
    opacity?: Animated.Value;
}

const ScannerMask: React.FC<ScannerMaskProps> = ({ opacity }) => (
    <Animated.View style={[styles.maskView, { opacity: opacity }]}>
        <View style={styles.maskViewBlockContainerRow}>
            <View style={styles.maskViewBlockWithBorderLeftTop} />
            <View style={styles.maskViewBlock} />
            <View style={styles.maskViewBlockWithBorderRightTop} />
        </View>
        <View style={styles.maskViewBlockContainer} />
        <View style={styles.maskViewBlockContainerRow}>
            <View style={styles.maskViewBlockWithBorderLeftBottom} />
            <View style={styles.maskViewBlock} />
            <View style={styles.maskViewBlockWithBorderRightBottom} />
        </View>
    </Animated.View>
);

export default ScannerMask;
