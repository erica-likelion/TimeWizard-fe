// src/components/PlanButtonLink.tsx

import React from 'react';
import { Link } from '@tanstack/react-router';
import type { ToPathOption } from '@tanstack/react-router';

interface PlanButtonLinkProps {
  title: string;
  date: string;
  to: ToPathOption;
  params?: any;
}

export const PlanButtonLink: React.FC<PlanButtonLinkProps> = ({
  title,
  date,
  to,
  params,
}) => {
  return (
    <Link
      to={to}
      params={params}
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
      {/* --- 👈 왼쪽 텍스트 (#25-2학기 플랜A) --- */}
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
      
      {/* --- 👉 오른쪽 텍스트 (2025.08.02. 생성됨) --- */}
      <span
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
    </Link>
  );
};