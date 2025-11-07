import React from 'react';
import { fontStyles } from '@/utils/styles';
import { cn } from '@/utils/util';

interface BasicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}

export const BasicButton: React.FC<BasicButtonProps> = ({
  children,
  onClick,
  variant = 'default'
}) => {
  const textColor = variant === 'danger' ? 'text-[#FF0000]' : 'text-[#BBB]';

  return (
    <button
      onClick={onClick}
      className={cn(`
        px-[11px] py-[14px]
        border-2 border-[#D7D9DF]
        bg-transparent
        max-w-60
        ${textColor}
        hover:bg-[#505050]
        hover:cursor-pointer
        active:bg-[#505050]
      `, fontStyles.body)}
    >
      {children}
    </button>
  );
};
