import { useState, useEffect } from 'react';
import api from '@/utils/apiClient';
import type { Option } from '@/components/boxes/SelectBox/types';

interface UseTimetableListReturn {
    timetables: Option[];
    selectedTimetable: Option | null;
    isLoading: boolean;
    setSelectedTimetable: (timetable: Option) => void;
}

interface UseTimetableListOptions {
    initialTimetableId?: string;
}

/**
 * 시간표 목록 조회 및 선택을 관리하는 훅
 * - API에서 시간표 목록 불러오기
 * - 선택된 시간표 관리
 * - 로딩 상태 관리
 * @param hookOptions.initialTimetableId - 초기에 선택할 시간표 ID (URL 파라미터 등에서 전달)
 */
export function useTimetableList(hookOptions?: UseTimetableListOptions): UseTimetableListReturn {
    const [timetables, setTimetables] = useState<Option[]>([]);
    const [selectedTimetable, setSelectedTimetable] = useState<Option | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTimetables = async () => {
            try {
                const response = await api.get('/timetable/lists');
                const data: { timetableId: string; name: string }[] = response.data;
                const optionsList: Option[] = data.map((item) => ({
                    id: item.timetableId,
                    label: item.name,
                }));
                setTimetables(optionsList);
                
                // 초기 timetableId가 있으면 해당 시간표 선택, 없으면 첫 번째 선택
                if (optionsList.length > 0) {
                    const initialId = hookOptions?.initialTimetableId;
                    const initialTimetable = initialId 
                        ? optionsList.find(t => t.id === initialId) 
                        : undefined;
                    setSelectedTimetable(initialTimetable || optionsList[0]);
                }
            } catch (error) {
                console.error('시간표 목록 조회 에러:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTimetables();
    }, [hookOptions?.initialTimetableId]);

    return {
        timetables,
        selectedTimetable,
        isLoading,
        setSelectedTimetable,
    };
}
