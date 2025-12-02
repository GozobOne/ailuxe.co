import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LogoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: number;
  clientName: string;
  onUploadComplete?: (logoUrl: string) => void;
}

export default function LogoUploadDialog({
  open,
  onOpenChange,
  clientId,
  clientName,
  onUploadComplete
}: LogoUploadDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      toast.error("Please upload an image file");
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // TODO: Implement S3 upload via tRPC
      // const formData = new FormData();
      // formData.append("logo", selectedFile);
      // formData.append("clientId", clientId.toString());
      // const result = await trpc.admin.uploadClientLogo.mutate(formData);
      
      // Simulated upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockLogoUrl = previewUrl || "";
      toast.success("Logo uploaded successfully!");
      onUploadComplete?.(mockLogoUrl);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to upload logo");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Logo</DialogTitle>
          <DialogDescription>
            Upload a logo for {clientName}. Recommended size: 512x512px
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-colors duration-200
                ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
              `}
            >
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="logo-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  Drag & drop your logo here
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to browse (PNG, JPG, SVG)
                </p>
              </label>
            </div>
          ) : (
            <div className="relative border rounded-lg p-4">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={handleRemove}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-4">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Logo preview"
                    className="w-24 h-24 object-contain rounded border"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="btn-gold"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
