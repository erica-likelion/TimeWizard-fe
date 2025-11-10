import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { mockGetTimeTableDetail } from '@/apis/TimeTableAPI/timeTableApi';

import { BasicButton } from '@/components/buttons/BasicButton';
import { PinkButton } from '@/components/buttons/PinkButton';
import { TimeTable } from '@/components/TimeTable';
import { TextInput } from '@/components/boxes/InputBox';

import type { TimeTableDetail } from './types';
import type { GenerateResultPageProps } from './types';

import { fontStyles } from '@/utils/styles';
import { cn } from '@/utils/util';


export function GenerateResultPage({ gentimetableId, message }: GenerateResultPageProps) {
    const navigate = useNavigate();
    // 조회한 시간표 상세 정보
    const [timetable, setTimetable] = useState<TimeTableDetail | null>(null);
    // AI 마법사 메시지
    const [aiMessage] = useState<string>(message || '');
    // 시간표 이름
    const [timetableName, setTimetableName] = useState<string>('');
    // 수정 요청 사항
    const [feedback, setFeedback] = useState<string>('');

    /*
      마운트 시 URL 파라미터의 timetableId로
      해당 시간표 상세 정보 조회
    */
    useEffect(() => {
      const fetchTimetable = async () => {
        try {
          const response = await mockGetTimeTableDetail(Number(gentimetableId));
          if (response.success) {
            setTimetable(response.data);
          }
        } catch (error) {
          console.error('시간표 상세 조회 실패:', error);
        }
      };

      fetchTimetable();
    }, [gentimetableId]);


    // 시간표 로딩 중일 때 표시
    if (!timetable) {
      return (
        <div className="flex flex-col gap-20 items-center justify-center h-screen ">
          <p className={cn("text-[#E65787]",fontStyles.title)}>오류 발생</p>
          <BasicButton onClick={() => navigate({'to': '/generate'})}>생성 페이지로 돌아가기</BasicButton>
        </div>
      );
    }

  return (
      <div className="flex flex-col h-full px-[72px] gap-[22px] pt-[40px] pb-[72px]">
           {/* [위] 페이지 제목 */}
           <div className="flex items-end">
             <p className={fontStyles.title}>생성 결과</p>
           </div>

           <div className="flex gap-10 items-start h-full">

             {/* [왼쪽] AI 설명 및 입력 영역 */}
             <div className="flex-1 flex flex-col gap-7 max-w-[600px] h-full bg-[#303030] px-8 py-4">
               {/* AI 마법사의 설명 */}
               <div className="flex flex-col gap-3">
                 <p className={cn(fontStyles.subtitle, "text-[#888]")}>AI 마법사의 설명</p>
               </div>

              <textarea
                  value={aiMessage}
                  disabled
                  className="flex-[1.2] w-full bg-[#767676] text-[#BBB] border-2 border-[#999] px-5 py-2 resize-none no-scrollbar"
                  style={{ cursor: 'default' }}
                />

               {/* 시간표 이름 입력 */}
              <TextInput
                value={timetableName}
                onChange={(e) => setTimetableName(e.target.value)}
                placeholder="시간표 이름 입력"
                className="border-2 border-[#888] w-full px-5"
              />

               {/* 저장 버튼 */}
              <PinkButton
                onClick={() => navigate({to: '/list'})}
                className={cn("w-full py-3", fontStyles.button)}
              >
                이 시간표 저장!
              </PinkButton>

               {/* 마음에 들지 않나요? */}
               <div className="flex-1 flex flex-col gap-3 mt-4">
                 <p className={cn(fontStyles.subtitle, "text-[#888]")}>마음에 들지 않나요?</p>
                 <textarea
                   value={feedback}
                   onChange={(e) => setFeedback(e.target.value)}
                   placeholder="수정사항이 있다면..."
                   className={cn("w-full h-full text-[#FBFBFB] border-2 border-[#888] hover:border-[#C1446C] placeholder:text-[#888] px-5 py-4 resize-none no-scrollbar", fontStyles.body)}
                 />
               </div>

               {/* 다시 생성하기 버튼 */}
               <BasicButton
                 onClick={() => navigate({to: '/generate'})}
                 className={cn("py-3", fontStyles.button, "border-[#888] w-full")}
               >
                 다시 생성하기
               </BasicButton>
             </div>

             {/* [오른쪽] 시간표 */}
             <div className="flex-1 flex flex-col h-full p-4 bg-[#303030] overflow-y-auto no-scrollbar">
               <p className={cn("text-[#767676] pb-3", fontStyles.subtitle, "sticky top-0 bg-[#303030] z-10")}>
                 시간표
               </p>
               <div className="w-full self-center px-5 py-3">
                 <TimeTable courses={timetable.courses}/>
               </div>
             </div>
           </div>
         </div>
  );
}
