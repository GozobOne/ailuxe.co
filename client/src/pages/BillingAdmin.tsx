import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Edit, Trash2, DollarSign, Ticket, Users } from "lucide-react";
import { Link } from "wouter";

export default function BillingAdmin() {
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  // Queries
  const plansQuery = trpc.billing.plans.getAll.useQuery();
  const couponsQuery = trpc.billing.coupons.getAll.useQuery();

  // Mutations
  const createPlanMutation = trpc.billing.plans.create.useMutation({
    onSuccess: () => {
      toast.success("Plan created successfully");
      plansQuery.refetch();
      setPlanDialogOpen(false);
      setEditingPlan(null);
    },
    onError: (error) => {
      toast.error(`Failed to create plan: ${error.message}`);
    },
  });

  const updatePlanMutation = trpc.billing.plans.update.useMutation({
    onSuccess: () => {
      toast.success("Plan updated successfully");
      plansQuery.refetch();
      setPlanDialogOpen(false);
      setEditingPlan(null);
    },
    onError: (error) => {
      toast.error(`Failed to update plan: ${error.message}`);
    },
  });

  const deletePlanMutation = trpc.billing.plans.delete.useMutation({
    onSuccess: () => {
      toast.success("Plan deleted successfully");
      plansQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete plan: ${error.message}`);
    },
  });

  const createCouponMutation = trpc.billing.coupons.create.useMutation({
    onSuccess: () => {
      toast.success("Coupon created successfully");
      couponsQuery.refetch();
      setCouponDialogOpen(false);
      setEditingCoupon(null);
    },
    onError: (error) => {
      toast.error(`Failed to create coupon: ${error.message}`);
    },
  });

  const updateCouponMutation = trpc.billing.coupons.update.useMutation({
    onSuccess: () => {
      toast.success("Coupon updated successfully");
      couponsQuery.refetch();
      setCouponDialogOpen(false);
      setEditingCoupon(null);
    },
    onError: (error) => {
      toast.error(`Failed to update coupon: ${error.message}`);
    },
  });

  const deleteCouponMutation = trpc.billing.coupons.delete.useMutation({
    onSuccess: () => {
      toast.success("Coupon deleted successfully");
      couponsQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete coupon: ${error.message}`);
    },
  });

  const handleSavePlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const trialDurationDays = formData.get("trialDurationDays") as string;
    const trialPrice = formData.get("trialPrice") as string;

    const planData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseInt(formData.get("price") as string) * 100, // Convert to cents
      currency: formData.get("currency") as string,
      interval: formData.get("interval") as "monthly" | "yearly" | "lifetime",
      features: formData.get("features") as string,
      interactionQuota: parseInt(formData.get("interactionQuota") as string),
      active: formData.get("active") === "1" ? 1 : 0,
      sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
      stripePriceId: formData.get("stripePriceId") as string || undefined,
      lemonSqueezyVariantId: formData.get("lemonSqueezyVariantId") as string || undefined,
      trialDurationDays: trialDurationDays ? parseInt(trialDurationDays) : undefined,
      trialPrice: trialPrice ? Math.round(parseFloat(trialPrice) * 100) : undefined, // Convert to cents
    };

    if (editingPlan) {
      updatePlanMutation.mutate({ id: editingPlan.id, ...planData });
    } else {
      createPlanMutation.mutate(planData);
    }
  };

  const handleSaveCoupon = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const couponData = {
      code: (formData.get("code") as string).toUpperCase(),
      description: formData.get("description") as string,
      discountType: formData.get("discountType") as "percentage" | "fixed",
      discountValue: parseInt(formData.get("discountValue") as string),
      maxUses: formData.get("maxUses") ? parseInt(formData.get("maxUses") as string) : undefined,
      expiresAt: formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : undefined,
      active: formData.get("active") === "1" ? 1 : 0,
    };

    if (editingCoupon) {
      updateCouponMutation.mutate({ id: editingCoupon.id, ...couponData });
    } else {
      createCouponMutation.mutate(couponData);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-primary" />
                Billing Management
              </h1>
              <p className="text-sm text-neutral-600">Manage plans, coupons, and subscriptions</p>
            </div>
            <Link href="/admin">
              <Button variant="outline">← Back to Admin</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="coupons">Coupons</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Billing Plans</h2>
              <Button
                onClick={() => {
                  setEditingPlan(null);
                  setPlanDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Plan
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Interval</TableHead>
                      <TableHead>Trial</TableHead>
                      <TableHead>Quota</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plansQuery.data?.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>
                          {plan.currency} ${(plan.price / 100).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{plan.interval}</Badge>
                        </TableCell>
                        <TableCell>
                          {plan.trialDurationDays ? (
                            <div className="text-sm">
                              <div className="font-medium">{plan.trialDurationDays} days</div>
                              <div className="text-muted-foreground">
                                {plan.trialPrice === 0 ? "Free" : `$${(plan.trialPrice! / 100).toFixed(2)}`}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">No trial</span>
                          )}
                        </TableCell>
                        <TableCell>{plan.interactionQuota} interactions</TableCell>
                        <TableCell>
                          {plan.active ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingPlan(plan);
                              setPlanDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this plan?")) {
                                deletePlanMutation.mutate({ id: plan.id });
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coupons Tab */}
          <TabsContent value="coupons" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Discount Coupons</h2>
              <Button
                onClick={() => {
                  setEditingCoupon(null);
                  setCouponDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Coupon
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {couponsQuery.data?.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell className="font-mono font-semibold">{coupon.code}</TableCell>
                        <TableCell>
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `$${(coupon.discountValue / 100).toFixed(2)}`}
                        </TableCell>
                        <TableCell>
                          {coupon.usedCount || 0}
                          {coupon.maxUses ? ` / ${coupon.maxUses}` : " / ∞"}
                        </TableCell>
                        <TableCell>
                          {coupon.expiresAt
                            ? new Date(coupon.expiresAt).toLocaleDateString()
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          {coupon.active ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingCoupon(coupon);
                              setCouponDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this coupon?")) {
                                deleteCouponMutation.mutate({ id: coupon.id });
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
                <CardDescription>View and manage user subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600">
                  Subscription management coming soon. Users can subscribe via the public pricing page.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Plan Dialog */}
      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Edit Plan" : "Create Plan"}</DialogTitle>
            <DialogDescription>
              Configure pricing plan details and features
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSavePlan} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingPlan?.name}
                  required
                  placeholder="e.g., Pro Plan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={editingPlan ? (editingPlan.price / 100).toFixed(2) : ""}
                  required
                  placeholder="29.99"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  name="currency"
                  defaultValue={editingPlan?.currency || "USD"}
                  placeholder="USD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interval">Billing Interval *</Label>
                <Select name="interval" defaultValue={editingPlan?.interval || "monthly"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="lifetime">Lifetime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingPlan?.description || ""}
                placeholder="Brief description of the plan"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (JSON array)</Label>
              <Textarea
                id="features"
                name="features"
                defaultValue={editingPlan?.features || '["Feature 1", "Feature 2", "Feature 3"]'}
                placeholder='["Feature 1", "Feature 2"]'
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interactionQuota">Monthly Interaction Quota</Label>
                <Input
                  id="interactionQuota"
                  name="interactionQuota"
                  type="number"
                  defaultValue={editingPlan?.interactionQuota || 500}
                  placeholder="500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  defaultValue={editingPlan?.sortOrder || 0}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stripePriceId">Stripe Price ID</Label>
                <Input
                  id="stripePriceId"
                  name="stripePriceId"
                  defaultValue={editingPlan?.stripePriceId || ""}
                  placeholder="price_..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lemonSqueezyVariantId">Lemon Squeezy Variant ID</Label>
                <Input
                  id="lemonSqueezyVariantId"
                  name="lemonSqueezyVariantId"
                  defaultValue={editingPlan?.lemonSqueezyVariantId || ""}
                  placeholder="123456"
                />
              </div>
            </div>

            {/* Trial Period Section */}
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-1">
                <Label className="text-base font-semibold">Trial Period (Optional)</Label>
                <p className="text-sm text-muted-foreground">
                  Offer a trial period for new clients. Leave empty for no trial.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trialDurationDays">Trial Duration (Days)</Label>
                  <Input
                    id="trialDurationDays"
                    name="trialDurationDays"
                    type="number"
                    min="1"
                    defaultValue={editingPlan?.trialDurationDays || ""}
                    placeholder="e.g., 14"
                  />
                  <p className="text-xs text-muted-foreground">Number of days for trial period</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trialPrice">Trial Price (USD)</Label>
                  <Input
                    id="trialPrice"
                    name="trialPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingPlan?.trialPrice !== null && editingPlan?.trialPrice !== undefined ? (editingPlan.trialPrice / 100).toFixed(2) : ""}
                    placeholder="0.00 for free trial"
                  />
                  <p className="text-xs text-muted-foreground">0.00 = free trial</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="active">Status</Label>
              <Select name="active" defaultValue={editingPlan?.active?.toString() || "1"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPlanDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPlanMutation.isPending || updatePlanMutation.isPending}>
                {editingPlan ? "Update" : "Create"} Plan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Coupon Dialog */}
      <Dialog open={couponDialogOpen} onOpenChange={setCouponDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
            <DialogDescription>
              Configure discount coupon details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveCoupon} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code *</Label>
              <Input
                id="code"
                name="code"
                defaultValue={editingCoupon?.code}
                required
                placeholder="SAVE20"
                className="uppercase"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingCoupon?.description || ""}
                placeholder="Brief description of the coupon"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select name="discountType" defaultValue={editingCoupon?.discountType || "percentage"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value *</Label>
                <Input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  defaultValue={editingCoupon?.discountValue}
                  required
                  placeholder="20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxUses">Max Uses (optional)</Label>
                <Input
                  id="maxUses"
                  name="maxUses"
                  type="number"
                  defaultValue={editingCoupon?.maxUses || ""}
                  placeholder="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expires At (optional)</Label>
                <Input
                  id="expiresAt"
                  name="expiresAt"
                  type="date"
                  defaultValue={
                    editingCoupon?.expiresAt
                      ? new Date(editingCoupon.expiresAt).toISOString().split("T")[0]
                      : ""
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="active">Status</Label>
              <Select name="active" defaultValue={editingCoupon?.active?.toString() || "1"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCouponDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createCouponMutation.isPending || updateCouponMutation.isPending}>
                {editingCoupon ? "Update" : "Create"} Coupon
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
