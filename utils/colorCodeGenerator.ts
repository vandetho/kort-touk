export const colorCodeGenerator = (): string => {
    const colors: string[] = [
        '#e53935',
        '#d81b60',
        '#8e24aa',
        '#5e35b1',
        '#3949ab',
        '#1e88e5',
        '#039be5',
        '#00acc1',
        '#00897b',
        '#a7ffeb',
        '#18ffff',
        '#43a047',
        '#00e676',
        '#b2ff59',
        '#c6ff00',
        '#ffee58',
        '#ffc107',
        '#fbc02d',
        '#fb8c00',
        '#ff5722',
        '#6d4c41',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};
