import React from 'react';
import type { PlanButtonProps } from './types';
import { fontStyles } from '@/utils/styles';
import { cn } from '@/utils/util';
export const PlanButton: React.FC<PlanButtonProps> = ({
    title,
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
            p-4
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
            className={cn(`
            ${isActive
                ? 'text-[#1EC6AA]'
                : 'text-[#FFFFFF] group-hover:text-[#D7D9DF]'
            }

            /* 2. OnClick (active) 색상 (Brand_Color_FT_Mint_BN) */
            group-active:text-[#1EC6AA]
            `, fontStyles.button)}
        >
            {title}
        </span>
    </button>
);
};
