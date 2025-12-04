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
  creditsMajor: string;
  creditsLiberal: string;
  creditsCurrentTotal: string;
  creditsCurrentMajor: string;
  creditsCurrentLiberal: string;
};

export type MyPageFormProps = {
  formData: MyPageFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: SelectOption) => void;
  handleMajorChange: (index: number, value: SelectOption) => void;
  addMajor: () => void;
  removeMajor: (index: number) => void;
};
