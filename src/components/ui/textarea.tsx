import * as React from 'react';
import { cn } from '@/lib/utils';
import { useImperativeHandle } from 'react';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    
    useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

    React.useEffect(() => {
        const textarea = innerRef.current;
        if (textarea) {
            const resizeTextarea = () => {
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
            };
            textarea.addEventListener('input', resizeTextarea, false);
            // Initial resize
            resizeTextarea();
            return () => {
                textarea.removeEventListener('input', resizeTextarea, false);
            };
        }
    }, []);
    
    return (
      <textarea
        className={cn(
          'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'overflow-hidden' // Hide scrollbar
        )}
        ref={innerRef}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
