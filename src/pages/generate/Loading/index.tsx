import { fontStyles } from '@/utils/styles';
import { cn } from '@/utils/util';
import TimeTableIcon from '@/assets/icons/time_table.png';

import type { GenerateLoadingProps } from './types';

export function GenerateLoading({ loadingMessages, loadingIndex, title = "시간표 생성 중입니다..." }: GenerateLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      {/* TimeTable 아이콘 애니메이션 */}
      <div className="relative">
        <img
          src={TimeTableIcon}
          alt="Loading"
          className="w-100"
        />
      </div>

      {/* 로딩 텍스트 */}
      <div className="text-center">
        <p className={cn(fontStyles.title, "text-pink-400 mb-2")}>{title}</p>
        <p className={cn(fontStyles.body, "text-white")}>{loadingMessages[loadingIndex]}</p>
      </div>

      {/* 프로그레스 바 */}
      <div className="w-full max-w-250 h-8 bg-[#767676] overflow-hidden">
        <div className="h-full w-1/3 bg-linear-to-r from-pink-500 to-pink-400 animate-[slide_1.5s_linear_infinite]"></div>
      </div>
    </div>
  );
}
