import { useState, useRef, useCallback, useEffect } from 'react';
import api from '@/utils/apiClient';
import type { Course } from '@/apis/TimeTableAPI/types';

// 플래너 API 응답 데이터 타입
interface PlannerData {
    prioritized_courses: Course[];
    ai_comment: string;
}

// 폴링 상태 응답 타입
interface PlannerStatusResponse {
    status: 'WAITING' | 'COMPLETE' | 'ERROR';
    message: string;
    data: string | null;
}

interface UsePlannerGenerationReturn {
    isGenerating: boolean;
    isGenerated: boolean;
    loadingDots: number;
    plannerCourses: Course[];
    aiComment: string;
    handleGenerate: (timetableId: string) => Promise<void>;
    reset: () => void;
}

/**
 * 플래너 생성 및 상태 폴링을 관리하는 훅
 * - 플래너 생성 요청 (UUID 발급)
 * - 상태 폴링 (2초마다 확인)
 * - 로딩 애니메이션 (점 개수 변화)
 * - 데이터 파싱 및 상태 관리
 */
export function usePlannerGeneration(): UsePlannerGenerationReturn {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const [loadingDots, setLoadingDots] = useState(1);
    const [plannerCourses, setPlannerCourses] = useState<Course[]>([]);
    const [aiComment, setAiComment] = useState('');

    // 폴링 인터벌 ref
    const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startPolling = useCallback((plannerUuid: string) => {
        // 기존 폴링 정리
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }

        // 로딩 점 애니메이션 시작
        const dotInterval = setInterval(() => {
            setLoadingDots((prev) => (prev % 3) + 1);
        }, 500);

        const poll = async () => {
            try {
                const response = await api.get(`/check/${plannerUuid}/status`);
                const statusData: PlannerStatusResponse = response.data;

                if (statusData.status === 'COMPLETE' && statusData.data) {
                    // 폴링 종료
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                        pollingIntervalRef.current = null;
                    }
                    clearInterval(dotInterval);

                    // data 파싱 (JSON 문자열이 들어있음)
                    const plannerData: PlannerData = JSON.parse(statusData.data);

                    setPlannerCourses(plannerData.prioritized_courses);
                    setAiComment(plannerData.ai_comment);
                    setIsGenerating(false);
                    setIsGenerated(true);
                } else if (statusData.status === 'ERROR') {
                    // 에러 발생 시 폴링 종료
                    if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                        pollingIntervalRef.current = null;
                    }
                    clearInterval(dotInterval);
                    setIsGenerating(false);
                    alert('플래너 생성 중 오류가 발생했습니다: ' + statusData.message);
                }
                // WAITING 상태면 계속 폴링
            } catch (error) {
                console.error('폴링 에러:', error);
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                }
                clearInterval(dotInterval);
                setIsGenerating(false);
                alert('플래너 상태 확인 중 오류가 발생했습니다.');
            }
        };

        // 즉시 한 번 실행 후 2초마다 폴링
        poll();
        pollingIntervalRef.current = setInterval(poll, 2000);
    }, []);

    const handleGenerate = useCallback(
        async (timetableId: string) => {
            // 이미 생성된 상태라면 확인 대화상자
            if (isGenerated) {
                const confirmed = window.confirm('기존 플래너는 사라집니다! 계속하시겠습니까?');
                if (!confirmed) return;
            }

            setIsGenerating(true);
            setIsGenerated(false);
            setPlannerCourses([]);
            setAiComment('');
            setLoadingDots(1);

            try {
                // 최초 요청 (UUID 발급)
                const response = await api.post(`/timetable/${timetableId}/plans`);
                const plannerUuid: string = response.data;

                // 상태 폴링 시작
                startPolling(plannerUuid);
            } catch (error) {
                console.error('플래너 생성 요청 에러:', error);
                setIsGenerating(false);
                alert('플래너 생성 요청에 실패했습니다.');
            }
        },
        [isGenerated, startPolling]
    );

    const reset = useCallback(() => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
        setIsGenerating(false);
        setIsGenerated(false);
        setLoadingDots(1);
        setPlannerCourses([]);
        setAiComment('');
    }, []);

    // 컴포넌트 언마운트 시 폴링 정리
    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    return {
        isGenerating,
        isGenerated,
        loadingDots,
        plannerCourses,
        aiComment,
        handleGenerate,
        reset,
    };
}
