import type { Course as CourseType } from '@/components/TimeTable/types';

export interface CourseItemProps {
  course: CourseType;
  color: string;
  isActive?: boolean;
  onClick?: () => void;
}
