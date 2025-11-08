import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { fontStyles } from '@/utils/styles'
import { cn } from '@/utils/util'
import { BasicButton } from '@/components/buttons/BasicButton'
import { PinkButton } from '@/components/buttons/PinkButton'
import { TextInput } from '@/components/boxes/InputBox'
import { CustomSelect } from '@/components/boxes/SelectBox'
import { useUser } from '@/contexts/UserContext'
import { mockGenerateTimetable } from '@/apis/AIGenerateAPI/aiGenerateApi'
import type { GenerateTimetableRequest } from '@/apis/AIGenerateAPI/types'
import TimeTableIcon from '@/assets/icons/time_table.png'

export const Route = createFileRoute('/generate/')({
  component: RouteComponent,
})

// 옵션 타입
type Option = {
  id: string | number
  label: string
}

// 제외 시간대 타입
type ExcludedTime = {
  id: number
  day: string
  startTime: string
  endTime: string
}

// 시간표 생성 페이지
function RouteComponent() {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  // AI 생성 중 상태
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  // 목표 학점
  const [totalCredits, setTotalCredits] = useState<string>('')
  const [majorCredits, setMajorCredits] = useState<string>('')

  // 제외 시간대
  const [excludedTimes, setExcludedTimes] = useState<ExcludedTime[]>([])
  const [nextId, setNextId] = useState<number>(1)

  // 요청 사항
  const [requests, setRequests] = useState<string>('')

  // 요일 옵션
  const dayOptions: Option[] = [
    { id: '월요일', label: '월요일' },
    { id: '화요일', label: '화요일' },
    { id: '수요일', label: '수요일' },
    { id: '목요일', label: '목요일' },
    { id: '금요일', label: '금요일' },
    { id: '토요일', label: '토요일' },
    { id: '일요일', label: '일요일' },
  ]

  // 시간 옵션 (09:00 ~ 21:00, 30분 단위)
  const timeOptions: Option[] = []
  for (let hour = 9; hour <= 21; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 21 && minute === 30) break // 21:00까지만
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      timeOptions.push({ id: timeStr, label: timeStr })
    }
  }

  const userInformation: string = user?.university + '\n' +
                          user?.major + ' ' + user?.grade + '학년\n' +
                          user?.completed_credits + '학점' + ' (전공: '+ user?.major_credits + ', 교양: ' + user?.general_credits + ')';

  // 제외 시간대 추가
  const addExcludedTime = (): void => {
    setExcludedTimes([
      ...excludedTimes,
      { id: nextId, day: '월요일', startTime: '09:00', endTime: '12:00' }
    ])
    setNextId(nextId + 1)
  }

  // 제외 시간대 삭제
  const removeExcludedTime = (id: number): void => {
    setExcludedTimes(excludedTimes.filter(time => time.id !== id))
  }

  // 초기화
  const handleReset = (): void => {
    setTotalCredits('')
    setMajorCredits('')
    setExcludedTimes([])
    setNextId(1)
    setRequests('')
  }

  // 생성 시작
  const handleGenerate = async (): Promise<void> => {
    try {
      setIsGenerating(true)

      // 제외 시간대를 요일 배열로 변환
      const excludedDays: string[] = excludedTimes.map(time => time.day)

      // API 요청 데이터 구성
      const requestData: GenerateTimetableRequest = {
        semester: "2025-1", // TODO: 실제 학기 정보로 변경
        target_credits: Number(totalCredits) || 0,
        preferences: {
          preferred_days: excludedDays.length > 0 ? excludedDays : undefined,
          preferred_start_time: excludedTimes[0]?.startTime,
          preferred_end_time: excludedTimes[0]?.endTime,
          required_courses: undefined, // TODO: 필요시 추가
          excluded_courses: undefined, // TODO: 필요시 추가
        }
      }

      console.log('AI 시간표 생성 요청:', requestData)

      // TODO: 로그인 구현 후 실제 API로 변경
      // const response = await generateTimetable(requestData)
      const response = await mockGenerateTimetable(requestData)

      console.log('AI 시간표 생성 응답:', response)

      if (response.success) {
        // 생성 성공 시 시간표 목록 페이지로 이동
        alert(response.data.message)
        navigate({ to: '/list' })
      }
    } catch (error) {
      console.error('시간표 생성 실패:', error)
      alert('시간표 생성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsGenerating(false)
    }
  }

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className={fontStyles.title}>로딩 중...</p>
      </div>
    );
  }

  return (
      <div className="flex flex-col px-[72px] gap-9 pt-[40px] pb-[72px] h-full">
        {/* [위] 페이지 제목 + 메인으로 돌아가기 버튼 */}
        <div className="flex items-end">
          <p className={fontStyles.title}>시간표 생성</p>
          {isGenerating ?  <></> : <BasicButton onClick={() => navigate({to: '/main'})} className={cn("ml-auto h-[32.4px] w-[144px] p-1 bg-[#000] text-white", fontStyles.caption)}>← 메인으로</BasicButton>}
        </div>
        <div className="flex flex-col bg-[#303030] p-6 gap-10 h-full">

          {/* AI 생성 중 로딩 화면 */}
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {/* TimeTable 아이콘 애니메이션 */}
              <div className="relative">
                <img
                  src={TimeTableIcon}
                  alt="Loading"
                  className="w-70"
                />
              </div>

              {/* 로딩 텍스트 */}
              <div className="text-center">
                <p className={cn(fontStyles.title, "text-pink-400 mb-2")}>시간표 생성 중입니다...</p>
                <p className={cn(fontStyles.body, "text-white")}>거의 다 해가요! 잠시만 기다려 주세요!</p>
              </div>

              {/* 프로그레스 바 - indeterminate 스타일 */}
              <div className="w-full max-w-250 h-8 bg-[#767676] overflow-hidden">
                <div className="h-full w-1/3 bg-linear-to-r from-pink-500 to-pink-400 animate-[slide_1.5s_linear_infinite]"></div>
              </div>
            </div>
          ) : (
            <>
              {/* 재학 정보: 사용자 정보에서 자동으로 가져옴 */}
            <div className="flex gap-14">
              <p className={cn(fontStyles.subtitle, "mt-5")}>재학 정보</p>
              <div className="flex-1 flex flex-col max-w-[687.6px]">
                <p className={cn(fontStyles.caption, "text-[#888] flex self-end")}> 
                  정보가 다른가요? 
                  <Link
                    to={'/main'} // 나중에 마이 페이지로 수정 필요
                    className="ml-1 text-[#C1446C] underline"
                  >
                      수정하기
                  </Link>
                </p>
                <textarea
                  className="w-full bg-[#767676] text-[#BBB] border-2 border-[#999] px-5 py-2 whitespace-pre-line resize-none no-scrollbar"
                  value={userInformation}
                  disabled
                  rows={3}
                />
              </div>
            </div>

            {/* 목표 학점: 전체 학점, 전공 학점 입력 */}
            <div className="flex gap-14">
              <p className={cn(fontStyles.subtitle)}>목표 학점</p>
              <div className="flex-1 flex gap-5  max-w-[687.6px]">

                <div className="flex-1 flex-col gap-2">
                  <span className={cn(fontStyles.body, "text-white")}>
                    전체 (잔여: {user?.graduation_credits || 140})
                  </span>
                  <TextInput
                    value={totalCredits}
                    onChange={(e) => setTotalCredits(e.target.value)}
                    className="border-2 border-[#888]"
                    placeholder="20"
                  />
                </div>
                <div className="flex-1 flex-col gap-2">
                  <span className={cn(fontStyles.body, "text-white")}>전공</span>
                  <TextInput
                    value={majorCredits}
                    onChange={(e) => setMajorCredits(e.target.value)}
                    className="border-2 border-[#888]"
                    placeholder="0"
                  />
                </div>
                <Link
                    to={'/main'} // 나중에 마이 페이지로 수정 필요
                    className={cn(fontStyles.caption, "text-[#C1446C] underline self-end")}
                  >
                    포털에서 요건 확인 
                  </Link>
              </div>
            </div>

            {/* 제외 시간대: 수업을 배치하지 않을 시간대 지정 */}
            <div className="flex gap-7">
              <p className={cn(fontStyles.subtitle)}>제외 시간대</p>
              <div className="flex-1 flex flex-col gap-6">
                {excludedTimes.map((time) => (
                  <div key={time.id} className="flex items-center gap-2">
                    <CustomSelect
                      options={dayOptions}
                      defaultValue={dayOptions.find(d => d.id === time.day) || dayOptions[0]}
                      onChange={(option) => {
                        setExcludedTimes(excludedTimes.map(t =>
                          t.id === time.id ? {...t, day: option.label} : t
                        ))
                      }}
                      size="small"
                    />
                    <CustomSelect
                      options={timeOptions}
                      defaultValue={timeOptions.find(t => t.id === time.startTime) || timeOptions[0]}
                      onChange={(option) => {
                        setExcludedTimes(excludedTimes.map(t =>
                          t.id === time.id ? {...t, startTime: option.label} : t
                        ))
                      }}
                      size="small"
                    />
                    <span className="text-white">~</span>
                    <CustomSelect
                      options={timeOptions}
                      defaultValue={timeOptions.find(t => t.id === time.endTime) || timeOptions[0]}
                      onChange={(option) => {
                        setExcludedTimes(excludedTimes.map(t =>
                          t.id === time.id ? {...t, endTime: option.label} : t
                        ))
                      }}
                      size="small"
                    />
                    <p
                      onClick={() => removeExcludedTime(time.id)}
                      className={cn(fontStyles.caption, "ml-2 text-[#C1446C] underline self-end cursor-pointer")}
                    >
                      삭제
                    </p>
                  </div>
                ))}
                <BasicButton
                  onClick={addExcludedTime}
                  className="border-[#888]"
                >
                  + 제외 시간 추가
                </BasicButton>
              </div>
            </div>

            {/* 요청 사항: 추가 요구사항 텍스트 입력 */}
            <div className="flex flex-col gap-4">
              <p className={cn(fontStyles.subtitle)}>요청 사항</p>
              <div className="flex-1">
                <textarea
                  value={requests}
                  onChange={(e) => setRequests(e.target.value)}
                  className="w-full h-full max-w-[847.8px] max-h-[133.2px] border-2 border-[#888] placeholder:text-[#888] p-4 resize-none"
                  placeholder="금요일 공강 선호, 되도록이면 9시 수업 제외. "
                />
              </div>
            </div>

            {/* 하단 버튼: 초기화, 생성 시작 */}
            <div className="flex justify-end gap-4 mt-auto">
              <BasicButton
                onClick={handleReset}
                className="px-8 py-2"
              >
                초기화
              </BasicButton>
              <PinkButton
                onClick={handleGenerate}
                size="sm"
                className="px-8 py-2"
                disabled={isGenerating}
              >
                생성 시작
              </PinkButton>
            </div>
            </>
          )}
        </div>
      </div>
  )
}
