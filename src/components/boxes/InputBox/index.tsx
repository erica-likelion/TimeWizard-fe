import React from 'react';
import type { TextInputProps } from './types';
import { cn } from '../../../utils/util'; 
import { fontStyles } from '@/utils/styles';

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

    enabled:hover:border-[#E65787]
    enabled:group-hover:border-[#E65787]
    focus:border-white

    disabled:bg-[#505050]
    disabled:cursor-not-allowed
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