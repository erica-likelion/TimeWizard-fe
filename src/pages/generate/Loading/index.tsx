import { fontStyles } from '@/utils/styles';
import { cn } from '@/utils/util';
import LoadingIcon from '@/assets/images/loading_animation.gif';

import type { GenerateLoadingProps } from './types';

export function GenerateLoading({ loadingMessages, loadingIndex, title = "시간표 생성 중입니다..." }: GenerateLoadingProps) {
  return (
    <div className="flex flex-grow flex-col items-center justify-center">
      {/* TimeTable 아이콘 애니메이션 */}
      <div className="relative">
        <img
          src={LoadingIcon}
          alt="Loading"
          className="w-100 mix-blend-screen max-h-[calc(100dvh-400px)] object-contain"
        />
      </div>

      {/* 로딩 텍스트 */}
      <div className="text-center">
        <p className={cn(fontStyles.title, "text-pink-400 mb-2")}>{title}</p>
        <p className={cn(fontStyles.body, "text-white")}>{loadingMessages[loadingIndex]}</p>
      </div>

      {/* 프로그레스 바 */}
      <div className="w-full max-w-250 h-8 mt-4 bg-[#272727] overflow-hidden">
        <div className="h-full w-1/3 bg-linear-to-r from-pink-500 to-pink-400 animate-[slide_1.5s_linear_infinite]"></div>
      </div>
    </div>
  );
}
