import { HTMLAttributes, forwardRef } from 'react';
import { cn } from './Button';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-6 shadow-xl',
                className
            )}
            {...props}
        />
    )
);
Card.displayName = 'Card';

export { Card };
