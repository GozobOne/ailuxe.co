import { getDb } from "./db";

/**
 * Revenue Forecasting Engine
 * AI-accessible metrics storage for predictive analytics
 */

interface ForecastInput {
  userId: number;
  monthsAhead: number;
}

interface ForecastResult {
  forecastMonth: string;
  forecastedAmount: number;
  confidence: number;
  factors: {
    historicalTrend: number;
    seasonality: number;
    messageVolume: number;
    conversionRate: number;
  };
}

/**
 * Calculate revenue forecast using historical data and message metrics
 */
export async function generateRevenueForecast(input: ForecastInput): Promise<ForecastResult[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const { revenue, messages } = await import("../drizzle/schema");
  const { eq, gte, sql, desc } = await import("drizzle-orm");

  // Get historical revenue (last 12 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const historicalRevenue = await db
    .select({
      month: sql<string>`DATE_FORMAT(${revenue.createdAt}, '%Y-%m')`,
      total: sql<number>`SUM(${revenue.amount})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(revenue)
    .where(eq(revenue.userId, input.userId))
    .groupBy(sql`DATE_FORMAT(${revenue.createdAt}, '%Y-%m')`)
    .orderBy(desc(sql`DATE_FORMAT(${revenue.createdAt}, '%Y-%m')`))
    .limit(12);

  // Get message volume trend
  const messageVolume = await db
    .select({
      month: sql<string>`DATE_FORMAT(${messages.createdAt}, '%Y-%m')`,
      count: sql<number>`COUNT(*)`,
      inbound: sql<number>`SUM(CASE WHEN ${messages.direction} = 'inbound' THEN 1 ELSE 0 END)`,
    })
    .from(messages)
    .where(eq(messages.userId, input.userId))
    .groupBy(sql`DATE_FORMAT(${messages.createdAt}, '%Y-%m')`)
    .orderBy(desc(sql`DATE_FORMAT(${messages.createdAt}, '%Y-%m')`))
    .limit(12);

  // Calculate forecasts
  const forecasts: ForecastResult[] = [];
  const now = new Date();

  for (let i = 1; i <= input.monthsAhead; i++) {
    const forecastDate = new Date(now);
    forecastDate.setMonth(forecastDate.getMonth() + i);
    const forecastMonth = forecastDate.toISOString().slice(0, 7);

    // Calculate historical trend (simple linear regression)
    const avgRevenue = historicalRevenue.length > 0
      ? historicalRevenue.reduce((sum, r) => sum + r.total, 0) / historicalRevenue.length
      : 0;

    // Calculate growth rate
    let growthRate = 0;
    if (historicalRevenue.length >= 2) {
      const recent = historicalRevenue[0].total;
      const older = historicalRevenue[historicalRevenue.length - 1].total;
      growthRate = (recent - older) / older;
    }

    // Calculate seasonality factor (same month last year)
    const sameMonthLastYear = historicalRevenue.find(r => {
      const month = new Date(r.month + '-01').getMonth();
      return month === forecastDate.getMonth();
    });
    const seasonalityFactor = sameMonthLastYear
      ? sameMonthLastYear.total / avgRevenue
      : 1;

    // Calculate message volume factor
    const avgMessageCount = messageVolume.length > 0
      ? messageVolume.reduce((sum, m) => sum + m.count, 0) / messageVolume.length
      : 0;
    const recentMessageCount = messageVolume[0]?.count || 0;
    const messageVolumeFactor = avgMessageCount > 0
      ? recentMessageCount / avgMessageCount
      : 1;

    // Calculate conversion rate (revenue per message)
    const conversionRate = avgMessageCount > 0 && avgRevenue > 0
      ? avgRevenue / avgMessageCount
      : 0;

    // Forecast calculation
    const baseForecast = avgRevenue * (1 + growthRate);
    const seasonalAdjusted = baseForecast * seasonalityFactor;
    const volumeAdjusted = seasonalAdjusted * messageVolumeFactor;
    const forecastedAmount = Math.round(volumeAdjusted);

    // Calculate confidence (based on data availability and consistency)
    let confidence = 0.5; // Base confidence
    if (historicalRevenue.length >= 6) confidence += 0.2;
    if (historicalRevenue.length >= 12) confidence += 0.1;
    if (messageVolume.length >= 6) confidence += 0.1;
    if (Math.abs(growthRate) < 0.5) confidence += 0.1; // Stable growth

    forecasts.push({
      forecastMonth,
      forecastedAmount,
      confidence: Math.min(confidence, 1),
      factors: {
        historicalTrend: growthRate,
        seasonality: seasonalityFactor,
        messageVolume: messageVolumeFactor,
        conversionRate,
      },
    });
  }

  return forecasts;
}

/**
 * Store forecast in database for AI access
 */
export async function storeForecast(userId: number, forecast: ForecastResult) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const { revenueForecast } = await import("../drizzle/schema");

  await db.insert(revenueForecast).values({
    userId,
    forecastMonth: forecast.forecastMonth,
    forecastedAmount: forecast.forecastedAmount,
    confidence: forecast.confidence,
    factors: JSON.stringify(forecast.factors),
    createdAt: new Date().toISOString(),
  });
}

/**
 * Run forecast engine for all users (can be scheduled)
 */
export async function runForecastEngine() {
  const db = await getDb();
  if (!db) {
    console.warn("[Forecast Engine] Database not available");
    return;
  }

  const { users } = await import("../drizzle/schema");

  // Get all users
  const allUsers = await db.select().from(users);

  console.log(`[Forecast Engine] Running for ${allUsers.length} users`);

  for (const user of allUsers) {
    try {
      // Generate 6-month forecast
      const forecasts = await generateRevenueForecast({
        userId: user.id,
        monthsAhead: 6,
      });

      // Store forecasts
      for (const forecast of forecasts) {
        await storeForecast(user.id, forecast);
      }

      console.log(`[Forecast Engine] Generated ${forecasts.length} forecasts for user ${user.id}`);
    } catch (error) {
      console.error(`[Forecast Engine] Error for user ${user.id}:`, error);
    }
  }

  console.log("[Forecast Engine] Completed");
}
