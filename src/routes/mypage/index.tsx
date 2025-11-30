import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router';
import React, { useState } from 'react';
import { TextInput } from '@/components/boxes/InputBox';
import { PinkButton } from '@/components/buttons/PinkButton';
import { CustomSelect } from '@/components/boxes/SelectBox';
import { DarkOutlineButton } from '@/pages/SignUp/buttons/DarkButton';
import { Card } from '@/components/Card';

import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';

import { getUserProfile, updateUserProfile, updatePassword } from '@/apis/UserAPI/userApi';
import type { UserProfile } from '@/apis/UserAPI/types';

export const Route = createFileRoute('/mypage/')({
  loader: async () => {
    try {
      return await getUserProfile();
    } catch (error) {
      console.error("프로필 로딩 실패:", error);
      throw error; 
    }
  },
  component: MyPage,
});

const majorOptions = [
  { id: 1, label: '디자인테크놀로지 전공' },
  { id: 2, label: '컬처테크놀로지 전공' },
  { id: 3, label: '미디어테크놀로지 전공' },
  { id: 4, label: '컴퓨터 전공' },
];

const gradeOptions = [
  { id: 1, label: '1학년' },
  { id: 2, label: '2학년' },
  { id: 3, label: '3학년' },
  { id: 4, label: '4학년' },
  { id: 5, label: '5학년 이상' }
];

type SelectOption = { id: string | number; label: string };

type MyPageFormProps = {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: SelectOption) => void;
  handleMajorChange: (index: number, value: SelectOption) => void;
  addMajor: () => void;
  removeMajor: (index: number) => void;
};

// ... 컴포넌트들 ...
function MyPageSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-14">
      <p className={cn(fontStyles.subtitle, "lg:min-w-[120px]")}>{title}</p>
      <div className="flex-1 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function BasicInfoInputs({ formData, handleChange }: Pick<MyPageFormProps, 'formData' | 'handleChange'>) {
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
      />
    </>
  );
}

