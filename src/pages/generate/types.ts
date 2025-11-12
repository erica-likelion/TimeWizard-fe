// 옵션 타입
export interface Option {
  id: string | number
  label: string
}

// 제외 시간대 타입
export interface ExcludedTime {
  id: number
  day: string
  startTime: string
  endTime: string
}

// GenerateResultPage 컴포넌트의 Props 타입
export interface GenerateResultPageProps {
  gentimetableId: string;
  courses: import('@/apis/AIGenerateAPI/types').GeneratedCourse[];
  ai_comment: string;
}