import { cn } from '@/utils/util';
import { fontStyles } from '@/utils/styles';

export function MyPageSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-14">
      <p className={cn(fontStyles.subtitle, "lg:min-w-[120px]")}>{title}</p>
      <div className="flex-1 flex flex-col gap-4">{children}</div>
    </div>
  );
}
