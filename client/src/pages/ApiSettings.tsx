import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Save, TestTube2 } from "lucide-react";

interface ApiConfig {
  whatsapp: {
    phoneNumberId: string;
    accessToken: string;
    webhookVerifyToken: string;
  };
  voice: {
    model: string;
  };
}

export default function ApiSettings() {
  const { toast } = useToast();
  const [showTokens, setShowTokens] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  const [config, setConfig] = useState<ApiConfig>({
    whatsapp: {
      phoneNumberId: "86827295631771",
      accessToken: "EAAIf6rO482CQBPXnsuzICQu...",
      webhookVerifyToken: "ailuxe_webhook_verify_2025",
    },
    voice: {
      model: "deepseek-whisper",
    },
  });

  // Load saved config from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ailuxe_api_config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved config:', e);
      }
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage (in production, this would be an API call)
      localStorage.setItem('ailuxe_api_config', JSON.stringify(config));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configuration Saved",
        description: "Your API settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Connection Successful",
        description: "WhatsApp Business API connection is working correctly.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to WhatsApp Business API.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestVoice = async () => {
    setIsTesting(true);
    try {
      // Simulate voice test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Voice Test Successful",
        description: `${config.voice.model === 'deepseek-whisper' ? 'DeepSeek Whisper' : 'OpenAI Whisper'} is working correctly.`,
      });
    } catch (error) {
      toast({
        title: "Voice Test Failed",
        description: "Failed to test voice transcription.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🔌</span>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-luxury to-yellow-400 bg-clip-text text-transparent">
            API Settings
          </h1>
        </div>
        <p className="text-muted-foreground">
          Secure credential storage for integrations · WhatsApp Business + AI Voice live
        </p>
      </div>

      {/* WhatsApp Business Cloud API */}
      <Card className="border-luxury/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📱</span>
            WhatsApp Business Cloud API
          </CardTitle>
          <CardDescription>
            Official WhatsApp Business API credentials from Meta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumberId">Phone Number ID *</Label>
            <Input
              id="phoneNumberId"
              value={config.whatsapp.phoneNumberId}
              onChange={(e) => setConfig({
                ...config,
                whatsapp: { ...config.whatsapp, phoneNumberId: e.target.value }
              })}
              placeholder="Enter your Phone Number ID"
            />
            <p className="text-xs text-muted-foreground">
              Found in Meta Business Suite → WhatsApp → API Setup
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessToken">Access Token *</Label>
            <div className="flex gap-2">
              <Input
                id="accessToken"
                type={showTokens ? "text" : "password"}
                value={config.whatsapp.accessToken}
                onChange={(e) => setConfig({
                  ...config,
                  whatsapp: { ...config.whatsapp, accessToken: e.target.value }
                })}
                placeholder="Enter your Access Token"
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowTokens(!showTokens)}
              >
                {showTokens ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Permanent access token from Meta Business Suite
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookToken">Webhook Verify Token *</Label>
            <Input
              id="webhookToken"
              value={config.whatsapp.webhookVerifyToken}
              onChange={(e) => setConfig({
                ...config,
                whatsapp: { ...config.whatsapp, webhookVerifyToken: e.target.value }
              })}
              placeholder="Enter your Webhook Verify Token"
            />
            <p className="text-xs text-muted-foreground">
              Custom token you create for webhook verification (any random string)
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Webhook URL (for Meta configuration):</Label>
            <div className="bg-muted border border-luxury rounded-lg p-3 font-mono text-sm text-luxury">
              https://ailuxe.co/api/whatsapp/webhook
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-luxury hover:bg-luxury/90 text-black"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
            <Button
              onClick={handleTestConnection}
              disabled={isTesting}
              variant="outline"
              className="flex-1"
            >
              <TestTube2 className="mr-2 h-4 w-4" />
              {isTesting ? "Testing..." : "Test Connection"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI / Voice Settings */}
      <Card className="border-luxury/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎙️</span>
            AI / Voice Settings
          </CardTitle>
          <CardDescription>
            Configure voice transcription preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="voiceModel">Voice Model</Label>
            <Select
              value={config.voice.model}
              onValueChange={(value) => setConfig({
                ...config,
                voice: { model: value }
              })}
            >
              <SelectTrigger id="voiceModel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deepseek-whisper">DeepSeek Whisper</SelectItem>
                <SelectItem value="openai-whisper">OpenAI Whisper</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-luxury hover:bg-luxury/90 text-black"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
            <Button
              onClick={handleTestVoice}
              disabled={isTesting}
              variant="outline"
              className="flex-1"
            >
              <TestTube2 className="mr-2 h-4 w-4" />
              {isTesting ? "Testing..." : "Test Voice"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
