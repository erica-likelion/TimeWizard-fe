import React from 'react';

export type SelectOption = { id: string | number; label: string };

export type SignupFormProps = {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: SelectOption) => void;
  handleMajorChange: (index: number, value: SelectOption) => void;
  addMajor: () => void;
  removeMajor: (index: number) => void;
};