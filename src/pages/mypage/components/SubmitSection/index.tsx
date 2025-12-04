import { PinkButton } from '@/components/buttons/PinkButton';
import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';
import type { MyPageFormProps } from '../../types';

export function SubmitSection({ formData }: Pick<MyPageFormProps, 'formData'>) {
  // 새 비밀번호가 입력되었을 때만 비밀번호 일치 여부 확인
  const isPasswordChanging = formData.password.length > 0;
  const passwordMismatch = isPasswordChanging && (formData.password !== formData.passwordCheck);

  return (
    <div className="flex flex-col lg:flex-row w-full lg:w-auto gap-4 self-end">
      <PinkButton
        type="submit"
        size="sm"
        disabled={passwordMismatch}
        className={cn(
          "w-full lg:w-auto px-8 py-2 min-h-14",
          fontStyles.button,
          passwordMismatch && 'opacity-50 cursor-not-allowed'
        )}
      >
        정보 수정
      </PinkButton>
    </div>
  );
}
