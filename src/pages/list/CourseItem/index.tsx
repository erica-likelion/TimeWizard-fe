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


export const CourseItem: React.FC<CourseItemProps> = ({ course, color, isActive, onClick }) => {
    const activeColor = isActive ? 'border-[#C1446C]' : 'bg-[#303030] hover:bg-[#767676] border-[#D7D9DF]';
    return (
    <div className={cn("flex items-center p-[14px] gap-4 border-2 cursor-pointer", activeColor)}
        onClick={onClick}>
        <div className="">
            <ScheduleLabelIcon color={color} />
        </div>
        <div className="flex-1">
            <p className={cn(fontStyles.body)}>
                {course.course_name}
            </p>
            
            <p className={cn(fontStyles.caption, "text-[#BBB]")}>
                {course.location}
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