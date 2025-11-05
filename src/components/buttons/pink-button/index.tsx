

import React from 'react';
import { Link } from '@tanstack/react-router';
import type { ToPathOption } from '@tanstack/react-router';
import { cn } from '../../../utils/util'; 


interface PinkButtonProps {
  children: React.ReactNode;
  to: ToPathOption;
  params?: any;
  width?: 'fit' | 'full'; 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string; 
}

export const PinkButton: React.FC<PinkButtonProps> = ({
  children,
  to,
  params,
  width = 'fit',
  size = 'md', 
  className,
}) => {
  
  
  const baseStyles = `
    inline-flex items-center justify-center
    
    font-[Galmuri11] font-normal text-white
    
    transition-colors duration-150
    bg-[#E65787]
    hover:bg-[#FF6096] border4-[#E65787]
    active:bg-[#C1446C]
  `;


  const widthStyles = {
    fit: 'w-fit',
    full: 'w-full',
  };


  const sizeStyles = {
    sm: 'px-8 py-2 text-xl', 
    md: 'px-10 py-4 text-[28px] leading-[130%] tracking-[-0.02em]',
    lg: 'px-12 py-5 text-3xl leading-[130%] tracking-[-0.02em]',
  };

  return (
    <Link
      to={to}
      params={params}
      
      className={cn(
        baseStyles,         
        widthStyles[width], 
        sizeStyles[size],   
        className          
      )}
    >
      {children}
    </Link>
  );
};