import { createFileRoute } from '@tanstack/react-router';
import React, { useState } from 'react';
import { TextInput } from '@/components/boxes/InputBox';
import { PinkButton } from '@/components/buttons/PinkButton';
import { CustomSelect } from '@/components/boxes/SelectBox';
import { DarkOutlineButton } from '@/pages/SignUp/buttons/DarkButton';
import SignupBgImage from '@assets/images/signup.png';
import TitleSvg from '@assets/icons/billnut_col.svg';
import PixelLogo from '@assets/icons/time_table.png';

export const Route = createFileRoute('/signup/')({
  component: SignupPage,
});

// ... (majorOptions, gradeOptions, SelectOption 타입은 동일) ...
const majorOptions = [
  { id: 1, label: '디자인테크놀로지 전공' },
  { id: 2, label: '컬처테크놀로지 전공' },
  { id: 3, label: '미디어테크놀로지 전공' },
  { id: 4, label: '컴퓨터 전공' },
  { id: 5, label: '소프트웨어 전공' },
  { id: 6, label: '인공지능학과' },
  { id: 7, label: '수리데이터사이언스학과' },
  { id: 8, label: '미디어학과' },
  { id: 9, label: '경영학부' },
  { id: 10, label: '광고홍보학과' },
  { id: 11, label: '문화콘텐츠학과' },
];

const gradeOptions = [
  { id: 1, label: '1학년' },
  { id: 2, label: '2학년' },
  { id: 3, label: '3학년' },
  { id: 4, label: '4학년' },
  { id: 5, label: '5학년 이상' },
];

type SelectOption = { id: string | number; label: string };

// ... (Props 타입, SignupSection, BasicInfoInputs) ...
type SignupFormProps = {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: SelectOption) => void;
  handleMajorChange: (index: number, value: SelectOption) => void;
  addMajor: () => void;
  removeMajor: (index: number) => void;
};

function SignupSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:gap-6">
      <div className="mb-4 md:mb-0 md:w-[100px] flex-shrink-0">
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="flex-grow space-y-4">{children}</div>
    </div>
  );
}

function BasicInfoInputs({ formData, handleChange }: Pick<SignupFormProps, 'formData' | 'handleChange'>) {
  return (
    <>
      <div className="flex w-full items-center space-x-2 group">
        <TextInput
          size="md"
          className="flex-grow"
          placeholder="아이디 (이메일)"
          name="id"
          value={formData.id}
          onChange={handleChange}
        />
        <PinkButton
          size="md"
          onClick={() => alert('ID 중복 확인')}
          className="whitespace-nowrap"
        >
          ID 확인
        </PinkButton>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextInput
          size="md"
          type="password"
          placeholder="비밀번호"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <TextInput
          size="md"
          type="password"
          placeholder="비밀번호 확인"
          name="passwordCheck"
          value={formData.passwordCheck}
          onChange={handleChange}
        />
      </div>
      <TextInput
        size="md"
        placeholder="닉네임(미입력 시 랜덤)"
        name="nickname"
        value={formData.nickname}
        onChange={handleChange}
      />
    </>
  );
}


// [✨ 수정됨] 3. 학교정보 입력 컴포넌트
function SchoolInfoInputs({
  formData,
  handleSelectChange,
  handleMajorChange,
  addMajor,
  removeMajor
}: Pick<
  SignupFormProps,
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
        className="bg-gray-700 text-gray-400"
      />
      <div className="flex flex-col md:items-baseline md:gap-4">

        {/* 전공 레이블 + 버튼 */}
        <div className="inline-flex items-baseline gap-x-2 mb-1"> 
          <label className="font-galmuri text-md text-white">전공</label> 
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

        {/* 전공 블록 */}
        <div className="w-full">
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
                    onChange={(value) => handleMajorChange(index, value)}
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeMajor(index)}
                    className="font-galmuri text-white text-2xl h-[54px] px-3 flex-shrink-0 hover:text-red-500" 
                  >
                    -
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* 학년 블록 */}
        <div className="w-full mt-4 md:mt-0 md:w-[192px]">
          {/* [✨ 수정됨] h-[32px], pt-1, flex 등 불필요한 스타일 제거 */}
          <div className="mb-1">
            <label className="font-galmuri text-sm text-white block">학년</label> 
          </div>
          <CustomSelect
            size="small"
            options={gradeOptions}
            defaultValue={gradeOptions.find( 
              (opt) => opt.id === formData.grade,
            )}
            onChange={(value) => handleSelectChange('grade', value)}
          />
        </div>
      </div>
    </>
  );
}

// ... (CreditInfoInputs, SubmitSection) ...
function CreditInfoInputs({ formData, handleChange }: Pick<SignupFormProps, 'formData' | 'handleChange'>) {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-2">
      <label className="text-sm text-gray-400 col-span-1">졸업학점(전체)</label>
      <label className="text-sm text-gray-400 col-span-1">졸업학점(전공)</label>
      <label className="text-sm text-gray-400 col-span-1">졸업학점(교양)</label>
      
      <TextInput
        size="md" type="number" name="creditsTotal"
        value={formData.creditsTotal} onChange={handleChange}
      />
      <TextInput
        size="md" type="number" name="creditsMajor"
        value={formData.creditsMajor} onChange={handleChange}
      />
      <TextInput
        size="md" type="number" name="creditsLiberal"
        value={formData.creditsLiberal} onChange={handleChange}
      />

      <label className="text-sm text-gray-400 col-span-1 mt-2">현재 이수(전체)</label>
      <label className="text-sm text-gray-400 col-span-1 mt-2">현재 이수(전공)</label>
      <label className="text-sm text-gray-400 col-span-1 mt-2">현재 이수(교양)</label>
      
      <TextInput
        size="md" type="number" name="creditsCurrentTotal"
        value={formData.creditsCurrentTotal} onChange={handleChange}
      />
      <TextInput
        size="md" type="number" name="creditsCurrentMajor"
        value={formData.creditsCurrentMajor} onChange={handleChange}
      />
      <TextInput
        size="md" type="number" name="creditsCurrentLiberal"
        value={formData.creditsCurrentLiberal} onChange={handleChange}
      />
    </div>
  );
}

