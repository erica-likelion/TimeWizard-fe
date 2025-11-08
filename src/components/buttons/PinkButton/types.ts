export interface PinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  width?: 'fit' | 'full'; 
  size?: 'sm' | 'md' | 'lg'; 
  onClick: () => void; 
}