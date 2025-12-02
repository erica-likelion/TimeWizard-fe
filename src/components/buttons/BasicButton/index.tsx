import React from 'react';
import { fontStyles } from '@/utils/styles';
import { cn } from '@/utils/util';
import type { BasicButtonProps } from './types';


export const BasicButton: React.FC<BasicButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  className,
  disabled = false
}) => {
  const textColor = variant === 'danger' ? 'text-[#FF0000]' : 'text-[#BBB]';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(`p-2
        border-2 border-[#D7D9DF]
        bg-transparent
        ${textColor}
        hover:bg-[#505050]
        hover:cursor-pointer
        active:bg-[#505050]
        
        disabled:bg-[#303030]
        disabled:border-[#505050]
      `, fontStyles.button, className)}
    >
      {children}
    </button>
  );
};
