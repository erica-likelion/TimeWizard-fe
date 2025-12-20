import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { CreditManager } from '@/utils/creditManager';
import type { CreditInfo } from '@/utils/creditManager';

export function useCredit() {
  const { user } = useUser();
  const [credits, setCredits] = useState<CreditInfo | null>(null);
  const [todayUsage, setTodayUsage] = useState(0);
  const [weeklyUsage, setWeeklyUsage] = useState(0);

  const refreshCredits = useCallback(() => {
    if (!user?.user_id) return;

    const userCredits = CreditManager.getCredits(user.user_id);
    const today = CreditManager.getTodayUsage(user.user_id);
    const weekly = CreditManager.getWeeklyUsage(user.user_id);

    setCredits(userCredits);
    setTodayUsage(today);
    setWeeklyUsage(weekly);
  }, [user?.user_id]);

  useEffect(() => {
    refreshCredits();
  }, [refreshCredits]);

  const useCredit = useCallback(
    (amount: number) => {
      if (!user?.user_id) return;
      CreditManager.useCredit(user.user_id, amount);
      refreshCredits();
    },
    [user?.user_id, refreshCredits]
  );

  return {
    credits,
    todayUsage,
    weeklyUsage,
    useCredit,
    refreshCredits
  };
}
