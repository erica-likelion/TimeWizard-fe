import { TextInput } from '@/components/boxes/InputBox';
import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';
import type { MyPageFormProps } from '../../types';

export function BasicInfoInputs({ formData, handleChange }: Pick<MyPageFormProps, 'formData' | 'handleChange'>) {
  return (
    <>
      <div className="flex w-full items-center space-x-2 group">
        <TextInput
          size="md"
          className="w-full border-2 border-[#888]"
          placeholder="아이디 (이메일)"
          name="id"
          value={formData.id}
          onChange={handleChange}
          disabled
          type="email"
        />
      </div>

      {/* 비밀번호 필드 */}
      <div className="w-full">
         <TextInput
          size="md"
          className="border-2 border-[#888]"
          type="password"
          placeholder="현재 비밀번호"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
        />
        <p className={cn(fontStyles.caption, "text-gray-400 mt-1")}>* 비밀번호 변경 시에만 입력하세요.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextInput
          size="md"
          className="border-2 border-[#888]"
          type="password"
          placeholder="새 비밀번호"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <TextInput
          size="md"
          className="border-2 border-[#888]"
          type="password"
          placeholder="새 비밀번호 확인"
          name="passwordCheck"
          value={formData.passwordCheck}
          onChange={handleChange}
        />
      </div>
      <TextInput
        size="md"
        className="border-2 border-[#888]"
        placeholder="닉네임"
        name="nickname"
        value={formData.nickname}
        onChange={handleChange}
        type="text"
      />
    </>
  );
}
