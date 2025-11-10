import React from 'react';
import type { PlanButtonProps } from './types';

export const PlanButton: React.FC<PlanButtonProps> = ({
    title,
    date,
    onClick,
    isActive = false,
}) => {
    return (
    <button
        type="button"
        onClick={onClick}
        className={`
        group
        font-[Galmuri11]
        flex items-center justify-between

        w-full
        min-w-70
        h-[72px]
        px-[28px]
        py-[18px]
        border-2

        transition-colors duration-150 ease-in-out

        ${isActive
            ? 'bg-[#E65787] border-[#C1446C]'
            : 'bg-[#303030] border-[#D7D9DF] hover:bg-[#767676] hover:border-[#D7D9DF]'
        }

        /* --- 2. OnClick (active) 상태 --- */
        active:bg-[#E65787]
         active:border-[#C1446C]
        `}
     >

    <span
        className={`
        /* 기본 폰트 명세 */
        font-normal
         text-[28px]
         leading-[130%]
         tracking-[-0.02em]

         ${isActive
            ? 'text-[#1EC6AA]'
            : 'text-[#FFFFFF] group-hover:text-[#D7D9DF]'
         }

         /* 2. OnClick (active) 색상 (Brand_Color_FT_Mint_BN) */
         group-active:text-[#1EC6AA]
        `}
    >
        {title}
    </span>


    <span
        className={`

         font-normal
         text-[28px]
         leading-[130%]
         tracking-[-0.02em]

         ${isActive
            ? 'text-[#FFFFFF]'
            : 'text-[#888888] group-hover:text-[#999999]'
         }

         /* 2. OnClick (active) 색상 (White_BN) */
         group-active:text-[#FFFFFF]
         `}
    >
        {date}
     </span>
    </button>
);
};
