import type { Course as CourseType } from '@/apis/TimeTableAPI/types';

export interface CourseItemProps {
  course: CourseType;
  color: string;
  isActive?: boolean;
  onMouseEnter?: () => void;
}
