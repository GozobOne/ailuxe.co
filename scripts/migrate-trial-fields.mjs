import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function migrate() {
  let connection;
  
  try {
    connection = await mysql.createConnection(DATABASE_URL);
    console.log('✅ Connected to database');

    // Add trial_duration_days column
    try {
      await connection.execute(`
        ALTER TABLE billing_plans 
        ADD COLUMN trialDurationDays INT NULL COMMENT 'Trial period duration in days (null = no trial)'
      `);
      console.log('✅ Added trialDurationDays column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️  trialDurationDays column already exists');
      } else {
        throw error;
      }
    }

    // Add trial_price column
    try {
      await connection.execute(`
        ALTER TABLE billing_plans 
        ADD COLUMN trialPrice INT NULL COMMENT 'Trial price in cents (0 = free trial, null = no trial)'
      `);
      console.log('✅ Added trialPrice column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️  trialPrice column already exists');
      } else {
        throw error;
      }
    }

    console.log('\n✅ Migration complete!');
    console.log('Trial period fields added to billing_plans table');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrate();
