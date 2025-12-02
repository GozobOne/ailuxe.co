import { describe, it, expect } from "vitest";
import { getBaileysStatus } from "./baileys-manager";

describe("Baileys WhatsApp Integration", () => {
  it("should get Baileys connection status", async () => {
    const status = await getBaileysStatus();
    
    expect(status).toBeDefined();
    expect(status).toHaveProperty("status");
    expect(status).toHaveProperty("connected");
    expect(typeof status.connected).toBe("boolean");
    expect(["disconnected", "connecting", "connected", "qr_ready"]).toContain(status.status);
  });

  it("should return valid status object structure", async () => {
    const status = await getBaileysStatus();
    
    // Check required fields
    expect(status.status).toBeDefined();
    expect(status.connected).toBeDefined();
    
    // If QR is ready, qr field should be present
    if (status.status === "qr_ready") {
      expect(status.qr).toBeDefined();
      expect(typeof status.qr).toBe("string");
    }
  });
});
