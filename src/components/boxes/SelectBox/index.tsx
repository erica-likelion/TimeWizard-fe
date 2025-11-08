import React, { useState, useEffect, useRef } from 'react';
import type { CustomSelectProps } from './types';
import type { Option } from './types';

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  onChange,
  defaultValue = options[0],
  size = 'large',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>(defaultValue);
  const wrapperRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };
  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
  };

  const baseButtonStyles = `
    relative w-full cursor-default
    flex items-center justify-between
    px-4 py-3
    border
    transition-colors duration-150
    font-[Galmuri11] font-normal text-[24px]
    h-[54px]
  `;
  
  const defaultButtonStyles = 'bg-[#303030] text-white border-[#D7D9DF]';
  const hoverButtonStyles = 'hover:bg-gray-200 hover:text-black hover:border-gray-400';
  const openButtonStyles = 'border-[#E65787] border-2';

  const widthStyles = {
    large: 'w-[400px]',
    small: 'w-[192px]',
  };


  return (
    <div ref={wrapperRef} className={`relative ${widthStyles[size]}`}>
      <button
        type="button"
        onClick={handleButtonClick}
        className={`
          ${baseButtonStyles}
          ${isOpen ? openButtonStyles : defaultButtonStyles}
          ${hoverButtonStyles}
        `}
      >
        <span>{selectedOption.label}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div
          className="
            absolute z-10 mt-1 w-full
            overflow-auto
            bg-[#303030]
            border border-[#D7D9DF] 
            focus:outline-none
          "
        >
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleOptionClick(option)}
            
              className={`
                relative cursor-default select-none
                flex items-center      
                h-[54px]            
                px-4                
                border-b border-[#D7D9DF] 
                font-[Galmuri11] font-normal text-[24px]
                
                hover:bg-pink-600 hover:text-white
                
                ${selectedOption.id === option.id
                  ? 'bg-gray-200 text-black' 
                  : 'text-white' 
                }
              `}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};