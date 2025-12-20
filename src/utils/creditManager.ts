// 크레딧 사용 이력
export type CreditUsage = {
  date: string;        // "2025-12-20" 형식
  amount: number;      // 사용량
  timestamp: string;   // 정확한 시각 기록용
}

// 크레딧 정보
export type CreditInfo = {
  totalCredits: number;           // 전체 크레딧
  remainingCredits: number;       // 남은 크레딧
  plan: string;                   // 플랜 이름
  usageHistory: CreditUsage[];    // 사용 이력
}

export class CreditManager {
  // 사용자별 localStorage 키 생성
  private static getKey(userId: number): string {
    return `credit_info_${userId}`;
  }

  // 크레딧 정보 조회
  static getCredits(userId: number): CreditInfo | null {
    try {
      const key = this.getKey(userId);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('크레딧 정보 조회 실패:', error);
      return null;
    }
  }

  // 크레딧 정보 저장
  static saveCredits(userId: number, creditInfo: CreditInfo): void {
    try {
      const key = this.getKey(userId);
      localStorage.setItem(key, JSON.stringify(creditInfo));
    } catch (error) {
      console.error('크레딧 정보 저장 실패:', error);
    }
  }

  // 크레딧 초기화
  static initializeCredits(userId: number, plan: string = '라이트'): void {
    const existingCredits = this.getCredits(userId);
    if (existingCredits) {
      return; 
    }

    const initialCredits: CreditInfo = {
      totalCredits: 5000,
      remainingCredits: 5000,
      plan: plan,
      usageHistory: []
    };

    this.saveCredits(userId, initialCredits);
  }

  // 크레딧 사용 (시간표 생성 등)
  static useCredit(userId: number, amount: number): void {
    const credits = this.getCredits(userId);
    if (!credits) return;

    const today = new Date().toISOString().split('T')[0];

    // 남은 크레딧 차감
    credits.remainingCredits > 0 ? credits.remainingCredits -= amount : 0;

    // 사용 이력 추가
    credits.usageHistory.push({
      date: today,
      amount: amount,
      timestamp: new Date().toISOString()
    });

    this.saveCredits(userId, credits);
  }

  // 오늘 사용량 계산
  static getTodayUsage(userId: number): number {
    const credits = this.getCredits(userId);
    if (!credits) return 0;

    const today = new Date().toISOString().split('T')[0];

    return credits.usageHistory
      .filter(usage => usage.date === today)
      .reduce((sum, usage) => sum + usage.amount, 0);
  }

  // 최근 7일 사용량 계산
  static getWeeklyUsage(userId: number): number {
    const credits = this.getCredits(userId);
    if (!credits) return 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cutoffDate = sevenDaysAgo.toISOString().split('T')[0];

    return credits.usageHistory
      .filter(usage => usage.date >= cutoffDate)
      .reduce((sum, usage) => sum + usage.amount, 0);
  }
}
