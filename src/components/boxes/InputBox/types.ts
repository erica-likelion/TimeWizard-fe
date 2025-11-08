export interface TextInputProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> { 
  width?: 'fit' | 'full'; 
  size?: 'sm' | 'md' | 'lg'; 
}