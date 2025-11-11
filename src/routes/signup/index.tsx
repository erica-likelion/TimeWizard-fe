import { createFileRoute, useNavigate } from '@tanstack/react-router'; 
import React, { useState } from 'react';
import { TextInput } from '@/components/boxes/InputBox';
import { PinkButton } from '@/components/buttons/PinkButton';
import { CustomSelect } from '@/components/boxes/SelectBox';
import { DarkOutlineButton } from '@/pages/SignUp/buttons/DarkButton';
import SignupBgImage from '@assets/images/signup.png';
import Cologo from '@assets/icons/billnut_col.svg';
import PixelLogo from '@assets/icons/time_table.svg';
import { signupUser } from '@/apis/Auth/authService'; 
import axios from 'axios'; // [✨ 신규]

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
      <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
        {/* 전공 블록 */}
        <div className="w-full md:w-[400px]">
          {/* 전공 레이블 + 버튼 */}
          <div className="inline-flex items-baseline gap-x-2 mb-1"> 
            <label className="font-galmuri text-sm text-white">전공</label> 
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
                    size="large"
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
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4">
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
    </div>
  );
}


// ... (SignupPage 컴포넌트) ...
function SignupPage() {
  const navigate = useNavigate(); 
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. 폼 유효성 검사
    if (formData.password !== formData.passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!formData.isAgreed) {
      alert('이용약관에 동의해주세요.');
      return;
    }
    
    // 2. API 명세에 맞게 데이터 가공
    const mainMajorId = formData.majors[0];
    const majorLabel = majorOptions.find(opt => opt.id === mainMajorId)?.label;

    if (!majorLabel) {
      alert('주전공을 선택해주세요.');
      return;
    }
    
    const signupData = {
      email: formData.id,
      password: formData.password,
      nickname: formData.nickname,
      university: "한양대학교 ERICA 캠퍼스", // 폼에서 하드코딩된 값
      major: majorLabel, // API 스펙: string
      grade: Number(formData.grade), // API 스펙: number
    };

    // 3. API 호출
    try {
      await signupUser(signupData); 
      
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate({ to: '/login' });

    } catch (error: any) {
      // 4. 에러 핸들링
      console.error('회원가입 실패:', error);
      // service에서 throw한 에러 메시지를 표시
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
      } else {
        alert(error.message || '알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* 1. 왼쪽 로고 영역 */}
      <div className="w-[433px] bg-[#303030] relative flex items-center justify-center p-8">
        <img
          src={PixelLogo}
          alt="픽셀 로고"
          className="w-auto h-auto object-contain"
        />
      </div>

      {/* 2. 오른쪽 폼 영역 */}
      <div
        style={{
          backgroundImage: `url(${SignupBgImage})`,
        }}
        className="
          flex-grow
          relative flex 
          py-10 px-4 md:px-16 lg:px-24
          bg-[#332A33] 
          bg-cover bg-no-repeat bg-center
          justify-center md:justify-start
        "
      >
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-3xl space-y-12 text-white p-6"
        >
          {/* 회원가입 헤더 */}
          <div className="text-left">
            <h1 className="text-3xl font-bold flex items-center">
              <span className="h-8 w-8 mr-2">
                <img src={Cologo} />
              </span>
              회원가입
            </h1>
            <p className="text-gray-400">빌넣을 선택해주셔서 감사합니다.</p>
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