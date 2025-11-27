import { useNavigate } from '@tanstack/react-router';
import { useState, useMemo } from 'react';

import { PinkButton } from '@/components/buttons/PinkButton';
import { TimeTable } from '@/components/TimeTable';
import { Card } from '@/components/Card';

import type { DebugGeneratedCourse } from '@/apis/AIGenerateAPI/types';
import type { Course } from '@/apis/TimeTableAPI/types';

import { fontStyles } from '@/utils/styles';
import { cn } from '@/utils/util';
import { BasicButton } from '@/components/buttons/BasicButton';


export function DebugingPage() {
    const navigate = useNavigate();

    // JSON 입력 텍스트
    const [jsonInput, setJsonInput] = useState<string>('');
    // 파싱된 강의 데이터
    const [generatedCourses, setGeneratedCourses] = useState<DebugGeneratedCourse[]>([]);

    // GeneratedCourse[]를 Course[]로 변환
    const courses: Course[] = useMemo(() => {
      const courseMap = new Map<string, Course>();

      generatedCourses.forEach((genCourse) => {
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

    // JSON 파싱 및 검증
    const handleParseJson = () => {
      const course = JSON.parse(jsonInput);
      setGeneratedCourses(course.courses);
    };

  return (
      <div className="flex flex-col gap-5 flex-1">
           {/* [위] 페이지 제목 */}
            <div className="flex items-center justify-between">
              <p className={fontStyles.title}>Timetable Component Test</p>
              <BasicButton onClick={() => navigate({to: '/main'})} className={cn("ml-auto px-5 py-1 bg-[#000]", fontStyles.caption)}>← 메인으로</BasicButton>
            </div>

           <div className="flex flex-col gap-10 lg:flex-row justify-between flex-1">

             {/* [왼쪽] JSON 입력 영역 */}
             <div className="w-full lg:flex-4 lg:w-auto">
               <Card className="w-full lg:w-auto gap-5 lg:h-full">
                {/* 타이틀 */}
                <div className="flex flex-col gap-3">
                  <p className={cn(fontStyles.subtitle, "text-[#888]")}>AI JSON OUTPUT</p>
                </div>

                {/* JSON 입력 영역 */}
                <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Enter here!"
                    className="flex-1 w-full bg-[#3A3A3A] text-[#FFF] border-2 border-[#666] hover:border-[#888] focus:border-[#C1446C] px-5 py-4 resize-none no-scrollbar rounded-md transition-colors"
                />

                {/* 파싱 버튼 */}
                <PinkButton
                  onClick={handleParseJson}
                  className={cn("w-full py-3", fontStyles.button)}
                >
                  미리보기 갱신
                </PinkButton>
               </Card>
             </div>

             {/* [오른쪽] 시간표 */}
              <div className="w-full lg:flex-6 lg:w-auto">
                <Card title="시간표" className="w-full lg:w-auto lg:h-full">
                  <div className="flex flex-col overflow-y-auto no-scrollbar lg:h-full">
                    {courses.length > 0 ? (
                      <TimeTable courses={courses} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[#666]">
                        <p>JSON을 입력하고 버튼을 눌러주세요</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
           </div>
         </div>
  );
}
