import React from 'react';

import { BasicButton } from '@/components/buttons/BasicButton';

import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';
import type {CardProps} from './types';

export const Card: React.FC<CardProps> = ({ title, buttonText, onClick, children, className }) => {

  return (
    <div className={cn("flex flex-col bg-[#303030] no-scrollbar overflow-y-auto", title ? "px-6 pb-6": "p-6",className)}>
        {title && (
          <div className="flex justify-between items-center py-6 sticky top-0 bg-[#303030] z-10">
            <p className={cn("text-[#767676]", fontStyles.subtitle)}>{title}</p>
            {buttonText && onClick && (
              <BasicButton onClick={onClick} 
                className={cn("ml-auto px-5 py-1 border-0 bg-[#000]", fontStyles.caption)}>
                {buttonText}
              </BasicButton>
            )}
          </div>
        )}
        {children}
    </div>
  );
};