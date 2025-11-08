import React from 'react';
import { cn } from '../../../utils/util'; 


interface PinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  width?: 'fit' | 'full'; 
  size?: 'sm' | 'md' | 'lg'; 

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
    
    font-[Galmuri11] font-normal text-white 
    
    transition-colors duration-150

    border-4 
    
    
    bg-[#E65787]
    border-[#E65787] 

    hover:bg-[#FF6096]
    hover:border-[#FF6096] 

    
    active:bg-[#C1446C]
    active:border-[#C1446C] 
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