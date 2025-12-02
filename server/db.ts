import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, chatHistories } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values)
      .onConflictDoUpdate({
        target: users.openId,
        set: updateSet,
      });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// Chat History Functions
export async function uploadChatHistory(data: {
  userId: number;
  fileName: string;
  fileType: 'txt' | 'json' | 'pdf';
  fileUrl: string;
  fileKey: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(chatHistories).values({
    userId: data.userId,
    fileName: data.fileName,
    fileType: data.fileType,
    fileUrl: data.fileUrl,
    fileKey: data.fileKey,
  });

  // Get the inserted record
  const inserted = await db.select().from(chatHistories)
    .where(eq(chatHistories.userId, data.userId))
    .orderBy(chatHistories.id)
    .limit(1);

  return inserted[0];
}

export async function getChatHistoriesByUser(userId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(chatHistories).where(eq(chatHistories.userId, userId));
}

export async function getPersonaById(id: number) {
  const db = await getDb();
  if (!db) {
    return null;
  }

  const result = await db.select().from(chatHistories).where(eq(chatHistories.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function processChatHistory(chatHistory: any) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Import LLM helper
  const { invokeLLM } = await import('./_core/llm');

  // Simulate chat content extraction (in production, fetch from S3 and parse)
  const sampleMessages = [
    "Hi, I need a model for a fashion shoot next week.",
    "Sure! What's your budget and preferred style?",
    "Around $200, looking for elegant and professional.",
  ];

  // Use DeepSeek to analyze tone and patterns
  const analysisPrompt = `Analyze the following conversation and extract:
1. Communication tone (formal/casual/friendly)
2. Language preferences (English/Arabic/mixed)
3. Common phrases or patterns
4. Response style (brief/detailed)
5. Personality traits

Conversation:
${sampleMessages.join('\n')}

Return a JSON object with these fields: tone, language, commonPhrases (array), responseStyle, personalityTraits (array)`;

  const llmResponse = await invokeLLM({
    messages: [
      { role: 'system' as const, content: 'You are an expert at analyzing communication patterns.' },
      { role: 'user' as const, content: analysisPrompt as string }
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'persona_analysis',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            tone: { type: 'string' },
            language: { type: 'string' },
            commonPhrases: { type: 'array', items: { type: 'string' } },
            responseStyle: { type: 'string' },
            personalityTraits: { type: 'array', items: { type: 'string' } },
          },
          required: ['tone', 'language', 'commonPhrases', 'responseStyle', 'personalityTraits'],
          additionalProperties: false,
        },
      },
    },
  });

  const messageContent = llmResponse.choices[0].message.content;
  const contentString = typeof messageContent === 'string' ? messageContent : JSON.stringify(messageContent);
  const toneConfig = JSON.parse(contentString || '{}');

  // Update chat history with persona data
  await db.update(chatHistories)
    .set({
      messageCount: sampleMessages.length,
      processedAt: new Date(),
      personaModelId: 'deepseek-coder-v2', // In production, create fine-tuned model
      toneConfig: JSON.stringify(toneConfig),
    })
    .where(eq(chatHistories.id, chatHistory.id));

  return {
    success: true,
    personaModelId: 'deepseek-coder-v2',
    toneConfig,
    messageCount: sampleMessages.length,
  };
}

// Message Functions
export async function getRecentMessages(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get messages: database not available");
    return [];
  }

  const { messages } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");

  const result = await db
    .select()
    .from(messages)
    .where(eq(messages.userId, userId))
    .orderBy(desc(messages.createdAt))
    .limit(limit);

  return result;
}

export async function getMessagesByPlatform(
  userId: number,
  platform: 'whatsapp' | 'telegram' | 'signal',
  limit: number = 50
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get messages: database not available");
    return [];
  }

  const { messages } = await import("../drizzle/schema");
  const { desc, and } = await import("drizzle-orm");

  const result = await db
    .select()
    .from(messages)
    .where(and(eq(messages.userId, userId), eq(messages.platform, platform)))
    .orderBy(desc(messages.createdAt))
    .limit(limit);

  return result;
}

export async function createMessage(data: {
  userId: number;
  platform: 'whatsapp' | 'telegram' | 'signal';
  direction: 'inbound' | 'outbound';
  messageType?: 'text' | 'voice' | 'image' | 'document';
  content?: string;
  mediaUrl?: string;
  transcription?: string;
  respondedBy?: string;
  responseTime?: number;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create message: database not available");
    return null;
  }

  const { messages } = await import("../drizzle/schema");

  const result = await db.insert(messages).values({
    userId: data.userId,
    platform: data.platform,
    direction: data.direction,
    messageType: data.messageType || 'text',
    content: data.content,
    mediaUrl: data.mediaUrl,
    transcription: data.transcription,
    respondedBy: data.respondedBy,
    responseTime: data.responseTime,
  });

  return result;
}

