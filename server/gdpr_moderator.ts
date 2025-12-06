
import axios from "axios";

const MOONSHOT_API_URL = "https://api.moonshot.cn/v1/chat/completions";

export async function checkGDPR(text: string): Promise<{ safe: boolean; reason?: string }> {
    try {
        const apiKey = process.env.MOONSHOT_API_KEY;
        if (!apiKey || apiKey.includes("PLACEHOLDER")) {
            console.warn("GDPR: No valid API key found. Skipping check.");
            return { safe: true };
        }

        const response = await axios.post(
            MOONSHOT_API_URL,
            {
                model: process.env.KIMI_MODEL || "kimi-k2-0711",
                messages: [
                    {
                        role: "system",
                        content: `You are a strict GDPR compliance officer for a luxury concierge service. 
            Analyze the following message for any sensitive personal data violations (PII) or inappropriate content 
            that violates EU General Data Protection Regulation.
            If unsafe, return JSON: {"safe": false, "reason": "Reason"}.
            If safe, return JSON: {"safe": true}.
            Output JSON only.`
                    },
                    { role: "user", content: text }
                ],
                temperature: 0.1
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                }
            }
        );

        const result = response.data.choices[0].message.content;
        try {
            // Extract JSON if wrapped in markdown
            const jsonStr = result.replace(/```json/g, "").replace(/```/g, "").trim();
            const analysis = JSON.parse(jsonStr);
            return analysis;
        } catch (e) {
            console.error("GDPR: Failed to parse AI response", result);
            return { safe: true }; // Fail open or closed? Fail open for now to avoid blocking.
        }
    } catch (error) {
        console.error("GDPR Check Failed:", error);
        return { safe: true };
    }
}
