import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { generateTimetable, getGenerationStatus } from '@/apis/AIGenerateAPI/aiGenerateApi';
import type { GenerateTimetableRequest } from '@/apis/AIGenerateAPI/types';

/*
  AI 시간표 생성 지원해주는 훅
    isGenerating => 로딩 화면 띄우기 용, 작업이 끝났는지 안끝났는지 boolean
    loadingIndex, loadingMessages => loadingMessages[loadingIndex]로 10초마다 메세지 바꿈
    handleGenerate => 실제로 생성 API 호출
*/

export function useGenerateTimetable() {
  const navigate = useNavigate();

  // AI 생성 중 상태
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // 로딩 메시지 인덱스
  const [loadingIndex, setLoadingIndex] = useState(0);

  const loadingMessages = [
    "학기를 망치기 않기 위해 심혈을 기울이는 중...",
    "마법사가 열심히 시간표를 만들고 있습니다!",
    "우주의 기운을 모아 최적의 시간표를 짜는 중...",
    "AI가 땀 흘리며 작업 중입니다!",
    "최고의 캠퍼스 라이프를 위해 노력 중입니다!"
  ];

  // 로딩 메시지 자동 변경
  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setLoadingIndex(prev => (prev + 1) % loadingMessages.length);
    }, 10000); // 10초마다 변경

    return () => clearInterval(interval);
  }, [isGenerating, loadingMessages.length]);

  // 생성 시작
  const handleGenerate = async (requestData: GenerateTimetableRequest): Promise<void> => {
    try {
      setIsGenerating(true);
      setLoadingIndex(0); // 로딩 메시지 초기화

      console.log('AI 시간표 생성 요청:', requestData);

      // 1단계: 시간표 생성 시작
      const uuid = await generateTimetable(requestData);

      console.log('AI 시간표 생성 응답:', uuid);

      // UUID를 taskId
      const taskId = uuid;

      // 2단계: 폴링으로 생성 상태 확인 (5초마다, 최대 24번 시도 = 120초)
      const MAX_ATTEMPTS = 24;
      const POLLING_INTERVAL = 5000;
      let attempts = 0;

      const checkStatus = async (): Promise<void> => {
        try {
          attempts++;
          console.log(`시간표 생성 상태 확인 시도 ${attempts}/${MAX_ATTEMPTS}`);

          const statusResponse = await getGenerationStatus(taskId);

          console.log('AI 시간표 생성 상태 응답:', statusResponse);

          // 상태에 따라 처리
          if (statusResponse.status === 'COMPLETE') {
            // 생성 성공 - JSON 파싱하여 데이터 추출
            setIsGenerating(false);
            const courseData = JSON.parse(statusResponse.data);
            navigate({
              to: `/generate/${taskId}`,
              state: {
                courses: courseData.courses,
                ai_comment: courseData.ai_comment,
                requestData: requestData
              } as any
            });
          } else if (statusResponse.status === 'ERROR') {
            // 생성 실패 - 에러 메시지 표시
            setIsGenerating(false);
            alert(`${statusResponse.message}`);
          } else if (statusResponse.status === 'NOT_FOUND') {
            // 찾을 수 없음
            setIsGenerating(false);
            alert(`${statusResponse.message}`);
          } else if (statusResponse.status === 'WAITING') {
            if (attempts >= MAX_ATTEMPTS) { // 타임 아웃 처리
              setIsGenerating(false);
              alert('시간표 생성이 너무 오래 걸립니다.\n다시 시도해주세요.');
              navigate({ to: '/generate' });
            } else {
              setTimeout(checkStatus, POLLING_INTERVAL); // 5초 후 다시 시도
            }
          }
        } catch (error) {
          console.error('시간표 생성 상태 확인 실패:', error);
          setIsGenerating(false);
          alert('시간표 생성 상태 확인에 실패했습니다. 다시 시도해주세요.');
        }
      };

      checkStatus();
    } catch (error) {
      console.error('시간표 생성 실패:', error);
      alert('시간표 생성에 실패했습니다. 다시 시도해주세요.');
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    loadingIndex,
    loadingMessages,
    handleGenerate
  };
}
