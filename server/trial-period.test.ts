import { describe, it, expect, beforeAll } from "vitest";
import {
  createPlan,
  getAllPlans,
  updatePlan,
  getPlanById,
} from "./billing-db";

describe("Billing Trial Period Feature", () => {
  let testPlanId: number;

  describe("Trial Period Creation", () => {
    it("should create a plan with free trial", async () => {
      const plan = await createPlan({
        name: "Pro Plan with Free Trial",
        description: "Test plan with 14-day free trial",
        price: 2999, // $29.99
        currency: "USD",
        interval: "monthly",
        features: JSON.stringify(["Feature 1", "Feature 2"]),
        trialDurationDays: 14,
        trialPrice: 0, // Free trial
      });

      expect(plan).toBeDefined();
      expect(plan.trialDurationDays).toBe(14);
      expect(plan.trialPrice).toBe(0);
      
      testPlanId = plan.id;
    });

    it("should create a plan with paid trial", async () => {
      const plan = await createPlan({
        name: "Enterprise Plan with Paid Trial",
        description: "Test plan with 7-day $1 trial",
        price: 9999, // $99.99
        currency: "USD",
        interval: "monthly",
        features: JSON.stringify(["Feature 1", "Feature 2", "Feature 3"]),
        trialDurationDays: 7,
        trialPrice: 100, // $1.00 trial
      });

      expect(plan).toBeDefined();
      expect(plan.trialDurationDays).toBe(7);
      expect(plan.trialPrice).toBe(100);
    });

    it("should create a plan without trial", async () => {
      const plan = await createPlan({
        name: "Basic Plan No Trial",
        description: "Test plan without trial period",
        price: 999, // $9.99
        currency: "USD",
        interval: "monthly",
        features: JSON.stringify(["Feature 1"]),
      });

      expect(plan).toBeDefined();
      expect(plan.trialDurationDays).toBeNull();
      expect(plan.trialPrice).toBeNull();
    });
  });

  describe("Trial Period Retrieval", () => {
    it("should retrieve plan with trial period", async () => {
      const plan = await getPlanById(testPlanId);
      
      expect(plan).toBeDefined();
      expect(plan?.trialDurationDays).toBe(14);
      expect(plan?.trialPrice).toBe(0);
    });

    it("should list all plans with trial information", async () => {
      const plans = await getAllPlans();
      
      expect(plans).toBeDefined();
      expect(plans.length).toBeGreaterThan(0);
      
      // Check that trial fields exist in response
      const planWithTrial = plans.find(p => p.trialDurationDays !== null);
      expect(planWithTrial).toBeDefined();
      expect(planWithTrial?.trialDurationDays).toBeGreaterThan(0);
    });
  });

  describe("Trial Period Updates", () => {
    it("should update plan to add trial period", async () => {
      // First create a plan without trial
      const plan = await createPlan({
        name: "Plan to Update",
        description: "Will add trial later",
        price: 1999,
        currency: "USD",
        interval: "monthly",
      });

      // Update to add trial
      const updated = await updatePlan(plan.id, {
        trialDurationDays: 30,
        trialPrice: 0,
      });

      expect(updated).toBeDefined();
      expect(updated.trialDurationDays).toBe(30);
      expect(updated.trialPrice).toBe(0);
    });

    it("should update trial duration and price", async () => {
      const updated = await updatePlan(testPlanId, {
        trialDurationDays: 21,
        trialPrice: 199, // Change to $1.99
      });

      expect(updated).toBeDefined();
      expect(updated.trialDurationDays).toBe(21);
      expect(updated.trialPrice).toBe(199);
    });

    it("should remove trial period from plan", async () => {
      const updated = await updatePlan(testPlanId, {
        trialDurationDays: null,
        trialPrice: null,
      });

      expect(updated).toBeDefined();
      expect(updated.trialDurationDays).toBeNull();
      expect(updated.trialPrice).toBeNull();
    });
  });

  describe("Trial Period Validation", () => {
    it("should handle trial duration without price", async () => {
      // This should be validated at the router level
      // Here we just test that the database accepts it
      const plan = await createPlan({
        name: "Invalid Trial Test",
        description: "Trial duration without price",
        price: 1999,
        currency: "USD",
        interval: "monthly",
        trialDurationDays: 14,
        // trialPrice intentionally omitted
      });

      expect(plan).toBeDefined();
      expect(plan.trialDurationDays).toBe(14);
    });

    it("should handle various trial durations", async () => {
      const durations = [1, 7, 14, 30, 60, 90];
      
      for (const duration of durations) {
        const plan = await createPlan({
          name: `Plan with ${duration}-day trial`,
          description: `Test ${duration} day trial`,
          price: 2999,
          currency: "USD",
          interval: "monthly",
          trialDurationDays: duration,
          trialPrice: 0,
        });

        expect(plan.trialDurationDays).toBe(duration);
      }
    });

    it("should handle various trial prices", async () => {
      const prices = [0, 99, 199, 499, 999]; // $0, $0.99, $1.99, $4.99, $9.99
      
      for (const price of prices) {
        const plan = await createPlan({
          name: `Plan with $${(price / 100).toFixed(2)} trial`,
          description: `Test trial at $${(price / 100).toFixed(2)}`,
          price: 2999,
          currency: "USD",
          interval: "monthly",
          trialDurationDays: 14,
          trialPrice: price,
        });

        expect(plan.trialPrice).toBe(price);
      }
    });
  });

  describe("Trial Period Edge Cases", () => {
    it("should handle zero trial duration", async () => {
      const plan = await createPlan({
        name: "Zero Duration Trial",
        description: "Edge case test",
        price: 2999,
        currency: "USD",
        interval: "monthly",
        trialDurationDays: 0,
        trialPrice: 0,
      });

      expect(plan.trialDurationDays).toBe(0);
    });

    it("should handle large trial durations", async () => {
      const plan = await createPlan({
        name: "Long Trial Period",
        description: "365-day trial",
        price: 2999,
        currency: "USD",
        interval: "monthly",
        trialDurationDays: 365,
        trialPrice: 0,
      });

      expect(plan.trialDurationDays).toBe(365);
    });

    it("should preserve other plan fields when updating trial", async () => {
      const originalPlan = await createPlan({
        name: "Original Plan",
        description: "Original description",
        price: 2999,
        currency: "USD",
        interval: "monthly",
        features: JSON.stringify(["Feature 1", "Feature 2"]),
        interactionQuota: 1000,
      });

      const updated = await updatePlan(originalPlan.id, {
        trialDurationDays: 14,
        trialPrice: 0,
      });

      expect(updated.name).toBe("Original Plan");
      expect(updated.description).toBe("Original description");
      expect(updated.price).toBe(2999);
      expect(updated.interactionQuota).toBe(1000);
      expect(updated.trialDurationDays).toBe(14);
      expect(updated.trialPrice).toBe(0);
    });
  });
});
