
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "backdrop:bg-black/80 bg-transparent p-0 max-w-none max-h-none w-full h-full",
        "open:animate-in open:fade-in-0 open:zoom-in-95",
        className
      )}
      onClick={handleBackdropClick}
      onClose={handleClose}
    >
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className="relative bg-background border rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
  return <div className={cn("space-y-4", className)}>{children}</div>;
};

const NativeDialogHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>{children}</div>;
};

const NativeDialogTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>{children}</h2>;
};

const NativeDialogDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
};

export {
  NativeDialog,
  NativeDialogContent,
  NativeDialogHeader,
  NativeDialogTitle,
  NativeDialogDescription,
};
