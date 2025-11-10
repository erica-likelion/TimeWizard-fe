import React from 'react';
import { cn } from '@utils/util';
import { fontStyles } from '@/utils/styles';

interface PinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  width?: 'fit' | 'full'; 
  size?: 'sm' | 'md' | 'lg' | 'custom'; 
}

export const PinkButton: React.FC<PinkButtonProps> = ({
  children,
  width = 'fit',
  size = 'md', 
  className,
  type = 'button',
  ...props
}) => {
  
  const baseStyles = `
    inline-flex items-center justify-center
    font-galmuri font-normal text-white
    transition-colors duration-150
    border-4
    bg-[#E65787]
    border-[#E65787]
    hover:bg-[#FF6096]
    hover:border-[#FF6096]
    group-hover:bg-[#FF6096]
    group-hover:border-[#E65787]
    active:bg-[#C1446C]
    active:border-[#C1446C] 

    disabled:bg-[#E657874D]
    disabled:border-[#E657874D] 
  `;

  const widthStyles = {
    fit: 'w-fit',
    full: 'w-full',
  };

  const sizeStyles = {
    sm: cn(fontStyles.button, "p-1"),
    md: cn(fontStyles.body, "p-2"),
    lg: cn(fontStyles.subtitle, "p-3"),
    custom: '', 
  };

  return (
    <button
      type={type}
      className={cn(
        baseStyles,         
        widthStyles[width], 
        sizeStyles[size],   
        className           
      )}
      {...props}
    >
      {children}
    </button>
  );
};