export async function getMessageStats(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get message stats: database not available");
    return {
      totalMessages: 0,
      inboundMessages: 0,
      outboundMessages: 0,
      whatsappMessages: 0,
      telegramMessages: 0,
      signalMessages: 0,
      avgResponseTime: 0,
    };
  }

  const { messages } = await import("../drizzle/schema");
  const { count, avg } = await import("drizzle-orm");

  const allMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.userId, userId));

  const stats = {
    totalMessages: allMessages.length,
    inboundMessages: allMessages.filter(m => m.direction === 'inbound').length,
    outboundMessages: allMessages.filter(m => m.direction === 'outbound').length,
    whatsappMessages: allMessages.filter(m => m.platform === 'whatsapp').length,
    telegramMessages: allMessages.filter(m => m.platform === 'telegram').length,
    signalMessages: allMessages.filter(m => m.platform === 'signal').length,
    avgResponseTime: allMessages
      .filter(m => m.responseTime)
      .reduce((sum, m) => sum + (m.responseTime || 0), 0) / 
      (allMessages.filter(m => m.responseTime).length || 1),
  };

  return stats;
}

// Contact Management Functions
export async function createContact(data: {
  userId: number;
  name: string;
  phone?: string;
  email?: string;
  platform?: 'whatsapp' | 'telegram' | 'signal' | 'multiple';
  status?: 'active' | 'past' | 'prospect' | 'lead';
  tags?: string;
  notes?: string;
  avatarUrl?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create contact: database not available");
    return null;
  }

  const { contacts } = await import("../drizzle/schema");

  const result = await db.insert(contacts).values({
    userId: data.userId,
    name: data.name,
    phone: data.phone,
    email: data.email,
    platform: data.platform,
    status: data.status || 'prospect',
    tags: data.tags,
    notes: data.notes,
    avatarUrl: data.avatarUrl,
  });

  return result;
}

export async function getContactsByUser(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contacts: database not available");
    return [];
  }

  const { contacts } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");

  const result = await db
    .select()
    .from(contacts)
    .where(eq(contacts.userId, userId))
    .orderBy(desc(contacts.createdAt));

  return result;
}

export async function getContactById(contactId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contact: database not available");
    return null;
  }

  const { contacts } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");

  const result = await db
    .select()
    .from(contacts)
    .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateContact(
  contactId: number,
  userId: number,
  data: {
    name?: string;
    phone?: string;
    email?: string;
    platform?: 'whatsapp' | 'telegram' | 'signal' | 'multiple';
    status?: 'active' | 'past' | 'prospect' | 'lead';
    tags?: string;
    notes?: string;
    avatarUrl?: string;
    lastContactedAt?: Date;
  }
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update contact: database not available");
    return null;
  }

  const { contacts } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");

  const result = await db
    .update(contacts)
    .set(data)
    .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)));

  return result;
}

export async function deleteContact(contactId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete contact: database not available");
    return null;
  }

  const { contacts } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");

  const result = await db
    .delete(contacts)
    .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)));

  return result;
}

export async function getContactsByStatus(
  userId: number,
  status: 'active' | 'past' | 'prospect' | 'lead'
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contacts: database not available");
    return [];
  }

  const { contacts } = await import("../drizzle/schema");
  const { and, desc } = await import("drizzle-orm");

  const result = await db
    .select()
    .from(contacts)
    .where(and(eq(contacts.userId, userId), eq(contacts.status, status)))
    .orderBy(desc(contacts.createdAt));

  return result;
}

export async function searchContacts(userId: number, query: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot search contacts: database not available");
    return [];
  }

  const { contacts } = await import("../drizzle/schema");
  const { and, or, like, desc } = await import("drizzle-orm");

  const searchPattern = `%${query}%`;

  const result = await db
    .select()
    .from(contacts)
    .where(
      and(
        eq(contacts.userId, userId),
        or(
          like(contacts.name, searchPattern),
          like(contacts.phone, searchPattern),
          like(contacts.email, searchPattern),
          like(contacts.tags, searchPattern)
        )
      )
    )
    .orderBy(desc(contacts.createdAt));

  return result;
}

export async function getContactMessageHistory(contactId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contact messages: database not available");
    return [];
  }

  const { messages } = await import("../drizzle/schema");
  const { and, desc } = await import("drizzle-orm");

  const result = await db
    .select()
    .from(messages)
    .where(and(eq(messages.userId, userId), eq(messages.contactId, contactId)))
    .orderBy(desc(messages.createdAt));

  return result;
}

