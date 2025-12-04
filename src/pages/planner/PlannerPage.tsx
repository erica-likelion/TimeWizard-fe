import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { fontStyles } from '@/utils/styles';
import { cn } from '@/utils/util';
import { Card } from '@/components/Card';
import { CustomSelect } from '@/components/boxes/SelectBox';
import { BasicButton } from '@/components/buttons/BasicButton';
import { PinkButton } from '@/components/buttons/PinkButton';
import type { CourseTime } from '@/apis/TimeTableAPI/types';
import { useTimetableList } from '@/hooks/useTimetableList';
import { usePlannerGeneration } from '@/hooks/usePlannerGeneration';

const formatMinutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

const dayOfWeekToKorean = (day: string): string => {
    const map: Record<string, string> = {
        MON: '월',
        TUE: '화',
        WED: '수',
        THU: '목',
        FRI: '금',
        SAT: '토',
        SUN: '일',
    };
    return map[day] || day;
};

const formatCourseTimes = (courseTimes: CourseTime[]): string => {
    if (!courseTimes || courseTimes.length === 0) return '';
    const grouped = courseTimes.reduce((acc, ct) => {
        const day = dayOfWeekToKorean(ct.dayOfWeek);
        const timeStr = `${formatMinutesToTime(ct.startTime)}~${formatMinutesToTime(ct.endTime)}`;
        if (!acc[day]) acc[day] = [];
        acc[day].push(timeStr);
        return acc;
    }, {} as Record<string, string[]>);
    return Object.entries(grouped)
        .map(([day, times]) => `${day} ${times.join(', ')}`)
        .join(' / ');
};

