import { TextInput } from '@/components/boxes/InputBox';
import { CustomSelect } from '@/components/boxes/SelectBox';
import { DarkOutlineButton } from '@/pages/SignUp/buttons/DarkButton';
import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';
import { majorOptions, gradeOptions } from '@/constants/options';
import type { MyPageFormProps } from '../../types';

export function SchoolInfoInputs({
  formData,
  handleSelectChange,
  handleMajorChange,
  addMajor,
  removeMajor
}: Pick<
  MyPageFormProps,
  'formData' | 'handleSelectChange' | 'handleMajorChange' | 'addMajor' | 'removeMajor'
>) {
  const majorsList = formData.majors as (string | number)[];
  const canAddMajor = majorsList.length < 2;

  return (
    <>
      <TextInput
        size="md"
        value="한양대학교 ERICA 캠퍼스"
        disabled
        className="border-2 border-[#888]"
      />
      <div className="flex flex-col md:flex-row md:items-start md:gap-4">
        <div className="w-full">
          <div className="inline-flex items-baseline gap-x-2 mb-1">
            <span className={cn(fontStyles.body)}> 전공 </span>
            <DarkOutlineButton
              size="default"
              type="button"
              onClick={addMajor}
              disabled={!canAddMajor}
              className={!canAddMajor ? 'opacity-50 cursor-not-allowed' : ''}
            >
              + 부전공
            </DarkOutlineButton>
          </div>
          <div className="space-y-2">
            {majorsList.map((majorId, index) => (
              <div key={index} className="flex items-center gap-x-2">
                <div className="flex-grow">
                  <CustomSelect
                    size="full"
                    options={majorOptions}
                    defaultValue={majorOptions.find(
                      (opt) => opt.id === majorId,
                    )}
                    // 키를 줘서 데이터 변경시 리렌더링 유도
                    key={`major-${index}-${majorId}`}
                    onChange={(value) => handleMajorChange(index, value)}
                  />
                </div>
                {index > 0 && (
                  <p
                        onClick={() => removeMajor(index)}
                        className={cn(fontStyles.caption, "ml-2 text-[#C1446C] underline self-end cursor-pointer")}>
                        삭제
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full mt-4 md:mt-0">
          <div className="mb-1 flex items-baseline h-[32px]">
            <span className={cn(fontStyles.body)}> 학년 </span>
          </div>
          <CustomSelect
            size="small"
            options={gradeOptions}
            defaultValue={gradeOptions.find(
              (opt) => opt.id === formData.grade,
            )}
            key={`grade-${formData.grade}`}
            onChange={(value) => handleSelectChange('grade', value)}
          />
        </div>
      </div>
    </>
  );
}
