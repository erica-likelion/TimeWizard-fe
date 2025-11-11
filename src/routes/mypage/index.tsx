import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { TextInput } from '@/components/boxes/InputBox';
import { PinkButton } from '@/components/buttons/PinkButton';
import { CustomSelect } from '@/components/boxes/SelectBox';
import { DarkOutlineButton } from '@/pages/SignUp/buttons/DarkButton';
import SignupBgImage from '@assets/images/signup.png'; 
import Cologo from '@assets/icons/billnut_col.svg';
import PixelLogo from '@assets/icons/time_table.png';


export const Route = createFileRoute('/mypage/')({
  component: MyPage,
});

// ... (majorOptions, gradeOptions, SelectOption 타입은 signup과 동일) ...
const majorOptions = [
  { id: 1, label: '디자인테크놀로지 전공' },
  { id: 2, label: '컬처테크놀로지 전공' },
  { id: 3, label: '미디어테크놀로지 전공' },
  { id: 4, label: '컴퓨터 전공' },
  // ... (기타 전공)
];

const gradeOptions = [
  { id: 1, label: '1학년' },
  { id: 2, label: '2학년' },
  { id: 3, label: '3학년' },
  // ... (기타 학년)
];

type SelectOption = { id: string | number; label: string };

// Props 타입 (SignupFormProps와 동일)
type MyPageFormProps = {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: SelectOption) => void;
  handleMajorChange: (index: number, value: SelectOption) => void;
  addMajor: () => void;
  removeMajor: (index: number) => void;
};

// ... (MyPageSection, BasicInfoInputs, SchoolInfoInputs, CreditInfoInputs 컴포넌트는 변경 없음) ...
function MyPageSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:gap-6">
      <div className="mb-4 md:mb-0 md:w-[100px] flex-shrink-0">
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="flex-grow space-y-4">{children}</div>
    </div>
  );
}

function BasicInfoInputs({ formData, handleChange }: Pick<MyPageFormProps, 'formData' | 'handleChange'>) {
  return (
    <>
      <div className="flex w-full items-center space-x-2 group">
        <TextInput
          size="md"
          className="w-full bg-gray-700 text-gray-400" 
          placeholder="아이디 (이메일)"
          name="id"
          value={formData.id}
          onChange={handleChange}
          disabled 
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextInput
          size="md"
          type="password"
          placeholder="새 비밀번호 (변경 시 입력)" 
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <TextInput
          size="md"
          type="password"
          placeholder="새 비밀번호 확인" 
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
        className="bg-gray-700 text-gray-400"
      />
      <div className="flex flex-col md:flex-row md:items-start md:gap-4">
        <div className="w-full md:w-[400px]">
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
        <div className="w-full mt-4 md:mt-0 md:w-[192px]">
          <div className="mb-1 flex items-baseline h-[32px]">
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

function CreditInfoInputs({ formData, handleChange }: Pick<MyPageFormProps, 'formData' | 'handleChange'>) {
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

//  SubmitSection 
function SubmitSection({ formData }: Pick<MyPageFormProps, 'formData'>) {
  const passwordMismatch = (formData.password || formData.passwordCheck) && (formData.password !== formData.passwordCheck);

  return (
    <div className="flex"> 
      <PinkButton
        type="submit"
        size="custom"
        disabled={passwordMismatch} 
        className={
          passwordMismatch
            ? 'opacity-50 cursor-not-allowed w-full md:w-auto whitespace-nowrap h-[30px] px-35 text-xl'
            : 'w-full md:w-auto whitespace-nowrap h-[30px] px-35 text-xl'
        }
      >
        정보 수정
      </PinkButton>
    </div>
  );
}


function MyPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); 
  const [formData, setFormData] = useState<any>(null); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormData({
        id: 'user@example.com', 
        password: '',
        passwordCheck: '',
        nickname: '기존닉네임',
        majors: [majorOptions[0].id, majorOptions[1].id], 
        grade: gradeOptions[0].id, 
        creditsTotal: '140',
        creditsMajor: '75',
        creditsLiberal: '10',
        creditsCurrentTotal: '80',
        creditsCurrentMajor: '40',
        creditsCurrentLiberal: '20',
        isAgreed: false,
      });
      setIsLoading(false);
    }, 1000); 

    return () => {
      clearTimeout(timer);
    };
  }, []); 

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.passwordCheck) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    
    console.log('수정된 폼 제출:', formData); 
    alert('정보가 수정되었습니다.');
    navigate({ to: '/' }); 
  };

  if (isLoading || !formData) {
    return (
      <div className="flex min-h-screen w-full bg-[#1A1A1A] items-center justify-center">
        <p className="text-white text-2xl font-galmuri">데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* 1. 왼쪽 로고 영역 */}
      <div className="w-[433px] bg-[#303030] relative flex items-center justify-center p-8">
        <img src={PixelLogo} alt="픽셀 로고" className="w-auto h-auto object-contain" />
      </div>

      {/* 2. 오른쪽 폼 영역 */}
      <div
        style={{ backgroundImage: `url(${SignupBgImage})` }}
        className="flex-grow relative flex py-10 px-4 md:px-16 lg:px-24 bg-[#332A33] bg-cover bg-no-repeat bg-center justify-center md:justify-start"
      >
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-3xl space-y-12 text-white p-6"
        >
          {/* 헤더 */}
          <div className="text-left">
            <h1 className="text-3xl font-bold flex items-emd gap-x-2">
              <span className="h-14 w-14 mr-2">
                <img src={Cologo} />
              </span>
              마이페이지
            </h1>
            <p className="text-gray-400">프로필 정보를 수정할 수 있습니다.</p>
          </div>

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
          <MyPageSection title="">
            <SubmitSection formData={formData} />
          </MyPageSection>

        </form>
      </div>
    </div>
  );
}