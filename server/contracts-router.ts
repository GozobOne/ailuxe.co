import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { contracts, bookings } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

// Contract generation using reportlab (Python) or weasyprint
// For now, we'll create a placeholder that generates contract data
// In production, this would call a Python script or external service

const contractTemplates = {
  service: {
    en: `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into on {date} between:

CLIENT: {clientName}
Address: {clientAddress}
Phone: {clientPhone}
Email: {clientEmail}

SERVICE PROVIDER: {providerName}
Address: {providerAddress}
Phone: {providerPhone}
Email: {providerEmail}

1. SERVICES
The Service Provider agrees to provide the following services:
Event Type: {eventType}
Event Date: {eventDate}
Event Location: {eventLocation}
Description: {description}

2. COMPENSATION
Total Fee: {currency} {totalAmount}
Deposit: {currency} {depositAmount} (due upon signing)
Balance: {currency} {balanceAmount} (due {balanceDueDate})

3. TERMS AND CONDITIONS
- Cancellation must be made at least 48 hours in advance
- Deposits are non-refundable
- Final payment must be received before event date
- Any additional services will be billed separately

4. SIGNATURES
This agreement is legally binding upon signature by both parties.

Client Signature: ___________________ Date: ___________
Provider Signature: _________________ Date: ___________
`,
    ar: `اتفاقية الخدمة

تم إبرام اتفاقية الخدمة هذه ("الاتفاقية") في {date} بين:

العميل: {clientName}
العنوان: {clientAddress}
الهاتف: {clientPhone}
البريد الإلكتروني: {clientEmail}

مقدم الخدمة: {providerName}
العنوان: {providerAddress}
الهاتف: {providerPhone}
البريد الإلكتروني: {providerEmail}

١. الخدمات
يوافق مقدم الخدمة على تقديم الخدمات التالية:
نوع الحدث: {eventType}
تاريخ الحدث: {eventDate}
موقع الحدث: {eventLocation}
الوصف: {description}

٢. التعويض
الرسوم الإجمالية: {currency} {totalAmount}
الدفعة المقدمة: {currency} {depositAmount} (مستحقة عند التوقيع)
الرصيد: {currency} {balanceAmount} (مستحق {balanceDueDate})

٣. الشروط والأحكام
- يجب إلغاء الحجز قبل 48 ساعة على الأقل
- الدفعات المقدمة غير قابلة للاسترداد
- يجب استلام الدفعة النهائية قبل تاريخ الحدث
- سيتم إصدار فاتورة منفصلة لأي خدمات إضافية

٤. التوقيعات
هذه الاتفاقية ملزمة قانونًا عند توقيعها من قبل الطرفين.

توقيع العميل: ___________________ التاريخ: ___________
توقيع مقدم الخدمة: _________________ التاريخ: ___________
`
  },
  nda: {
    en: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("NDA") is entered into on {date} between:

DISCLOSING PARTY: {providerName}
RECEIVING PARTY: {clientName}

1. CONFIDENTIAL INFORMATION
The parties agree to keep confidential all information shared regarding:
- Event details and planning
- Client lists and contact information
- Pricing and financial terms
- Business strategies and methods

2. OBLIGATIONS
The Receiving Party agrees to:
- Not disclose confidential information to third parties
- Use information only for the intended purpose
- Protect information with reasonable security measures

3. TERM
This NDA remains in effect for 2 years from the date of signing.

Client Signature: ___________________ Date: ___________
Provider Signature: _________________ Date: ___________
`,
    ar: `اتفاقية عدم الإفصاح

تم إبرام اتفاقية عدم الإفصاح هذه ("NDA") في {date} بين:

الطرف المفصح: {providerName}
الطرف المتلقي: {clientName}

١. المعلومات السرية
يوافق الطرفان على الحفاظ على سرية جميع المعلومات المشتركة المتعلقة بـ:
- تفاصيل الحدث والتخطيط
- قوائم العملاء ومعلومات الاتصال
- الأسعار والشروط المالية
- استراتيجيات وطرق العمل

٢. الالتزامات
يوافق الطرف المتلقي على:
- عدم الكشف عن المعلومات السرية لأطراف ثالثة
- استخدام المعلومات فقط للغرض المقصود
- حماية المعلومات بتدابير أمنية معقولة

٣. المدة
تظل اتفاقية عدم الإفصاح هذه سارية المفعول لمدة سنتين من تاريخ التوقيع.

توقيع العميل: ___________________ التاريخ: ___________
توقيع مقدم الخدمة: _________________ التاريخ: ___________
`
  }
};

export const contractsRouter = router({
  // List all contracts
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const allContracts = await db.select().from(contracts).orderBy(desc(contracts.createdAt));
    return allContracts;
  }),

  // Get contract by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [contract] = await db.select().from(contracts).where(eq(contracts.id, input.id));
      return contract;
    }),

  // Generate contract from booking
  generateFromBooking: publicProcedure
    .input(z.object({
      bookingId: z.string(),
      type: z.enum(["service", "nda", "non-compete"]),
      language: z.enum(["en", "ar"]).default("en"),
      providerName: z.string(),
      providerAddress: z.string().optional(),
      providerPhone: z.string().optional(),
      providerEmail: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // Get booking details
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, input.bookingId));
      
      if (!booking) {
        throw new Error("Booking not found");
      }

      // Get template
      const template = contractTemplates[input.type as keyof typeof contractTemplates]?.[input.language];
      
      if (!template) {
        throw new Error(`Template not found for type: ${input.type}, language: ${input.language}`);
      }

      // Replace placeholders
      const contractContent = template
        .replace(/{date}/g, new Date().toLocaleDateString(input.language === "ar" ? "ar-SA" : "en-US"))
        .replace(/{clientName}/g, booking.clientName || "N/A")
        .replace(/{clientAddress}/g, "N/A")
        .replace(/{clientPhone}/g, booking.clientPhone || "N/A")
        .replace(/{clientEmail}/g, booking.clientEmail || "N/A")
        .replace(/{providerName}/g, input.providerName)
        .replace(/{providerAddress}/g, input.providerAddress || "N/A")
        .replace(/{providerPhone}/g, input.providerPhone || "N/A")
        .replace(/{providerEmail}/g, input.providerEmail || "N/A")
        .replace(/{eventType}/g, booking.eventType || "N/A")
        .replace(/{eventDate}/g, booking.eventDate ? new Date(booking.eventDate).toLocaleDateString() : "N/A")
        .replace(/{eventLocation}/g, "N/A")
        .replace(/{description}/g, booking.notes || "Event services as discussed")
        .replace(/{currency}/g, booking.currency || "USD")
        .replace(/{totalAmount}/g, booking.budget?.toString() || "0")
        .replace(/{depositAmount}/g, (Number(booking.budget || 0) * 0.3).toFixed(2))
        .replace(/{balanceAmount}/g, (Number(booking.budget || 0) * 0.7).toFixed(2))
        .replace(/{balanceDueDate}/g, booking.eventDate ? new Date(new Date(booking.eventDate).getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString() : "7 days before event");

      // Create contract record
      const contractId = nanoid();
      const [newContract] = await db.insert(contracts).values({
        id: contractId,
        bookingId: input.bookingId,
        type: input.type,
        language: input.language,
        content: contractContent,
        status: "draft",
        createdAt: new Date(),
      }).returning();

      return newContract;
    }),

  // Update contract status
  updateStatus: publicProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["draft", "sent", "signed", "paid", "expired"]),
      signedAt: z.date().optional(),
      signedBy: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const [updated] = await db.update(contracts)
        .set({
          status: input.status,
          signedAt: input.signedAt,
          signedBy: input.signedBy,
          updatedAt: new Date(),
        })
        .where(eq(contracts.id, input.id))
        .returning();

      return updated;
    }),

  // Send contract for signature (placeholder for e-signature integration)
  sendForSignature: publicProcedure
    .input(z.object({
      id: z.string(),
      recipientEmail: z.string().email(),
      recipientName: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Update contract status to "sent"
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const [updated] = await db.update(contracts)
        .set({
          status: "sent",
          sentAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(contracts.id, input.id))
        .returning();

      // In production, integrate with DocuSign, HelloSign, or Adobe Sign
      // For now, we'll just return success
      console.log(`[Contracts] Sent contract ${input.id} to ${input.recipientEmail}`);

      return {
        success: true,
        message: `Contract sent to ${input.recipientEmail}`,
        contract: updated,
      };
    }),

  // Delete contract
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(contracts).where(eq(contracts.id, input.id));
      return { success: true };
    }),
});
