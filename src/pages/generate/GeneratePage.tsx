import { Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { fontStyles } from '@/utils/styles'
import { cn } from '@/utils/util'
import { BasicButton } from '@/components/buttons/BasicButton'
import { PinkButton } from '@/components/buttons/PinkButton'
import { TextInput } from '@/components/boxes/InputBox'
import { CustomSelect } from '@/components/boxes/SelectBox'
import { Card } from '@/components/Card'
import { useUser } from '@/contexts/UserContext'
import { generateTimetable, getGenerationStatus } from '@/apis/AIGenerateAPI/aiGenerateApi'

import type { GenerateTimetableRequest } from '@/apis/AIGenerateAPI/types'
import type { Option, ExcludedTime } from './types'

import TimeTableIcon from '@/assets/icons/time_table.png'


// 시간표 생성 페이지
export function GeneratePage() {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  // AI 생성 중 상태
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  // 재학 정보
  const [university, setUniversity] = useState<string>('한양대학교 ERICA 캠퍼스')
  const [major, setMajor] = useState<string>('')
  const [grade, setGrade] = useState<string>('')
  const [semester, setSemester] = useState<string>('')
  const [completedCredits, setCompletedCredits] = useState<string>('')
  const [majorCreditsCompleted, setMajorCreditsCompleted] = useState<string>('')
  const [generalCredits, setGeneralCredits] = useState<string>('')

  // 목표 학점
  const [totalCredits, setTotalCredits] = useState<string>('')
  const [majorCredits, setMajorCredits] = useState<string>('')

  // 제외 시간대
  const [excludedTimes, setExcludedTimes] = useState<ExcludedTime[]>([])
  const [nextId, setNextId] = useState<number>(1)

  // 요청 사항
  const [requests, setRequests] = useState<string>('')

  const [loadingIndex, setLoadingIndex] = useState(0);

  const loadingMessages = [
    "거의 다 해가요! 잠시만 기다려 주세요!",
    "마법사가 열심히 시간표를 만들고 있어요!",
    "조금만 더 기다려 주세요, 곧 완성됩니다!",
    "AI가 땀 흘리며 작업 중입니다!",
    "시간표가 곧 도착할 예정입니다! 기대해 주세요!"
  ];

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

  // 사용자 정보가 로드되면 초기값 설정
  useEffect(() => {
    if (user) {
      setUniversity(user.university || '')
      setMajor(user.major || '')
      setGrade(user.grade?.toString() || '')
      setCompletedCredits(user.completed_credits?.toString() || '')
      setMajorCreditsCompleted(user.major_credits?.toString() || '')
      setGeneralCredits(user.general_credits?.toString() || '')
    }
  }, [user])

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingIndex(prev => (prev + 1) % loadingMessages.length);
    }, 10000); // 10초마다 변경

    return () => clearInterval(interval);
  }, []);

  // 제외 시간대 추가
  const addExcludedTime = (): void => {
    setExcludedTimes([
      ...excludedTimes,
      { id: nextId, day: '월요일', startTime: '09:00', endTime: '12:00' } // 추가할 때, 디폴트로 이렇게 나타난다는 거임
    ])
    setNextId(nextId + 1)
  }

  // 제외 시간대 삭제
  const removeExcludedTime = (id: number): void => {
    setExcludedTimes(excludedTimes.filter(time => time.id !== id))
  }

  // 폼 유효성 검사 - 재학 정보와 목표 학점이 모두 채워졌는지 확인
  const isFormValid =
    university.trim() !== '' &&
    major.trim() !== '' &&
    grade.trim() !== '' &&
    semester.trim() !== '' &&
    completedCredits.trim() !== '' &&
    majorCreditsCompleted.trim() !== '' &&
    generalCredits.trim() !== '' &&
    totalCredits.trim() !== '' &&
    majorCredits.trim() !== ''

  // 초기화
  const handleReset = (): void => {
    // 재학 정보 초기화 (사용자 정보로 복원)
    if (user) {
      setUniversity(user.university || '')
      setMajor(user.major || '')
      setGrade(user.grade?.toString() || '')
      setSemester('') // 학기는 디폴트 없음
      setCompletedCredits(user.completed_credits?.toString() || '')
      setMajorCreditsCompleted(user.major_credits?.toString() || '')
      setGeneralCredits(user.general_credits?.toString() || '')
    }
    // 목표 학점 초기화
    setTotalCredits('')
    setMajorCredits('')
    // 제외 시간대 초기화
    setExcludedTimes([])
    setNextId(1)
    // 요청 사항 초기화
    setRequests('')
  }

  // 생성 시작
  const handleGenerate = async (): Promise<void> => {
    try {
      setIsGenerating(true)
      const requestData: GenerateTimetableRequest = {
        requestText: requests,
        maxCredit: 20,
        targetCredit: Number(totalCredits) || 0
      }

      console.log('AI 시간표 생성 요청:', requestData)

      // 1단계: 시간표 생성 시작
      const uuid = await generateTimetable(requestData)

      console.log('AI 시간표 생성 응답:', uuid)

      // UUID를 taskId
      const taskId = uuid

      // 2단계: 폴링으로 생성 상태 확인 (5초마다, 최대 24번 시도 = 120초)
      const MAX_ATTEMPTS = 24
      const POLLING_INTERVAL = 5000 
      let attempts = 0

      const checkStatus = async (): Promise<void> => {
        try {
          attempts++
          console.log(`시간표 생성 상태 확인 시도 ${attempts}/${MAX_ATTEMPTS}`)

          const statusResponse = await getGenerationStatus(taskId)

          console.log('AI 시간표 생성 상태 응답:', statusResponse)

          // 상태에 따라 처리
          if (statusResponse.status === 'COMPLETE') {
            // 생성 성공 - JSON 파싱하여 데이터 추출
            setIsGenerating(false)
            const courseData = JSON.parse(statusResponse.data);
            navigate({
              to: `/generate/${taskId}`,
              state: {
                courses: courseData.courses,
                ai_comment: courseData.ai_comment
              } as any
            })
          } else if (statusResponse.status === 'ERROR') {
            // 생성 실패 - 에러 메시지 표시
            setIsGenerating(false)
            alert(`${statusResponse.message}`)
          } else if (statusResponse.status === 'NOT_FOUND') {
            // 찾을 수 없음
            setIsGenerating(false)
            alert(`${statusResponse.message}`)
          } else if (statusResponse.status === 'WAITING') {
            if (attempts >= MAX_ATTEMPTS) { // 타임 아웃 처리
              setIsGenerating(false)
              alert('시간표 생성이 너무 오래 걸립니다.\n다시 시도해주세요.')
              navigate({ to: '/generate' })
            } else {
              setTimeout(checkStatus, POLLING_INTERVAL) // 5초 후 다시 시도
            }
          }
        } catch (error) {
          console.error('시간표 생성 상태 확인 실패:', error)
          setIsGenerating(false)
          alert('시간표 생성 상태 확인에 실패했습니다. 다시 시도해주세요.')
        }
      }

      checkStatus()
    } catch (error) {
      console.error('시간표 생성 실패:', error)
      alert('시간표 생성에 실패했습니다. 다시 시도해주세요.')
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
      <div className="flex flex-col px-18 gap-5 py-10 flex-1">
        {/* [위] 페이지 제목 + 메인으로 돌아가기 버튼 */}
        <div className="flex items-end">
          <p className={fontStyles.title}>시간표 생성</p>
          {isGenerating ?  <></> : <BasicButton onClick={() => navigate({to: '/main'})} className={cn("ml-auto px-5 py-1 bg-[#000]", fontStyles.caption)}>← 메인으로</BasicButton>}
        </div>
        <Card className="gap-10 h-full">
          {/* AI 생성 중 로딩 화면 */}
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {/* TimeTable 아이콘 애니메이션 */}
              <div className="relative">
                <img
                  src={TimeTableIcon}
                  alt="Loading"
                  className="w-100"
                />
              </div>

              {/* 로딩 텍스트 */}
              <div className="text-center">
                <p className={cn(fontStyles.title, "text-pink-400 mb-2")}>시간표 생성 중입니다...</p>
                <p className={cn(fontStyles.body, "text-white")}>{loadingMessages[loadingIndex]}</p>
              </div>

              {/* 프로그레스 바  */}
              <div className="w-full max-w-250 h-8 bg-[#767676] overflow-hidden">
                <div className="h-full w-1/3 bg-linear-to-r from-pink-500 to-pink-400 animate-[slide_1.5s_linear_infinite]"></div>
              </div>
            </div>
          ) : (
            <>
            {/* 재학 정보: 사용자 정보에서 자동으로 가져오고 수정 가능 */}
              <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-14">
                <p className={cn(fontStyles.subtitle, "lg:min-w-[120px]")}>재학 정보 *</p>
                <div className="flex-1 flex flex-col gap-4 lg:max-w-[687.6px]">
                  {/* 학교명 */}
                  <div className="flex flex-col gap-2">
                    <span className={cn(fontStyles.body)}>학교명</span>
                    <TextInput
                      value={university}
                      size='md'
                      onChange={(e) => setUniversity(e.target.value)}
                      className="border-2 border-[#888]"
                      placeholder="한양대학교 ERICA 캠퍼스"
                    />
                  </div>

                  {/* 전공 + 학년 + 학기 */}
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                      <span className={cn(fontStyles.body)}>전공</span>
                      <TextInput
                        value={major}
                        size='md'
                        onChange={(e) => setMajor(e.target.value)}
                        className="border-2 border-[#888]"
                        placeholder="컴퓨터학부"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <span className={cn(fontStyles.body)}>학년</span>
                      <TextInput
                        value={grade}
                        size='md'
                        onChange={(e) => setGrade(e.target.value)}
                        className="border-2 border-[#888]"
                        placeholder="1"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <span className={cn(fontStyles.body)}>학기</span>
                      <TextInput
                        value={semester}
                        size='md'
                        onChange={(e) => setSemester(e.target.value)}
                        className="border-2 border-[#888]"
                        placeholder="1"
                      />
                    </div>
                  </div>

                  {/* 이수 학점 + 전공 학점 + 교양 학점 */}
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                      <span className={cn(fontStyles.body)}>이수 학점</span>
                      <TextInput
                        value={completedCredits}
                        size='md'
                        onChange={(e) => setCompletedCredits(e.target.value)}
                        className="border-2 border-[#888]"
                        placeholder="90"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <span className={cn(fontStyles.body)}>이수 전공 학점</span>
                      <TextInput
                        value={majorCreditsCompleted}
                        size='md'
                        onChange={(e) => setMajorCreditsCompleted(e.target.value)}
                        className="border-2 border-[#888]"
                        placeholder="65"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <span className={cn(fontStyles.body)}>이수 교양 학점</span>
                      <TextInput
                        value={generalCredits}
                        size='md'
                        onChange={(e) => setGeneralCredits(e.target.value)}
                        className="border-2 border-[#888]"
                        placeholder="15"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 목표 학점: 전체 학점, 전공 학점 입력 */}
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-14">
                <p className={cn(fontStyles.subtitle, "lg:min-w-[120px]")}>목표 학점 *</p>
                <div className="flex-1 flex flex-col lg:flex-row gap-5 lg:max-w-[687.6px]">

                  <div className="flex-1 flex-col gap-2">
                    <span className={cn(fontStyles.body, "text-white")}>
                      전체
                    </span>
                    <TextInput
                      value={totalCredits}
                      size='md'
                      onChange={(e) => setTotalCredits(e.target.value)}
                      className="border-2 border-[#888]"
                      placeholder="20"
                    />
                  </div>
                  <div className="flex-1 flex-col gap-2">
                    <span className={cn(fontStyles.body, "text-white")}>전공</span>
                    <TextInput
                      value={majorCredits}
                      size='md'
                      onChange={(e) => setMajorCredits(e.target.value)}
                      className="border-2 border-[#888]"
                      placeholder="0"
                    />
                  </div>
                  <Link
                      to={'/main'} // 나중에 포털 연결
                      className={cn(fontStyles.caption, "text-[#C1446C] underline self-end")}
                    >
                      포털에서 요건 확인
                    </Link>
                </div>
              </div>

              {/* 제외 시간대: 수업을 배치하지 않을 시간대 지정 */}
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-7">
                <p className={cn(fontStyles.subtitle, "lg:min-w-[120px]")}>제외 시간대&nbsp;&nbsp;</p>
                <div className="flex-1 flex flex-col gap-6">
                  {excludedTimes.map((time) => (
                    <div key={time.id} className="flex flex-wrap items-center gap-2">
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
                    className="border-[#888] max-w-60"
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
                    className="w-full h-full max-h-[133.2px] max-w-[900px] border-2 border-[#888] placeholder:text-[#888] p-4 resize-none no-scrollbar"
                    placeholder="금요일 공강 선호, 되도록이면 9시 수업 제외. "
                  />
                </div>
              </div>

              {/* 하단 버튼: 초기화, 생성 시작 */}
              <div className="flex flex-col lg:flex-row justify-end gap-4 mt-auto">
                <BasicButton
                  onClick={handleReset}
                  className={cn("w-full lg:w-auto px-8 py-2 min-h-14", fontStyles.button)}
                >
                  초기화
                </BasicButton>
                <PinkButton
                  onClick={handleGenerate}
                  size="sm"
                  className={cn("w-full lg:w-auto px-8 py-2 min-h-14", fontStyles.button)}
                  disabled={isGenerating || !isFormValid}
                >
                  생성 시작
                </PinkButton>
              </div>
            </>
          )}
        </Card>
      </div>
  )
}
