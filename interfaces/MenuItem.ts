export interface MenuItem {
    key: string;
    text: string;
    color?: string;
    iconColor?: string;
    textColor?: string;
    icon?:
        | 'info'
        | 'group'
        | 'qr-code'
        | 'category'
        | 'credit-card'
        | 'person'
        | 'vpn-key'
        | 'translate'
        | 'event'
        | 'archive'
        | 'logout';
    animatedIcon?: boolean;
    align?: string;
    screen?: string;
    onPress?: () => void;
}
