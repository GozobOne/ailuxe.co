import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Clock, TrendingUp, Users, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function TrialDashboardWidget() {
  const { data: activeTrials, isLoading: trialsLoading } = trpc.subscriptions.getActiveTrials.useQuery();
  const { data: expiringSoon, isLoading: expiringLoading } = trpc.subscriptions.getExpiringSoon.useQuery();
  const convertMutation = trpc.subscriptions.convertToPaid.useMutation();

  const handleConvert = async (userId: number, userName: string) => {
    try {
      const result = await convertMutation.mutateAsync({ userId });
      if (result.success) {
        toast.success(`${userName} converted to paid subscription!`);
      } else {
        toast.error("Failed to convert subscription");
      }
    } catch (error) {
      toast.error("Error converting subscription");
    }
  };

  if (trialsLoading || expiringLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalTrials = activeTrials?.length || 0;
  const expiringCount = expiringSoon?.length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Active Trials Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Active Trials
          </CardTitle>
          <CardDescription>Users currently on trial period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-600 mb-4">{totalTrials}</div>
          {activeTrials && activeTrials.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activeTrials.map((trial) => (
                <div key={trial.userId} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{trial.userName}</div>
                    <div className="text-xs text-muted-foreground">{trial.planName}</div>
                  </div>
                  <Badge variant={trial.daysRemaining <= 3 ? "destructive" : "secondary"}>
                    {trial.daysRemaining}d left
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No active trials</p>
          )}
        </CardContent>
      </Card>

      {/* Expiring Soon Card */}
      <Card className={expiringCount > 0 ? "border-amber-500" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Expiring Soon
          </CardTitle>
          <CardDescription>Trials ending within 3 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-amber-600 mb-4">{expiringCount}</div>
          {expiringSoon && expiringSoon.length > 0 ? (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {expiringSoon.map((trial) => (
                <div key={trial.userId} className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{trial.userName}</div>
                      <div className="text-xs text-muted-foreground">{trial.userEmail}</div>
                    </div>
                    <Badge variant="destructive">
                      {trial.daysRemaining}d left
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    className="w-full gradient-luxury text-foreground"
                    onClick={() => handleConvert(trial.userId, trial.userName)}
                    disabled={convertMutation.isPending}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Convert to Paid
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No trials expiring soon</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
