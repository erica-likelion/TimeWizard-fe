import React from 'react';
import { cn } from '@utils/util';

interface DarkOutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  /**
   * 'default': 120x32px
   * 'full': w-full, h-32px
   * 'custom': 크기 없음 (className으로 직접 제어)
   */
  size?: 'default' | 'full' | 'custom'; 
}

export const DarkOutlineButton: React.FC<DarkOutlineButtonProps> = ({
  children,
  size = 'default',
  className,
  type = 'button',
  ...props
}) => {
  
  const baseStyles = `
    inline-flex items-center justify-center
    font-galmuri font-normal text-white
    transition-colors duration-150
    border border-white
    bg-[#303030]
    hover:bg-[#4a4a4a]
    active:bg-[#2a2a2a]
  `;

  // [✨ 수정됨] size prop이 너비(w)와 높이(h)를 모두 제어
  const sizeStyles = {
    default: 'w-[120px] h-[32px] text-sm',
    full: 'w-full h-[32px] text-sm',
    custom: '',
  };

  return (
    <button
      type={type}
      className={cn(
        baseStyles,         
        sizeStyles[size], // [✨ 수정됨]
        className           
      )}
      {...props}
    >
      {children}
    </button>
  );
};