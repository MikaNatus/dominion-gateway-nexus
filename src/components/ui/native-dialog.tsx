
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface NativeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

const NativeDialog = ({ open, onOpenChange, children, className }: NativeDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isClickOutside = 
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;

    if (isClickOutside) {
      handleClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "backdrop:bg-black/80 bg-transparent p-0 max-w-none max-h-none w-full h-full overflow-hidden",
        "open:animate-in open:fade-in-0 open:zoom-in-95",
        className
      )}
      onClick={handleDialogClick}
      onClose={handleClose}
    >
      <div className="flex items-center justify-center min-h-full p-2 sm:p-4 overflow-hidden">
        <div 
          className={cn(
            "relative bg-background border rounded-lg shadow-lg p-3 sm:p-6 my-4 overflow-hidden",
            "transition-none",
            className
          )}
          onClick={(e) => e.stopPropagation()}
          style={{ 
            width: 'min(calc(100vw - 16px), 1152px)',
            minWidth: '320px'
          }}
        >
          <button
            onClick={handleClose}
            className="absolute right-2 top-2 sm:right-4 sm:top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          {children}
        </div>
      </div>
    </dialog>
  );
};

const NativeDialogContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("space-y-3 sm:space-y-4", className)}>{children}</div>;
};

const NativeDialogHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("flex flex-col space-y-1 sm:space-y-1.5 text-center sm:text-left", className)}>{children}</div>;
};

const NativeDialogTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h2 className={cn("text-base sm:text-lg font-semibold leading-none tracking-tight", className)}>{children}</h2>;
};

const NativeDialogDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <p className={cn("text-xs sm:text-sm text-muted-foreground", className)}>{children}</p>;
};

export {
  NativeDialog,
  NativeDialogContent,
  NativeDialogHeader,
  NativeDialogTitle,
  NativeDialogDescription,
};
