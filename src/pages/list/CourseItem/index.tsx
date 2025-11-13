import React from 'react';
import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';
import type { CourseItemProps } from './types';

const ScheduleLabelIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="40" height="40" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M33 3V7H41V15H45V33H41V41H33V45H15V41H7V33H3V15H7V7H15V3H33Z"
      fill={color}
      stroke='#D7D9DF'
      strokeWidth="2"
    />
  </svg>
);


export const CourseItem: React.FC<CourseItemProps> = ({ course, color, isActive, onMouseEnter }) => {
    const activeColor = isActive ? 'bg-[#303030] border-[#C1446C]' : 'bg-[#303030] border-[#D7D9DF]';

    // 한 강의가 시간대가 여러개라 강의실도 여러개인 경우, 쉼표로 구분
    // 동일한 강의실은 한번만 뜨게 집합 썼음
    const classrooms = [...new Set(course.courseTimes.map(ct => ct.classroom))].join(', ');

    return (
    <div className={cn("flex items-center p-[14px] gap-4 border-2 cursor-pointer", activeColor)}
        onMouseEnter={onMouseEnter}>
        <div className="">
            <ScheduleLabelIcon color={color} />
        </div>
        <div className="flex-1">
            <p className={cn(fontStyles.body)}>
                {course.courseName}
            </p>

            <p className={cn(fontStyles.caption, "text-[#BBB]")}>
                {classrooms}
            </p>
        </div>
        <div className="mr-5">
            <p className={cn(fontStyles.body, "text-[#FBFBFB]")}>
                {course.professor}
            </p>
        </div>
    </div>
    );
};