function SubmitSection({ formData, handleChange }: Pick<SignupFormProps, 'formData' | 'handleChange'>) {
  return (
    <div className="flex flex-wrap md:items-center md:justify-between gap-4 pt-4">
      <div className="flex items-center flex-shrink-0"> 
        <input
          id="agree"
          name="isAgreed"
          type="checkbox"
          checked={formData.isAgreed}
          onChange={handleChange}
          className="h-4 w-4 rounded text-pink-600 focus:ring-pink-500"
        />
        <label htmlFor="agree" className="ml-2 block text-sm text-gray-300 whitespace-nowrap">
          빌넣 이용약관, 개인정보 수집·이용약관에 동의합니다.
        </label>
      </div>
      <PinkButton
        type="submit"
        size="custom"
        disabled={!formData.isAgreed || !formData.id || !formData.password || formData.password !== formData.passwordCheck}
        className={
          (!formData.isAgreed || !formData.id || !formData.password || formData.password !== formData.passwordCheck)
            ? 'opacity-50 cursor-not-allowed w-full md:w-auto whitespace-nowrap h-[30px] px-35 text-xl'
            : 'w-full md:w-auto whitespace-nowrap h-[30px] px-35 text-xl'
        }
      >
        회원가입!
      </PinkButton>
    </div>
  );
}


// ... (SignupPage 컴포넌트) ...
function SignupPage() {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    passwordCheck: '',
    nickname: '',
    majors: [majorOptions[0].id] as (string | number)[], 
    grade: gradeOptions[0].id,
    creditsTotal: '140',
    creditsMajor: '75',
    creditsLiberal: '10',
    creditsCurrentTotal: '0',
    creditsCurrentMajor: '0',
    creditsCurrentLiberal: '0',
    isAgreed: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: SelectOption) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value.id,
    }));
  };

  const handleMajorChange = (index: number, value: SelectOption) => {
    const newMajors: (string | number)[] = [...formData.majors];
    newMajors[index] = value.id;
    setFormData((prev) => ({
      ...prev,
      majors: newMajors,
    }));
  };

  const addMajor = () => {
    if (formData.majors.length >= 2) { 
      alert('전공은 최대 2개까지 선택할 수 있습니다.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      majors: [...prev.majors, majorOptions[0].id], 
    }));
  };

  const removeMajor = (indexToRemove: number) => {
    if (formData.majors.length <= 1) return; 
    
    const newMajors = formData.majors.filter(
      (_, index) => index !== indexToRemove,
    );
    setFormData((prev) => ({
      ...prev,
      majors: newMajors,
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!formData.isAgreed) {
      alert('이용약관에 동의해주세요.');
      return;
    }
    
    console.log('폼 제출:', formData); 
    alert('회원가입 시도! (콘솔 로그 확인)');
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* 1. 왼쪽 로고 영역 */}
      <div className="
        hidden md:flex md:w-1/3 lg:w-1/4 
        items-center justify-center 
        bg-[#2C2C2C] p-8
      ">
        <img 
          src={PixelLogo}
          alt="로고" 
          className="w-full max-w-[150px]"
        />
      </div>

      {/* 2. 오른쪽 폼 영역 */}
      <div
        style={{
          backgroundImage: `url(${SignupBgImage})`,
        }}
        className="
          flex w-full md:w-2/3 lg:w-3/4 
          items-center justify-center md:justify-start /* 폼을 왼쪽 정렬 (디자인 시안 기준) */
          p-8 md:p-16 lg:p-24 /* 폼의 왼쪽 여백 */
          bg-[#1A1A1A] /* 이미지 로드 실패 시 배경색 */
          bg-cover bg-center bg-no-repeat
        "
      >
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-3xl space-y-12 text-white p-6"
        >
          {/* 회원가입 헤더 */}
          <div>
            <div className="flex items-center gap-x-2">
            <img 
              src={TitleSvg} 
              alt="빌넣 로고" 
              className="w-20 h-auto ms-[-6px]" 
            />
            <span className="font-galmuri text-3xl text-white">회원가입</span>
            </div>
            <p className="text-gray-400">빌넣에 오신 것을 환영합니다!</p> 
          </div>

          {/* 3-1. 기본정보 섹션 */}
          <SignupSection title="기본정보">
            <BasicInfoInputs formData={formData} handleChange={handleChange} />
          </SignupSection>

          {/* 3-2. 학교정보 섹션 */}
          <SignupSection title="학교정보">
            <SchoolInfoInputs
              formData={formData}
              handleSelectChange={handleSelectChange}
              handleMajorChange={handleMajorChange}
              addMajor={addMajor}
              removeMajor={removeMajor}
            />
          </SignupSection>

          {/* 3-3. 학점정보 섹션 */}
          <SignupSection title="학점정보">
            <CreditInfoInputs formData={formData} handleChange={handleChange} />
          </SignupSection>

          {/* 3-4. 제출 버튼 및 약관 동의 */}
          <SubmitSection formData={formData} handleChange={handleChange} />

        </form>
      </div>
    </div>
  );
}