// Message Search Functions
export async function searchMessages(
  userId: number,
  filters: {
    query?: string;
    platform?: 'whatsapp' | 'telegram' | 'signal';
    messageType?: 'text' | 'voice' | 'image' | 'document';
    direction?: 'inbound' | 'outbound';
    dateFrom?: string;
    dateTo?: string;
  }
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot search messages: database not available");
    return [];
  }

  const { messages } = await import("../drizzle/schema");
  const { and, or, like, eq, gte, lte, desc } = await import("drizzle-orm");

  const conditions = [eq(messages.userId, userId)];

  // Full-text search in content and transcription
  if (filters.query) {
    const searchPattern = `%${filters.query}%`;
    conditions.push(
      or(
        like(messages.content, searchPattern),
        like(messages.transcription, searchPattern)
      )!
    );
  }

  // Platform filter
  if (filters.platform) {
    conditions.push(eq(messages.platform, filters.platform));
  }

  // Message type filter
  if (filters.messageType) {
    conditions.push(eq(messages.messageType, filters.messageType));
  }

  // Direction filter
  if (filters.direction) {
    conditions.push(eq(messages.direction, filters.direction));
  }

  // Date range filter
  if (filters.dateFrom) {
    conditions.push(gte(messages.createdAt, filters.dateFrom));
  }
  if (filters.dateTo) {
    conditions.push(lte(messages.createdAt, filters.dateTo));
  }

  const result = await db
    .select()
    .from(messages)
    .where(and(...conditions))
    .orderBy(desc(messages.createdAt))
    .limit(100);

  return result;
}

// getMessageStats already exists above, removed duplicate

// Analytics Functions
export async function getAnalyticsData(userId: number, days: number = 30) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get analytics: database not available");
    return null;
  }

  const { messages } = await import("../drizzle/schema");
  const { eq, gte, sql, desc } = await import("drizzle-orm");

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Response time trend (daily averages)
  const responseTimeTrend = await db
    .select({
      date: sql<string>`DATE(${messages.createdAt})`,
      avgResponseTime: sql<number>`AVG(${messages.responseTime})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(messages)
    .where(eq(messages.userId, userId))
    .groupBy(sql`DATE(${messages.createdAt})`)
    .orderBy(desc(sql`DATE(${messages.createdAt})`))
    .limit(days);

  // Message volume by platform
  const volumeByPlatform = await db
    .select({
      platform: messages.platform,
      count: sql<number>`COUNT(*)`,
      inbound: sql<number>`SUM(CASE WHEN ${messages.direction} = 'inbound' THEN 1 ELSE 0 END)`,
      outbound: sql<number>`SUM(CASE WHEN ${messages.direction} = 'outbound' THEN 1 ELSE 0 END)`,
    })
    .from(messages)
    .where(eq(messages.userId, userId))
    .groupBy(messages.platform);

  // Peak activity hours (24-hour breakdown)
  const peakHours = await db
    .select({
      hour: sql<number>`HOUR(${messages.createdAt})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(messages)
    .where(eq(messages.userId, userId))
    .groupBy(sql`HOUR(${messages.createdAt})`)
    .orderBy(sql`HOUR(${messages.createdAt})`);

  // Message type distribution
  const typeDistribution = await db
    .select({
      messageType: messages.messageType,
      count: sql<number>`COUNT(*)`,
    })
    .from(messages)
    .where(eq(messages.userId, userId))
    .groupBy(messages.messageType);

  return {
    responseTimeTrend,
    volumeByPlatform,
    peakHours,
    typeDistribution,
  };
}

export async function getRevenueForecast(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get revenue forecast: database not available");
    return null;
  }

  const { revenue, revenueForecast } = await import("../drizzle/schema");
  const { eq, gte, sql, desc } = await import("drizzle-orm");

  // Get actual revenue for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const actualRevenue = await db
    .select({
      month: sql<string>`DATE_FORMAT(${revenue.createdAt}, '%Y-%m')`,
      total: sql<number>`SUM(${revenue.amount})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(revenue)
    .where(eq(revenue.userId, userId))
    .groupBy(sql`DATE_FORMAT(${revenue.createdAt}, '%Y-%m')`)
    .orderBy(desc(sql`DATE_FORMAT(${revenue.createdAt}, '%Y-%m')`))
    .limit(6);

  // Get AI forecasts
  const forecasts = await db
    .select()
    .from(revenueForecast)
    .where(eq(revenueForecast.userId, userId))
    .orderBy(desc(revenueForecast.forecastMonth))
    .limit(6);

  return {
    actualRevenue,
    forecasts,
  };
}
