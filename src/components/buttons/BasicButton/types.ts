export interface BasicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger';
  className?: string;
  disabled?: boolean;
}