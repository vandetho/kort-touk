import React from 'react';

export const useVisible = ({ initial = false } = {}) => {
    const [visible, setVisible] = React.useState(initial);

    const onOpen = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const onToggle = () => setVisible((prevState) => !prevState);

    return { visible, onOpen, onClose, onToggle, setVisible };
};
