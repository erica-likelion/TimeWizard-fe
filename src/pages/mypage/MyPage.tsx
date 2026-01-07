// 추후 전공별, 교양별 이수학점 백엔드에서 추가시 수정 예정

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { fontStyles } from '@/utils/styles';
import { majorOptions } from '@/constants/options';
import type { SelectOption, MyPageFormData } from './types';
import { useUser } from '@/contexts/UserContext';
import { deleteAccount } from '@/apis/UserAPI/userApi';
import { useNavigate } from '@tanstack/react-router';

// 컴포넌트 imports
import { MyPageSection } from './components/MyPageSection';
import { BasicInfoInputs } from './components/BasicInfoInputs';
import { SchoolInfoInputs } from './components/SchoolInfoInputs';
import { CreditInfoInputs } from './components/CreditInfoInputs';
import { PreferenceInfoInputs } from './components/PreferenceInfoInputs';
import { SubmitSection } from './components/SubmitSection';


export function MyPage() {
  const { user, preferences, loading, updateUser, updatePreferences, changePassword, logout } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<MyPageFormData>({
    id: '',
    currentPassword: '',
    password: '',
    passwordCheck: '',
    nickname: '',
    majors: [1],
    grade: 1,
    creditsTotal: '0',
    //creditsMajor: '0',
    //creditsLiberal: '0',
    creditsCurrentTotal: '0',
    //creditsCurrentMajor: '0',
    //creditsCurrentLiberal: '0',

    // 선호
    preferredDays: [],
    preferredStartTime: '09:00',
    preferredEndTime: '18:00',
    targetCredits: '20',
    requiredCourses: '',
    excludedCourses: '',
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    const initialMajorId = majorOptions.find(opt => opt.label === user.major)?.id || 1;

    // preferences가 null이면 기본값 사용
    const safePreferences = preferences || {
      preferred_days: [],
      preferred_start_time: '09:00',
      preferred_end_time: '21:00',
      target_credits: 20,
      required_courses: [],
      excluded_courses: []
    };

    setFormData({
      id: user.email,
      currentPassword: '',
      password: '',
      passwordCheck: '',
      nickname: user.nickname,
      majors: [initialMajorId],
      grade: user.grade,
      creditsTotal: user.graduation_credits?.toString() || '0',
      //creditsMajor: '0',
      //creditsLiberal: '0',
      creditsCurrentTotal: user.completed_credits?.toString() || '0',
      //creditsCurrentMajor: '0',
      //creditsCurrentLiberal: '0',

      // 선호도 정보
      preferredDays: safePreferences.preferred_days || [],
      preferredStartTime: safePreferences.preferred_start_time || '09:00',
      preferredEndTime: safePreferences.preferred_end_time || '21:00',
      targetCredits: safePreferences.target_credits?.toString() || '20',
      requiredCourses: safePreferences.required_courses?.join(', ') || '',
      excludedCourses: safePreferences.excluded_courses?.join(', ') || '',
    });
  }, [user, preferences]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
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
    if (formData.majors.length <= 1) {
      alert('주전공은 삭제할 수 없습니다.');
      return;
    }
    const newMajors = formData.majors.filter(
      (_: string | number, index: number) => index !== indexToRemove,
    );
    setFormData((prev) => ({
      ...prev,
      majors: newMajors,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.passwordCheck) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // 선택된 전공 ID를 다시 String Label로 변환해서 보냄
      const selectedMajorLabel = majorOptions.find(opt => opt.id === formData.majors[0])?.label || "";

      // 1. 사용자 정보 업데이트
      if (user) {
        await updateUser({
          ...user,
          nickname: formData.nickname,
          major: selectedMajorLabel,
          grade: Number(formData.grade),
          graduation_credits: Number(formData.creditsTotal),
          completed_credits: Number(formData.creditsCurrentTotal)
        });
      }

      // 2. 비밀번호 변경 (입력된 경우에만 수행)
      if (formData.password) {
        if (!formData.currentPassword) {
            alert("비밀번호를 변경하려면 현재 비밀번호를 입력해주세요.");
            return;
        }
        try {
          await changePassword({
              current_password: formData.currentPassword,
              new_password: formData.password
          });
        } catch (error: any) {
          console.error('비밀번호 변경 실패:', error);
          alert('현재 비밀번호가 틀렸습니다.');
          return;
        }
      }

      // 3. 선호도 정보 수정
      const requiredCoursesArray = formData.requiredCourses
        .split(',')
        .map(c => c.trim())
        .filter(c => c !== '')
        .map(c => Number(c))
        .filter(c => !isNaN(c));

      const excludedCoursesArray = formData.excludedCourses
        .split(',')
        .map(c => c.trim())
        .filter(c => c !== '')
        .map(c => Number(c))
        .filter(c => !isNaN(c));

      const updatedPreferences = {
        preferred_days: formData.preferredDays,
        preferred_start_time: formData.preferredStartTime,
        preferred_end_time: formData.preferredEndTime,
        target_credits: Number(formData.targetCredits),
        required_courses: requiredCoursesArray,
        excluded_courses: excludedCoursesArray,
      };

      await updatePreferences(updatedPreferences);

      alert('정보가 수정되었습니다.');

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

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '정말로 회원 탈퇴하시겠습니까?\n\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.'
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      '마지막 확인입니다. 정말 탈퇴하시겠습니까?'
    );

    if (!doubleConfirm) return;

    try {
      await deleteAccount();
      alert('회원 탈퇴가 완료되었습니다.');
      
      // UserContext의 logout 함수를 사용하여 상태 초기화
      await logout();
      
      // 페이지 강제 이동
      window.location.href = '/login';
    } catch (error: any) {
      console.error('회원 탈퇴 실패:', error);
      alert(error.message || '회원 탈퇴에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className={fontStyles.title}>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 페이지 제목 */}
      <div className="pb-5 flex-shrink-0">
        <p className={fontStyles.title}>마이페이지</p>
      </div>

      {/* 폼 영역 */}
      <form onSubmit={handleSubmit} className="flex-1 pb-11">
        <Card className="h-full gap-5 lg:min-h-[calc(100dvh-205px)]">
          {/* 기본정보 섹션 */}
          <MyPageSection title="기본정보">
            <BasicInfoInputs formData={formData} handleChange={handleChange} />
          </MyPageSection>

          {/* 학교정보 섹션 */}
          <MyPageSection title="학교정보">
            <SchoolInfoInputs
              formData={formData}
              handleSelectChange={handleSelectChange}
              handleMajorChange={handleMajorChange}
              addMajor={addMajor}
              removeMajor={removeMajor}
            />
          </MyPageSection>

          {/* 학점정보 섹션 */}
          <MyPageSection title="학점정보">
            <CreditInfoInputs formData={formData} handleChange={handleChange} />
          </MyPageSection>

          {/* 선호도 정보 섹션 */}
          <MyPageSection title="선호도 정보">
            <PreferenceInfoInputs
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
            />
          </MyPageSection>

          {/* 제출 버튼 및 회원 탈퇴 링크 */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-end mt-auto flex-wrap">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteAccount();
              }}
              className="text-sm text-red-700 hover:text-red-800 underline transition-colors"
            >
              빌넣 탈퇴하기
            </a>
            <SubmitSection formData={formData} />
          </div>
        </Card>
      </form>
    </div>
  );
}
