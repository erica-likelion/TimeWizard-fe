import { useNavigate } from '@tanstack/react-router';
import { useState, useMemo } from 'react';

import { BasicButton } from '@/components/buttons/BasicButton';
import { PinkButton } from '@/components/buttons/PinkButton';
import { TimeTable } from '@/components/TimeTable';
import { TextInput } from '@/components/boxes/InputBox';
import { Card } from '@/components/Card';

import type { GenerateResultPageProps } from './types';
import type { Course } from '@/apis/TimeTableAPI/types';
import { saveTimetable } from '@/apis/TimeTableAPI/timeTableApi';

import { fontStyles } from '@/utils/styles';
import { cn } from '@/utils/util';


export function GenerateResultPage({ gentimetableId, courses: generatedCourses, ai_comment }: GenerateResultPageProps) {
    const navigate = useNavigate();
    // AI 마법사 메시지
    const [aiMessage] = useState<string>(ai_comment || '');
    // 시간표 이름
    const [timetableName, setTimetableName] = useState<string>('');
    // 수정 요청 사항
    const [feedback, setFeedback] = useState<string>('');
    // 저장 중 상태
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // API에서 주는 GeneratedCourse[]와 Course[]가 타입 규격이 안맞아서 하나로 통일하는 과정
    const courses: Course[] = useMemo(() => {
      const courseMap = new Map<string, Course>();

      generatedCourses.forEach((genCourse) => {
        console.log(genCourse)
        if (!courseMap.has(genCourse.course_id)) {
          courseMap.set(genCourse.course_id, {
            courseId: Number(genCourse.course_id),
            courseCode: '',
            courseName: genCourse.course_name,
            courseEnglishName: '',
            courseNumber: 0,
            professor: genCourse.professor,
            major: '',
            section: 0,
            grade: 0,
            credits: 0,
            lectureHours: 0,
            practiceHours: 0,
            courseType: '',
            capacity: 0,
            semester: '',
            courseTimes: []
          });
        }

        // courseTimes에 추가
        const course = courseMap.get(genCourse.course_id)!;
        course.courseTimes.push({
          dayOfWeek: genCourse.day_of_week.toUpperCase(),
          startTime: genCourse.start_time,
          endTime: genCourse.end_time,
          classroom: ''
        });
      });

      return Array.from(courseMap.values());
    }, [generatedCourses]);

    // 시간표 저장 버튼 핸들 함수
    const handleSaveTimetable = async () => {
      if (!timetableName.trim()) {
        alert('시간표 이름을 입력해주세요.');
        return;
      }

      try {
        setIsSaving(true);

        const courseIds = courses.map(course => course.courseId);

        await saveTimetable({
          courseIds,
          name: timetableName,
          aiComment: aiMessage,
          uuidKey: gentimetableId
        });

        alert('시간표가 저장되었습니다!');
        navigate({to: '/list'});
      } catch (error) {
        console.error('시간표 저장 실패:', error);
        alert('시간표 저장에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsSaving(false);
      }
    };


    // 강의가 없으면 에러 표시
    if (courses.length === 0) {
      return (
        <div className="flex flex-col gap-20 items-center justify-center h-screen ">
          <p className={cn("text-[#E65787]",fontStyles.title)}>생성된 시간표가 없습니다</p>
          <BasicButton onClick={() => navigate({'to': '/generate'})}>생성 페이지로 돌아가기</BasicButton>
        </div>
      );
    }

  return (
      <div className="flex flex-col px-18 gap-5 py-10 flex-1">
           {/* [위] 페이지 제목 */}
            <p className={fontStyles.title}>생성 결과</p>

           <div className="flex flex-col gap-10 lg:flex-row justify-between flex-1">

             {/* [왼쪽] AI 설명 및 입력 영역 */}
             <div className="w-full lg:flex-4 lg:w-auto">
               <Card className="w-full lg:w-auto gap-7 lg:h-full">
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
                  onClick={handleSaveTimetable}
                  disabled={isSaving}
                  className={cn("w-full py-3", fontStyles.button)}
                >
                  {isSaving ? '저장 중...' : '이 시간표 저장!'}
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
               </Card>
             </div>

             {/* [오른쪽] 시간표 */}
              <div className="w-full lg:flex-6 lg:w-auto">
                <Card title="시간표" className="w-full lg:w-auto lg:h-full">
                  <div className="flex flex-col overflow-y-auto no-scrollbar lg:h-full">
                    {courses && <TimeTable courses={courses} />}
                  </div>
                </Card>
              </div>
           </div>
         </div>
  );
}