function SchoolInfoInputs({
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
              + 다전공 추가
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

function CreditInfoInputs({ formData, handleChange }: Pick<MyPageFormProps, 'formData' | 'handleChange'>) {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-2">
      <span className={cn(fontStyles.body)}> 졸업학점(전체) </span>
      <span className={cn(fontStyles.body)}> 졸업학점(전공) </span>
      <span className={cn(fontStyles.body)}> 졸업학점(교양) </span>
      
      <TextInput
        size="md" type="number" name="creditsTotal"
        value={formData.creditsTotal} onChange={handleChange}
        className="border-2 border-[#888]"
      />
      <TextInput
        size="md" type="number" name="creditsMajor"
        value={formData.creditsMajor} onChange={handleChange}
        className="border-2 border-[#888]"
        disabled={true}
      />
      <TextInput
        size="md" type="number" name="creditsLiberal"
        value={formData.creditsLiberal} onChange={handleChange}
        className="border-2 border-[#888]"
        disabled={true}
      />
      <span className={cn(fontStyles.body)}> 현재 이수(전체) </span>
      <span className={cn(fontStyles.body)}> 현재 이수(전공) </span>
      <span className={cn(fontStyles.body)}> 현재 이수(교양) </span>
      
      <TextInput
        size="md" type="number" name="creditsCurrentTotal"
        value={formData.creditsCurrentTotal} onChange={handleChange}
        className="border-2 border-[#888]"
      />
      <TextInput
        size="md" type="number" name="creditsCurrentMajor"
        value={formData.creditsCurrentMajor} onChange={handleChange}
        className="border-2 border-[#888]"
        disabled={true}
      />
      <TextInput
        size="md" type="number" name="creditsCurrentLiberal"
        value={formData.creditsCurrentLiberal} onChange={handleChange}
        className="border-2 border-[#888]"
        disabled={true}
      />
    </div>
  );
}

function SubmitSection({ formData }: Pick<MyPageFormProps, 'formData'>) {
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


function MyPage() {
  const navigate = useNavigate();
  const router = useRouter(); // 데이터 리로드용
  
  // ✅ 1. Loader 데이터 가져오기 (API 호출 결과)
  const userProfile: UserProfile = Route.useLoaderData();

  // ✅ 2. API 데이터 -> Form 데이터 매핑
  // 전공 string을 ID로 변환 (예: "컴퓨터 전공" -> 4)
  // 매칭되는 게 없으면 기본값 1
  const initialMajorId = majorOptions.find(opt => opt.label === userProfile.major)?.id || 1;

  const [formData, setFormData] = useState({
    id: userProfile.email,        // 이메일
    currentPassword: '',          // 현재 비번 (API 필수)
    password: '',                 // 새 비번
    passwordCheck: '',
    nickname: userProfile.nickname,
    majors: [initialMajorId],     // 다전공 배열
    grade: userProfile.grade, 
    
    // 학점 정보 (숫자 -> 문자열 변환)
    creditsTotal: userProfile.graduation_credits?.toString() || '0',
    creditsMajor: '0',            // API에 없으면 0 처리
    creditsLiberal: '0',
    creditsCurrentTotal: userProfile.completed_credits?.toString() || '0',
    creditsCurrentMajor: '0',
    creditsCurrentLiberal: '0',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: SelectOption) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value.id,
    }));
  };

  const handleMajorChange = (index: number, value: SelectOption) => {
    const newMajors: (string | number)[] = [...formData.majors];
    newMajors[index] = value.id;
    setFormData((prev: any) => ({
      ...prev,
      majors: newMajors,
    }));
  };

  const addMajor = () => {
    if (formData.majors.length >= 2) { 
      alert('전공은 최대 2개까지 선택할 수 있습니다.');
      return;
    }
    setFormData((prev: any) => ({
      ...prev,
      majors: [...prev.majors, majorOptions[0].id], 
    }));
  };

  const removeMajor = (indexToRemove: number) => {
    if (formData.majors.length <= 1) {
      alert('주전공은 삭제할 수 없습니다.');
      return;
    }
    const newMajors = formData.majors.filter(
      (_: string | number, index: number) => index !== indexToRemove,
    );
    setFormData((prev: any) => ({
      ...prev,
      majors: newMajors,
    }));
  };

  // ✅ 3. API 수정 요청 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (formData.password && formData.password !== formData.passwordCheck) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 3-1. 기본 정보 수정 (닉네임, 전공 등)
      // 선택된 전공 ID를 다시 String Label로 변환해서 보냄
      const selectedMajorLabel = majorOptions.find(opt => opt.id === formData.majors[0])?.label || "";

      await updateUserProfile({
        nickname: formData.nickname,
        major: selectedMajorLabel, 
        grade: Number(formData.grade),
        // 필요한 경우 전화번호 등 다른 필드 추가
      });

      // 3-2. 비밀번호 변경 (입력된 경우에만 수행)
      if (formData.password) {
        if (!formData.currentPassword) {
            alert("비밀번호를 변경하려면 현재 비밀번호를 입력해주세요.");
            return;
        }
        await updatePassword({
            current_password: formData.currentPassword,
            new_password: formData.password
        });
      }
      
      alert('정보가 수정되었습니다.');
      
      // ✅ 4. 데이터 갱신 및 초기화
      router.invalidate(); // Loader 재실행 -> 최신 데이터 반영
      setFormData(prev => ({ 
        ...prev, 
        currentPassword: '', 
        password: '', 
        passwordCheck: '' 
      }));

    } catch (error: any) {
      console.error('Update failed:', error);
      alert(error.message || '정보 수정에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 페이지 제목 */}
      <div className="pb-5 flex-shrink-0">
        <p className={fontStyles.title}>마이페이지</p>
      </div>

      {/* 폼 영역 */}
      <form onSubmit={handleSubmit} className="flex-1 pb-11">
        <Card className="h-full gap-5 lg:min-h-[calc(100dvh-205px)]">
          {/* 3-1. 기본정보 섹션 */}
          <MyPageSection title="기본정보">
            <BasicInfoInputs formData={formData} handleChange={handleChange} />
          </MyPageSection>

          {/* 3-2. 학교정보 섹션 */}
          <MyPageSection title="학교정보">
            <SchoolInfoInputs
              formData={formData}
              handleSelectChange={handleSelectChange}
              handleMajorChange={handleMajorChange}
              addMajor={addMajor}
              removeMajor={removeMajor}
            />
          </MyPageSection>

          {/* 3-3. 학점정보 섹션 */}
          <MyPageSection title="학점정보">
            <CreditInfoInputs formData={formData} handleChange={handleChange} />
          </MyPageSection>

          {/* 3-4. 제출 버튼  */}
          <div className="flex flex-col lg:flex-row gap-4 justify-end mt-auto flex-wrap">
            <SubmitSection formData={formData} />
          </div>
        </Card>
      </form>
    </div>
  );
}