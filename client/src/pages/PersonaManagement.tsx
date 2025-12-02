import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { 
  Upload, 
  Sparkles, 
  FileText,
  CheckCircle2,
  Clock,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function PersonaManagement() {
  const { user, isAuthenticated } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: chatHistories, refetch } = trpc.persona.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const uploadMutation = trpc.persona.uploadChatHistory.useMutation({
    onSuccess: async () => {
      toast.success("File uploaded successfully!");
      await refetch();
      setUploadedFile(null);
    },
    onError: (error) => {
      toast.error("Upload failed", {
        description: error.message
      });
      setIsUploading(false);
    }
  });

  const cloneMutation = trpc.persona.clonePersona.useMutation({
    onSuccess: async (data) => {
      toast.success("Persona cloned successfully! 🎯", {
        description: `Model ID: ${data.personaModelId}`
      });
      await refetch();
    },
    onError: (error) => {
      toast.error("Cloning failed", {
        description: error.message
      });
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['text/plain', 'application/json', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type", {
          description: "Please upload TXT, JSON, or PDF files only"
        });
        return;
      }
      
      if (file.size > 16 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Maximum file size is 16MB"
        });
        return;
      }
      
      setUploadedFile(file);
    }
  };

  const handleUploadAndClone = async () => {
    if (!uploadedFile) {
      toast.error("No file selected");
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result?.toString().split(',')[1];
        if (!base64) {
          toast.error("Failed to read file");
          setIsUploading(false);
          return;
        }

        const fileType = uploadedFile.type.includes('json') ? 'json' : 
                        uploadedFile.type.includes('pdf') ? 'pdf' : 'txt';

        // Upload file
        const result = await uploadMutation.mutateAsync({
          fileName: uploadedFile.name,
          fileContent: base64,
          fileType,
        });

        // Clone persona
        await cloneMutation.mutateAsync({
          chatHistoryId: result.id,
        });

        setIsUploading(false);
      };

      reader.readAsDataURL(uploadedFile);
    } catch (error) {
      setIsUploading(false);
      console.error('Upload error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to manage personas</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/95 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Persona Management</h1>
              <p className="text-xs text-muted-foreground">Clone AI from chat history</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-12 space-y-12">
        {/* Upload Section */}
        <section className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Upload Chat History</h2>
            <p className="text-muted-foreground">
              Upload WhatsApp TXT, Telegram JSON, or PDF files to clone communication style
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload & Clone
              </CardTitle>
              <CardDescription>
                AI will analyze 100-500 messages to clone tone, language, and workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  id="chat-upload"
                  accept=".txt,.json,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <label 
                  htmlFor="chat-upload" 
                  className={`cursor-pointer flex flex-col items-center gap-3 ${isUploading ? 'opacity-50' : ''}`}
                >
                  <FileText className="w-12 h-12 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">
                      {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      TXT, JSON, or PDF up to 16MB
                    </p>
                  </div>
                </label>
              </div>

              {uploadedFile && (
                <Button 
                  className="w-full gradient-luxury text-foreground font-semibold"
                  onClick={handleUploadAndClone}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Upload & Clone Persona
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Personas List */}
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Your Personas</h2>
            <p className="text-muted-foreground">
              Manage and view your cloned AI personas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {chatHistories && chatHistories.length > 0 ? (
              chatHistories.map((persona) => (
                <Card key={persona.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          {persona.fileName}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {persona.fileType?.toUpperCase()} • {persona.messageCount || 0} messages
                        </CardDescription>
                      </div>
                      {persona.processedAt ? (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Cloned
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {persona.processedAt && persona.toneConfig ? (
                      <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                        {(() => {
                          try {
                            const config = JSON.parse(persona.toneConfig as string);
                            return (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Tone:</span>
                                  <span className="font-medium">{config.tone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Language:</span>
                                  <span className="font-medium">{config.language || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Style:</span>
                                  <span className="font-medium">{config.responseStyle || 'N/A'}</span>
                                </div>
                              </>
                            );
                          } catch {
                            return <p className="text-muted-foreground">Configuration data unavailable</p>;
                          }
                        })()}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cloneMutation.mutate({ chatHistoryId: persona.id })}
                          disabled={cloneMutation.isPending}
                        >
                          {cloneMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Cloning...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Clone Persona
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {persona.personaModelId && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Model ID: <span className="font-mono">{persona.personaModelId}</span>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="md:col-span-2">
                <CardContent className="py-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium text-foreground mb-2">No personas yet</p>
                  <p className="text-muted-foreground">
                    Upload your first chat history to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