export function PlannerPage() {
    const navigate = useNavigate();
    const searchParams = useSearch({ from: '/planner/' }) as { timetableId?: string };
    const { timetables, selectedTimetable, isLoading: isLoadingTimetables, setSelectedTimetable } = useTimetableList({
        initialTimetableId: searchParams.timetableId,
    });
    const { isGenerating, isGenerated, loadingDots, plannerCourses, aiComment, handleGenerate } = usePlannerGeneration();
    const [serverUrl, setServerUrl] = useState('sugang.hanyang.ac.kr');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [autoGenerateTriggered, setAutoGenerateTriggered] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 10);
        return () => clearInterval(timer);
    }, []);

    // URL 파라미터에서 timetableId가 있고 selectedTimetable이 설정되면 자동으로 플래너 생성
    useEffect(() => {
        if (
            searchParams.timetableId && 
            selectedTimetable && 
            selectedTimetable.id === searchParams.timetableId && 
            !isLoadingTimetables &&
            !isGenerating && 
            !isGenerated &&
            !autoGenerateTriggered
        ) {
            setAutoGenerateTriggered(true);
            handleGenerate(String(selectedTimetable.id));
            
            // URL 파라미터 제거 (새로고침 시 자동 시작 방지)
            navigate({ to: '/planner', search: { timetableId: undefined }, replace: true });
        }
    }, [searchParams.timetableId, selectedTimetable, isLoadingTimetables, isGenerating, isGenerated, autoGenerateTriggered, handleGenerate, navigate]);

    const handleCheckServerTime = () => {
        console.log(`Checking server time for ${serverUrl}`);
    };

    const handleCopy = (courseNumber: number, text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(courseNumber);
            if (!checkedItems.includes(courseNumber)) {
                setCheckedItems(prev => [...prev, courseNumber]);
            }
            setTimeout(() => {
                setCopiedId(null);
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const toggleCheck = (courseNumber: number) => {
        setCheckedItems(prev => 
            prev.includes(courseNumber) ? prev.filter(item => item !== courseNumber) : [...prev, courseNumber]
        );
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    const formatTime = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ms = String(Math.floor(date.getMilliseconds() / 10)).padStart(2, '0');
        return { hours, minutes, seconds, ms };
    };

    const time = formatTime(currentTime);

    const onGenerateClick = async () => {
        if (!selectedTimetable) return;
        await handleGenerate(String(selectedTimetable.id));
    };

    return (
        <div className="w-full h-full flex flex-col gap-6"> 
            {/* Header */}
            <div className="flex justify-between items-center min-h-10">
                <h1 className={cn("text-white", fontStyles.title)}>플래너</h1>
                <BasicButton onClick={() => navigate({to: '/list'})} className={cn("ml-auto px-5 py-1 bg-[#000]", fontStyles.caption)}>← 목록으로</BasicButton>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-12 gap-6 h-full">
                <div className="flex flex-col gap-6 2xl:col-span-4">
                    <Card title="플래닝 강의 선택" className="h-fit overflow-visible">
                        <div className="flex gap-2">
                            <div className="flex-grow">
                                {isLoadingTimetables ? (
                                    <div className={cn("bg-[#303030] border border-[#D7D9DF] text-[#767676] px-4 py-2", fontStyles.body)}>
                                        불러오는 중...
                                    </div>
                                ) : timetables.length > 0 ? (
                                    <CustomSelect 
                                        options={timetables} 
                                        onChange={(value) => setSelectedTimetable(value)}
                                        defaultValue={selectedTimetable ?? undefined}
                                        size="full"
                                    />
                                ) : (
                                    <div className={cn("bg-[#303030] border border-[#D7D9DF] text-[#767676] px-4 py-2", fontStyles.body)}>
                                        시간표가 없습니다
                                    </div>
                                )}
                            </div>
                            <BasicButton 
                                onClick={onGenerateClick} 
                                className="whitespace-nowrap px-6"
                                disabled={isGenerating || !selectedTimetable}
                            >
                                생성
                            </BasicButton>
                        </div>
                    </Card>

                    <Card title="서버시간 확인" className="h-fit">
                        <div className="flex gap-2 mb-6">
                            <input 
                                type="text" 
                                value={serverUrl}
                                onChange={(e) => setServerUrl(e.target.value)}
                                className={cn(
                                    "flex-grow bg-[#303030] border border-[#D7D9DF] text-white px-4 py-2 outline-none focus:border-[#E65787]",
                                    fontStyles.body
                                )}
                            />
                            <BasicButton onClick={handleCheckServerTime} className="whitespace-nowrap px-6">
                                조회
                            </BasicButton>
                        </div>
                        <div className="bg-black p-6 flex flex-col items-center justify-center gap-2 border border-[#303030]">
                            <div className="text-[#767676] text-sm font-galmuri">
                                {formatDate(currentTime)}
                            </div>
                            <div className="flex items-baseline text-[#E65787] font-galmuri font-bold leading-none tabular-nums">
                                <span className="text-5xl tracking-widest">
                                    {time.hours}:{time.minutes}:{time.seconds}
                                </span>
                                <span className="text-2xl ml-2">
                                    .{time.ms}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="flex flex-col gap-6 2xl:col-span-8">
                    <Card title="AI 플래너 결과" className="flex-grow min-h-[300px]">
                        {isGenerating ? (
                            <div className="flex-grow flex items-center justify-center h-full min-h-[200px]">
                                <p className={cn("text-[#E65787] text-center text-xl", fontStyles.bodyLarge)}>
                                    생성 중{'.'.repeat(loadingDots)}
                                </p>
                            </div>
                        ) : !isGenerated ? (
                            <div className="flex-grow flex items-center justify-center h-full min-h-[200px]">
                                <p className={cn("text-[#767676] text-center", fontStyles.body)}>
                                    아직 플래너가<br/>생성되지 않았어요.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 mt-2">
                                {plannerCourses.map((course, index) => (
                                    <div 
                                        key={course.courseId} 
                                        className="flex items-center justify-between p-3 bg-[#252525] border border-[#404040] hover:border-[#606060] transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={() => toggleCheck(course.courseNumber)}
                                                className={cn(
                                                    "w-6 h-6 flex items-center justify-center border transition-colors",
                                                    checkedItems.includes(course.courseNumber) 
                                                        ? "bg-[#E65787] border-[#E65787]" 
                                                        : "bg-[#404040] border-[#606060] hover:border-[#808080]"
                                                )}
                                            >
                                                {checkedItems.includes(course.courseNumber) && (
                                                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 5L4.5 8.5L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                )}
                                            </button>
                                            <div className="flex flex-row items-center gap-2 flex-wrap">
                                                <span className={cn(
                                                    "text-white", 
                                                    fontStyles.body,
                                                    checkedItems.includes(course.courseNumber) && "text-[#767676] line-through"
                                                )}>
                                                    <span className="font-bold mr-1">{index + 1}</span>
                                                    {course.courseName}: {course.courseNumber}
                                                </span>
                                                <span className={cn(
                                                    "text-white", 
                                                    fontStyles.body,
                                                    "text-[0.6em] opacity-50 me-2",
                                                    checkedItems.includes(course.courseNumber) && "text-[#767676] line-through"
                                                )}>
                                                    {formatCourseTimes(course.courseTimes)}
                                                </span>
                                            </div>
                                        </div>
                                        <PinkButton 
                                            size="sm" 
                                            onClick={() => handleCopy(course.courseNumber, String(course.courseNumber))}
                                            className="w-[60px] h-[32px] text-xs leading-none relative"
                                        >
                                            <span className={cn(
                                                "absolute inset-0 flex items-center justify-center transition-opacity duration-300 whitespace-nowrap",
                                                copiedId === course.courseNumber ? "opacity-0" : "opacity-100"
                                            )}>
                                                복사
                                            </span>
                                            <span className={cn(
                                                "absolute inset-0 flex items-center justify-center transition-opacity duration-300 whitespace-nowrap",
                                                copiedId === course.courseNumber ? "opacity-100" : "opacity-0"
                                            )}>
                                                OK!
                                            </span>
                                        </PinkButton>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* AI Commentary */}
                    {isGenerated && aiComment && (
                        <Card title="AI 코멘터리" className="h-fit">
                            <div className={cn("text-[#BBB] mt-2 p-4 bg-[#252525]", fontStyles.body)}>
                                {aiComment}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
