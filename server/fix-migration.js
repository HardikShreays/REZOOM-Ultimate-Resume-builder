const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function fixMigration() {
  try {
    console.log('🔍 Checking database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    console.log('🔄 Running Prisma migrations...');
    
    try {
      // Try to run migrations
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Migrations deployed successfully');
    } catch (migrateError) {
      console.log('⚠️  Migration failed, trying db push...');
      try {
        execSync('npx prisma db push', { stdio: 'inherit' });
        console.log('✅ Database schema pushed successfully');
      } catch (pushError) {
        console.error('❌ Both migration and db push failed');
        throw pushError;
      }
    }

    // Verify tables exist
    console.log('🔍 Verifying tables exist...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('User', 'Resume', 'Experience', 'Education', 'Project', 'Skill', 'Certification')
    `;
    
    console.log('📋 Found tables:', tables);
    
    if (tables.length === 6) {
      console.log('✅ All required tables exist');
    } else {
      console.log('⚠️  Some tables might be missing');
    }

    console.log('🎉 Database setup complete!');

  } catch (error) {
    console.error('❌ Fix migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixMigration();
