import React from 'react';

interface PlanButtonProps {
  title: string;
  date: string;
  onClick: () => void; 
}

export const PlanButton: React.FC<PlanButtonProps> = ({
  title,
  date,
  onClick, 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        font-[Galmuri11]
        flex items-center justify-between
        
        w-[620px]
        h-[72px]
        px-[28px]
        py-[18px]
        border-2
        
        transition-colors duration-150 ease-in-out

        /* --- 1. Default 상태 --- */
        bg-[#303030]
        border-[#D7D9DF]

        /* --- 3. Float (hover) 상태 --- */
        hover:bg-[#767676]
        hover:border-[#D7D9DF]

        /* --- 2. OnClick (active) 상태 --- */
        active:bg-[#E65787]
        active:border-[#C1446C]
      "
    >
      
      <span
        className="
          /* 기본 폰트 명세 */
          font-normal
          text-[28px]
          leading-[130%]
          tracking-[-0.02em]

          /* 1. Default 색상 (White_BN) */
          text-[#FFFFFF]
          
          /* 3. Float (hover) 색상 (명세 누락 -> 임시 지정) */
          group-hover:text-[#D7D9DF]
          
          /* 2. OnClick (active) 색상 (Brand_Color_FT_Mint_BN) */
          group-active:text-[#1EC6AA] 
        "
      >
        {title}
      </span>
      
      
  _B_ <span
        className="
        
          font-normal
          text-[28px]
          leading-[130%]
          tracking-[-0.02em]

          /* 1. Default 색상 (Gray-400_BN) */
          text-[#888888]
          
          /* 3. Float (hover) 색상 (Gray-300_BN) */
          group-hover:text-[#999999]
          
          /* 2. OnClick (active) 색상 (White_BN) */
          group-active:text-[#FFFFFF]
        "
      >
        {date}
      </span>
    </button>
  );
};