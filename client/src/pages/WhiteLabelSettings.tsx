import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Palette, Globe, DollarSign, FileText, RotateCcw } from "lucide-react";
import { Link } from "wouter";

export default function WhiteLabelSettings() {
  const [formData, setFormData] = useState<any>({});

  // Query settings
  const settingsQuery = trpc.whiteLabel.get.useQuery();

  // Update mutation
  const updateMutation = trpc.whiteLabel.update.useMutation({
    onSuccess: () => {
      toast.success("Settings updated successfully");
      settingsQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update settings: ${error.message}`);
    },
  });

  // Reset mutation
  const resetMutation = trpc.whiteLabel.reset.useMutation({
    onSuccess: () => {
      toast.success("Settings reset to defaults");
      settingsQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to reset settings: ${error.message}`);
    },
  });

  // Load settings into form
  useEffect(() => {
    if (settingsQuery.data) {
      setFormData(settingsQuery.data);
    }
  }, [settingsQuery.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      resetMutation.mutate();
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                <Palette className="w-6 h-6 text-primary" />
                White-Label Settings
              </h1>
              <p className="text-sm text-neutral-600">Customize your tenant branding and localization</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} disabled={resetMutation.isPending}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
              <Link href="/admin">
                <Button variant="outline">← Back to Admin</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="branding" className="space-y-6">
            <TabsList>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="localization">Localization</TabsTrigger>
              <TabsTrigger value="currency">Currency & Tax</TabsTrigger>
              <TabsTrigger value="voice">Voice Settings</TabsTrigger>
              <TabsTrigger value="legal">Legal & Contracts</TabsTrigger>
            </TabsList>

            {/* Branding Tab */}
            <TabsContent value="branding">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Identity</CardTitle>
                  <CardDescription>Customize your brand appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Brand Name</Label>
                    <Input
                      id="brandName"
                      value={formData.brandName || ""}
                      onChange={(e) => handleChange("brandName", e.target.value)}
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brandLogo">Brand Logo URL</Label>
                    <Input
                      id="brandLogo"
                      value={formData.brandLogo || ""}
                      onChange={(e) => handleChange("brandLogo", e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                    {formData.brandLogo && (
                      <div className="mt-2">
                        <img
                          src={formData.brandLogo}
                          alt="Brand Logo Preview"
                          className="h-16 object-contain border rounded p-2"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brandColor">Brand Color (Hex)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="brandColor"
                        value={formData.brandColor || ""}
                        onChange={(e) => handleChange("brandColor", e.target.value)}
                        placeholder="#4F46E5"
                      />
                      <input
                        type="color"
                        value={formData.brandColor || "#4F46E5"}
                        onChange={(e) => handleChange("brandColor", e.target.value)}
                        className="w-12 h-10 border rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Localization Tab */}
            <TabsContent value="localization">
              <Card>
                <CardHeader>
                  <CardTitle>Language & Locale</CardTitle>
                  <CardDescription>Configure language and regional settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={formData.language || "en"}
                        onValueChange={(value) => handleChange("language", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ar">Arabic</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="locale">Locale</Label>
                      <Input
                        id="locale"
                        value={formData.locale || ""}
                        onChange={(e) => handleChange("locale", e.target.value)}
                        placeholder="en-US"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="rtl"
                      checked={formData.rtl === 1}
                      onChange={(e) => handleChange("rtl", e.target.checked ? 1 : 0)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="rtl" className="cursor-pointer">
                      Enable Right-to-Left (RTL) layout
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select
                        value={formData.dateFormat || "MM/DD/YYYY"}
                        onValueChange={(value) => handleChange("dateFormat", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (UK)</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                          <SelectItem value="DD.MM.YYYY">DD.MM.YYYY (DE)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeFormat">Time Format</Label>
                      <Select
                        value={formData.timeFormat || "12h"}
                        onValueChange={(value) => handleChange("timeFormat", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                          <SelectItem value="24h">24-hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={formData.timezone || ""}
                      onChange={(e) => handleChange("timezone", e.target.value)}
                      placeholder="America/New_York"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Currency & Tax Tab */}
            <TabsContent value="currency">
              <Card>
                <CardHeader>
                  <CardTitle>Currency & Tax Settings</CardTitle>
                  <CardDescription>Configure pricing and tax rules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency Code</Label>
                      <Select
                        value={formData.currency || "USD"}
                        onValueChange={(value) => handleChange("currency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="KWD">KWD - Kuwaiti Dinar</SelectItem>
                          <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                          <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                          <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                          <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currencySymbol">Currency Symbol</Label>
                      <Input
                        id="currencySymbol"
                        value={formData.currencySymbol || ""}
                        onChange={(e) => handleChange("currencySymbol", e.target.value)}
                        placeholder="$"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        step="0.01"
                        value={formData.taxRate ? (formData.taxRate / 100).toFixed(2) : "0"}
                        onChange={(e) => handleChange("taxRate", Math.round(parseFloat(e.target.value) * 100))}
                        placeholder="15.5"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxLabel">Tax Label</Label>
                      <Input
                        id="taxLabel"
                        value={formData.taxLabel || ""}
                        onChange={(e) => handleChange("taxLabel", e.target.value)}
                        placeholder="VAT / Sales Tax"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Voice Settings Tab */}
            <TabsContent value="voice">
              <Card>
                <CardHeader>
                  <CardTitle>Voice & Speech Settings</CardTitle>
                  <CardDescription>Configure voice transcription preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="voiceModel">Voice Model</Label>
                    <Select
                      value={formData.voiceModel || ""}
                      onValueChange={(value) => handleChange("voiceModel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select voice model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deepseek-whisper">DeepSeek Whisper</SelectItem>
                        <SelectItem value="openai-whisper">OpenAI Whisper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="voiceLanguage">Voice Language</Label>
                    <Select
                      value={formData.voiceLanguage || "en"}
                      onValueChange={(value) => handleChange("voiceLanguage", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Legal & Contracts Tab */}
            <TabsContent value="legal">
              <Card>
                <CardHeader>
                  <CardTitle>Legal & Contract Templates</CardTitle>
                  <CardDescription>Configure legal documents and templates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="termsUrl">Terms of Service URL</Label>
                    <Input
                      id="termsUrl"
                      value={formData.termsUrl || ""}
                      onChange={(e) => handleChange("termsUrl", e.target.value)}
                      placeholder="https://example.com/terms"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="privacyUrl">Privacy Policy URL</Label>
                    <Input
                      id="privacyUrl"
                      value={formData.privacyUrl || ""}
                      onChange={(e) => handleChange("privacyUrl", e.target.value)}
                      placeholder="https://example.com/privacy"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contractTemplate">Contract Template</Label>
                    <Textarea
                      id="contractTemplate"
                      value={formData.contractTemplate || ""}
                      onChange={(e) => handleChange("contractTemplate", e.target.value)}
                      placeholder="Enter your contract template with {{variables}}"
                      rows={10}
                    />
                    <p className="text-xs text-neutral-600">
                      Use variables like {`{{clientName}}`}, {`{{date}}`}, {`{{amount}}`} for dynamic content
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button type="submit" size="lg" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save All Settings"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
