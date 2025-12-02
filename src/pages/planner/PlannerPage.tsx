import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { fontStyles } from '@/utils/styles';
import { cn } from '@/utils/util';
import { Card } from '@/components/Card';
import { CustomSelect } from '@/components/boxes/SelectBox';
import type { Option } from '@/components/boxes/SelectBox/types';
import { BasicButton } from '@/components/buttons/BasicButton';
import { PinkButton } from '@/components/buttons/PinkButton';

// Dummy Data
const DUMMY_TIMETABLES = [
    { id: 1, label: '시간표 1' },
    { id: 2, label: '시간표 2' },
    { id: 3, label: '시간표 3' },
];

const DUMMY_COURSES = [
    { id: 1, name: '자료구조론', code: '12345' },
    { id: 2, name: '데이터베이스', code: '45678' },
    { id: 3, name: '인공지능과 미래사회', code: '90123' },
    { id: 4, name: '전산통계학', code: '87561' },
    { id: 5, name: '오픈소스의이해', code: '83544' },
];

const DUMMY_COMMENTARY = "성공적인 수강신청을 위해 1순위 과목인 자료구조론을 먼저 신청하는 것을 추천합니다.";

export function PlannerPage() {
    const navigate = useNavigate();
    const [selectedTimetable, setSelectedTimetable] = useState<Option>(DUMMY_TIMETABLES[0]);
    const [serverUrl, setServerUrl] = useState('sugang.hanyang.ac.kr');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isGenerated, setIsGenerated] = useState(false);
    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    // Clock Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 10); // Update frequently for milliseconds
        return () => clearInterval(timer);
    }, []);

    const handleGenerate = () => {
        setIsGenerated(true);
    };

    const handleCheckServerTime = () => {
        // Dummy check action
        console.log(`Checking server time for ${serverUrl}`);
    };

    const handleCopy = (id: number, text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            // 자동으로 체크 처리
            if (!checkedItems.includes(id)) {
                setCheckedItems(prev => [...prev, id]);
            }
            setTimeout(() => {
                setCopiedId(null);
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const toggleCheck = (id: number) => {
        setCheckedItems(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Format Date: YYYY.MM.DD
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    // Format Time: HH:MM:SS.ms
    const formatTime = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ms = String(Math.floor(date.getMilliseconds() / 10)).padStart(2, '0'); // 2 digits
        return { hours, minutes, seconds, ms };
    };

    const time = formatTime(currentTime);

    return (
        <div className="w-full h-full p-8 flex flex-col gap-6 overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className={cn("text-white", fontStyles.title)}>플래너</h1>
                <BasicButton onClick={() => navigate({ to: '/list' })} className="px-4 py-2 text-sm">
                    ← 목록으로
                </BasicButton>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-12 gap-6 h-full">
                
                {/* Left Column */}
                <div className="flex flex-col gap-6 2xl:col-span-4">
                    {/* Planning Course Selection */}
                    <Card title="플래닝 강의 선택" className="h-fit overflow-visible">
                        <div className="flex gap-2 mt-2">
                            <div className="flex-grow">
                                <CustomSelect 
                                    options={DUMMY_TIMETABLES} 
                                    onChange={(value) => setSelectedTimetable(value)}
                                    defaultValue={selectedTimetable}
                                    size="full"
                                />
                            </div>
                            <BasicButton onClick={handleGenerate} className="whitespace-nowrap px-6">
                                생성
                            </BasicButton>
                        </div>
                    </Card>

                    {/* Server Time Check */}
                    <Card title="서버시간 확인" className="h-fit">
                        <div className="flex gap-2 mt-2 mb-6">
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

                {/* Right Column */}
                <div className="flex flex-col gap-6 2xl:col-span-8">
                    {/* AI Planner Result */}
                    <Card title="AI 플래너 결과" className="flex-grow min-h-[300px]">
                        {!isGenerated ? (
                            <div className="flex-grow flex items-center justify-center h-full min-h-[200px]">
                                <p className={cn("text-[#767676] text-center", fontStyles.body)}>
                                    아직 플래너가<br/>생성되지 않았어요.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 mt-2">
                                {DUMMY_COURSES.map((course) => (
                                    <div 
                                        key={course.id} 
                                        className="flex items-center justify-between p-3 bg-[#252525] border border-[#404040] hover:border-[#606060] transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Custom Checkbox */}
                                            <button 
                                                onClick={() => toggleCheck(course.id)}
                                                className={cn(
                                                    "w-6 h-6 flex items-center justify-center border transition-colors",
                                                    checkedItems.includes(course.id) 
                                                        ? "bg-[#E65787] border-[#E65787]" 
                                                        : "bg-[#404040] border-[#606060] hover:border-[#808080]"
                                                )}
                                            >
                                                {checkedItems.includes(course.id) && (
                                                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 5L4.5 8.5L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                )}
                                            </button>
                                            
                                            <span className={cn(
                                                "text-white", 
                                                fontStyles.body,
                                                checkedItems.includes(course.id) && "text-[#767676] line-through"
                                            )}>
                                                <span className="font-bold mr-2">{course.id}</span>
                                                {course.name}: {course.code}
                                            </span>
                                        </div>
                                        
                                        <PinkButton 
                                            size="sm" 
                                            onClick={() => handleCopy(course.id, course.code)}
                                            className="px-2 py-1 text-xs w-[60px]"
                                        >
                                            <span className={cn(
                                                "transition-opacity duration-300",
                                                copiedId === course.id ? "opacity-0 absolute" : "opacity-100"
                                            )}>
                                                복사
                                            </span>
                                            <span className={cn(
                                                "transition-opacity duration-300",
                                                copiedId === course.id ? "opacity-100" : "opacity-0 absolute"
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
                    {isGenerated && (
                        <Card title="AI 코멘터리" className="h-fit">
                            <div className={cn("text-[#BBB] mt-2 p-4 bg-[#252525]", fontStyles.body)}>
                                {DUMMY_COMMENTARY}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
