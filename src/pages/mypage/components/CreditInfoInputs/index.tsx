// 추후 전공별, 교양별 이수학점 백엔드에서 추가시 수정 예정

import { TextInput } from '@/components/boxes/InputBox';
import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';
import type { MyPageFormProps } from '../../types';

export function CreditInfoInputs({ formData, handleChange }: Pick<MyPageFormProps, 'formData' | 'handleChange'>) {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-2">
      <span className={cn(fontStyles.body)}> 졸업학점(전체) </span>
      <span className={cn(fontStyles.body, 'invisible')}> 졸업학점(전공) </span>
      <span className={cn(fontStyles.body, 'invisible')}> 졸업학점(교양) </span>

      <TextInput
        size="md" type="number" name="creditsTotal"
        value={formData.creditsTotal} onChange={handleChange}
        className="border-2 border-[#888]"
      />
      <TextInput
        size="md" type="number" name="creditsMajor"
        value={/*formData.creditsMajor*/ ""} onChange={handleChange}
        className="border-2 border-[#888], invisible"
        disabled={true}
      />
      <TextInput
        size="md" type="number" name="creditsLiberal"
        value={/*formData.creditsLiberal*/ ""} onChange={handleChange}
        className="border-2 border-[#888], invisible"
        disabled={true}
      />
      <span className={cn(fontStyles.body)}> 현재 이수(전체) </span>
      <span className={cn(fontStyles.body, 'invisible')}> 현재 이수(전공) </span>
      <span className={cn(fontStyles.body, 'invisible')}> 현재 이수(교양) </span>

      <TextInput
        size="md" type="number" name="creditsCurrentTotal"
        value={formData.creditsCurrentTotal} onChange={handleChange}
        className="border-2 border-[#888]"
      />
      <TextInput
        size="md" type="number" name="creditsCurrentMajor"
        value={/*formData.creditsCurrentMajor*/ ""} onChange={handleChange}
        className="border-2 border-[#888], invisible"
        disabled={true}
      />
      <TextInput
        size="md" type="number" name="creditsCurrentLiberal"
        value={/*formData.creditsCurrentLiberal*/ ""} onChange={handleChange}
        className="border-2 border-[#888], invisible"
        disabled={true}
      />
    </div>
  );
}
