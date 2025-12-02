import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/const";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface ManusDialogProps {
  title?: string;
  logo?: string;
  open?: boolean;
  onLogin: () => void;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

export function ManusDialog({
  title = APP_TITLE,
  logo = APP_LOGO,
  open = false,
  onLogin,
  onOpenChange,
  onClose,
}: ManusDialogProps) {
  const [internalOpen, setInternalOpen] = useState(open);

  useEffect(() => {
    if (!onOpenChange) {
      setInternalOpen(open);
    }
  }, [open, onOpenChange]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(nextOpen);
    } else {
      setInternalOpen(nextOpen);
    }

    if (!nextOpen) {
      onClose?.();
    }
  };

  return (
    <Dialog
      open={onOpenChange ? open : internalOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="py-5 bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-[20px] w-[400px] shadow-[0px_8px_24px_0px_rgba(251,191,36,0.15)] border-2 border-amber-200/50 backdrop-blur-2xl p-0 gap-0 text-center">
        <div className="flex flex-col items-center gap-2 p-5 pt-12">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg flex items-center justify-center ring-4 ring-amber-100">
            <img src={logo} alt="AI LUXE" className="w-12 h-12 rounded-lg" />
          </div>

          {/* Title and subtitle */}
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent leading-[32px] tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-amber-800/80 leading-6 tracking-tight font-medium">
            AI LUXE – Time is the Real Luxury
          </DialogDescription>
        </div>

        <DialogFooter className="px-5 py-5">
          {/* Login button */}
          <Button
            onClick={onLogin}
            className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Login to AI LUXE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
