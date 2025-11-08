import React from 'react';
import { cn } from '../../../utils/util'; 

interface TextInputProps 
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> { 
  width?: 'fit' | 'full'; 
  size?: 'sm' | 'md' | 'lg'; 
}
// --- 👆 ---

export const TextInput: React.FC<TextInputProps> = ({
  className,
  width = 'full', 
  size = 'md',    
  ...props
}) => {
  
  const baseStyles = `
    font-[Galmuri11] font-normal
    bg-[#303030]
    text-white
    placeholder:text-gray-500

    transition-colors duration-150
    focus:outline-none
    
    border-2
    border-transparent

    hover:border-[#E65787]
    group-hover:border-[#E65787]
    focus:border-white
  `;

  const widthStyles = {
    fit: 'w-fit',
    full: 'w-full',
  };

  const sizeStyles = {
    sm: 'h-[44px] px-4 text-xl', 
    md: 'h-[54px] px-4 text-[28px]',
    lg: 'h-[64px] px-5 text-3xl',
  };

  return (
    <input
      className={cn(
        baseStyles,
        widthStyles[width],
        sizeStyles[size],
        className
      )}
      {...props} 
    />
  );
};