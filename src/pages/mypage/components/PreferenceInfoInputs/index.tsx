import { TextInput } from '@/components/boxes/InputBox';
import { CustomSelect } from '@/components/boxes/SelectBox';
import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';
import type { SelectOption, MyPageFormProps, DayType } from '../../types';
import { DAY_MAP } from '../../types';

export function PreferenceInfoInputs({
  formData,
  handleChange,
  handleSelectChange
}: Pick<MyPageFormProps, 'formData' | 'handleChange' | 'handleSelectChange'>) {
  // 시간 옵션 생성 (09:00 ~ 21:00, 30분 단위)
  const timeOptions: SelectOption[] = [];
  for (let hour = 9; hour <= 21; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 21 && minute === 30) break;
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push({ id: timeStr, label: timeStr });
    }
  }

  const days: DayType[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const toggleDay = (day: DayType) => {
    const currentDays = formData.preferredDays;
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];

    handleChange({
      target: { name: 'preferredDays', value: newDays }
    } as any);
  };

  return (
    <>
      {/* 선호 요일 */}
      <div className="flex flex-col gap-2">
        <span className={cn(fontStyles.body)}>선호 요일</span>
        <div className="flex flex-wrap gap-2">
          {days.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={cn(
                "px-4 py-2 border-2 transition-colors",
                formData.preferredDays.includes(day)
                  ? "bg-[#E65787] border-[#E65787] text-white"
                  : "bg-transparent border-[#888] text-[#888] hover:border-[#E65787]"
              )}
            >
              {DAY_MAP[day]}
            </button>
          ))}
        </div>
      </div>

      {/* 선호 시간대 */}
      <div className="flex flex-col gap-2">
        <span className={cn(fontStyles.body)}>선호 시간대</span>
        <div className="flex items-center gap-2">
          <CustomSelect
            size="small"
            options={timeOptions}
            defaultValue={timeOptions.find(t => t.id === formData.preferredStartTime) || timeOptions[0]}
            key={`start-${formData.preferredStartTime}`}
            onChange={(value) => handleSelectChange('preferredStartTime', value)}
          />
          <span className="text-white">~</span>
          <CustomSelect
            size="small"
            options={timeOptions}
            defaultValue={timeOptions.find(t => t.id === formData.preferredEndTime) || timeOptions[0]}
            key={`end-${formData.preferredEndTime}`}
            onChange={(value) => handleSelectChange('preferredEndTime', value)}
          />
        </div>
      </div>

      {/* 목표 학점 */}
      <div className="flex flex-col gap-2">
        <span className={cn(fontStyles.body)}>목표 학점</span>
        <TextInput
          size="md"
          type="number"
          name="targetCredits"
          value={formData.targetCredits}
          onChange={handleChange}
          className="border-2 border-[#888]"
          placeholder="20"
        />
      </div>

      {/* 필수 수강 과목 */}
      <div className="flex flex-col gap-2">
        <span className={cn(fontStyles.body)}>필수 수강 과목</span>
        <TextInput
          size="md"
          name="requiredCourses"
          value={formData.requiredCourses}
          onChange={handleChange}
          className="border-2 border-[#888]"
          placeholder="수업번호를 쉼표로 구분하여 입력 (예: 20001, 20002)"
        />
        <p className={cn(fontStyles.caption, "text-gray-400")}>
          * 꼭 들어야 하는 강의의 수업번호를 입력하세요.
        </p>
      </div>

      {/* 제외 과목 */}
      <div className="flex flex-col gap-2">
        <span className={cn(fontStyles.body)}>제외 과목</span>
        <TextInput
          size="md"
          name="excludedCourses"
          value={formData.excludedCourses}
          onChange={handleChange}
          className="border-2 border-[#888]"
          placeholder="수업번호를 쉼표로 구분하여 입력 (예: 20001, 20002)"
        />
        <p className={cn(fontStyles.caption, "text-gray-400")}>
          * 듣고 싶지 않은 강의의 수업번호를 입력하세요.
        </p>
      </div>
    </>
  );
}
