export interface CardProps {
    title?: string;
    buttonText?: string;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
}