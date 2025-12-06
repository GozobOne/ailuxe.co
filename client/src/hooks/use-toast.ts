import { toast } from "sonner";

export function useToast() {
  return {
    toast: (options: any) => toast(options.title || options.message || "", {
      description: options.description,
      duration: options.duration || 5000,
      action: options.action,
      style: { background: "#000", color: "#D4AF37", border: "1px solid #D4AF37" },
    }),
    dismiss: toast.dismiss,
    loading: (msg: string) => toast.loading(msg, { style: { background: "#000", color: "#D4AF37" } }),
  };
}
