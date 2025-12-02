import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";

export function GoogleCalendarStatus() {
  const { data: status, isLoading, refetch } = trpc.googleCalendar.getConnectionStatus.useQuery();
  const { data: authUrl } = trpc.googleCalendar.getAuthUrl.useQuery(undefined, {
    enabled: false,
  });

  const handleConnect = async () => {
    try {
      toast.info("Opening Google authorization...");
      const result = await trpc.googleCalendar.getAuthUrl.useQuery();
      if (result.data?.url) {
        window.open(result.data.url, "_blank");
        toast.success("Please complete authorization in the new window");
      }
    } catch (error) {
      toast.error("Failed to get authorization URL");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Checking connection...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Google Calendar</span>
              {status?.connected ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <XCircle className="w-3 h-3" />
                  Not Connected
                </Badge>
              )}
            </div>
            {status?.email && (
              <p className="text-sm text-muted-foreground">{status.email}</p>
            )}
          </div>
        </div>

        {!status?.connected && (
          <Button onClick={handleConnect} size="sm">
            Connect Calendar
          </Button>
        )}
      </div>

      {status?.expiresAt && (
        <p className="text-xs text-muted-foreground">
          Token expires: {new Date(status.expiresAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
