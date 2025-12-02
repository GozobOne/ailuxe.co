import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Palette } from "lucide-react";
import { toast } from "sonner";

interface BrandingCustomizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: number;
  clientName: string;
  onSaveComplete?: () => void;
}

export default function BrandingCustomizationDialog({
  open,
  onOpenChange,
  clientId,
  clientName,
  onSaveComplete
}: BrandingCustomizationDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [branding, setBranding] = useState({
    primaryColor: "#D4AF37", // Gold
    secondaryColor: "#1A1A1A", // Charcoal
    accentColor: "#F5F5F5", // Light gray
    fontFamily: "Inter",
    headingFont: "Playfair Display"
  });

  const fontOptions = [
    { value: "Inter", label: "Inter (Modern Sans)" },
    { value: "Roboto", label: "Roboto (Clean Sans)" },
    { value: "Open Sans", label: "Open Sans (Friendly)" },
    { value: "Lato", label: "Lato (Professional)" },
    { value: "Montserrat", label: "Montserrat (Geometric)" }
  ];

  const headingFontOptions = [
    { value: "Playfair Display", label: "Playfair Display (Luxury Serif)" },
    { value: "Merriweather", label: "Merriweather (Classic Serif)" },
    { value: "Lora", label: "Lora (Elegant Serif)" },
    { value: "Poppins", label: "Poppins (Modern Sans)" },
    { value: "Raleway", label: "Raleway (Refined Sans)" }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement branding save via tRPC
      // await trpc.admin.updateClientBranding.mutate({
      //   clientId,
      //   branding
      // });
      
      // Simulated save delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Branding updated successfully!");
      onSaveComplete?.();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update branding");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customize Branding</DialogTitle>
          <DialogDescription>
            Set custom colors and fonts for {clientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Color Customization */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Brand Colors
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={branding.secondaryColor}
                    onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={branding.secondaryColor}
                    onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={branding.accentColor}
                    onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={branding.accentColor}
                    onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Font Customization */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Typography</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Body Font</Label>
                <Select
                  value={branding.fontFamily}
                  onValueChange={(value) => setBranding({ ...branding, fontFamily: value })}
                >
                  <SelectTrigger id="fontFamily">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map(font => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headingFont">Heading Font</Label>
                <Select
                  value={branding.headingFont}
                  onValueChange={(value) => setBranding({ ...branding, headingFont: value })}
                >
                  <SelectTrigger id="headingFont">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {headingFontOptions.map(font => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div 
              className="border rounded-lg p-6 space-y-2"
              style={{
                backgroundColor: branding.accentColor,
                color: branding.secondaryColor,
                fontFamily: branding.fontFamily
              }}
            >
              <h2 
                className="text-2xl font-bold"
                style={{
                  color: branding.primaryColor,
                  fontFamily: branding.headingFont
                }}
              >
                {clientName}
              </h2>
              <p className="text-sm">
                This is how your branding will look on the client subdomain.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-gold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Palette className="w-4 h-4 mr-2" />
                  Save Branding
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
