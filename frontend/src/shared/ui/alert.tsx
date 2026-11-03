import { type HTMLAttributes, type ReactNode } from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const alertVariants = cva(
  'flex gap-3 rounded-xl border p-4 text-sm [&>svg]:mt-0.5 [&>svg]:size-4',
  {
    variants: {
      variant: {
        info: 'border-info/25 bg-info/5 text-foreground [&>svg]:text-info',
        success: 'border-success/30 bg-secondary text-secondary-foreground [&>svg]:text-success',
        warning:
          'border-warning/50 bg-warning/10 text-warning-foreground [&>svg]:text-warning-foreground',
        destructive:
          'border-destructive/30 bg-destructive/5 text-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

const icons: Record<NonNullable<VariantProps<typeof alertVariants>['variant']>, LucideIcon> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  destructive: CircleAlert,
};

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof alertVariants> {
  title?: ReactNode;
}

export function Alert({ className, variant, title, children, role, ...props }: AlertProps) {
  const Icon = icons[variant ?? 'info'];

  return (
    <div
      role={role ?? (variant === 'destructive' ? 'alert' : 'status')}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon aria-hidden className="shrink-0" />
      <div className="space-y-1">
        {title && <p className="font-semibold leading-snug">{title}</p>}
        {children && <div className="leading-relaxed [&_p]:leading-relaxed">{children}</div>}
      </div>
    </div>
  );
}
