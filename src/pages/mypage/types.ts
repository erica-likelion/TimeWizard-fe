export type SelectOption = {
  id: string | number;
  label: string
};

export type MyPageFormData = {
  id: string;
  currentPassword: string;
  password: string;
  passwordCheck: string;
  nickname: string;
  majors: (string | number)[];
  grade: number;
  creditsTotal: string;
  //creditsMajor: string;
  //creditsLiberal: string;
  creditsCurrentTotal: string;
  //creditsCurrentMajor: string;
  //creditsCurrentLiberal: string;

  // 선호도 정보
  preferredDays: string[];
  preferredStartTime: string;
  preferredEndTime: string;
  targetCredits: string;
  requiredCourses: string;
  excludedCourses: string;
};

export type MyPageFormProps = {
  formData: MyPageFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: SelectOption) => void;
  handleMajorChange: (index: number, value: SelectOption) => void;
  addMajor: () => void;
  removeMajor: (index: number) => void;
};

export type DayType = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export const DAY_MAP: { [key in DayType]: string } = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일',
};
