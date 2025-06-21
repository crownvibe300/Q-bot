const database = require('./config/database');
const User = require('./models/User');

async function checkDatabaseConnection() {
  try {
    console.log('🔍 Checking database connection...\n');
    
    // 1. Initialize database
    console.log('1. Initializing database...');
    await database.initialize();
    console.log('✅ Database initialized successfully\n');
    
    // 2. Check if users table exists and has data
    console.log('2. Checking users table...');
    const stmt = database.db.prepare('SELECT COUNT(*) as count FROM users');
    const result = stmt.get();
    stmt.free();
    console.log(`✅ Users table exists with ${result.count} users\n`);
    
    // 3. List all users
    console.log('3. Listing all users in database:');
    const listStmt = database.db.prepare('SELECT id, email, firstName, lastName, isActive FROM users');
    const users = [];
    
    while (listStmt.step()) {
      const row = listStmt.getAsObject();
      users.push(row);
    }
    listStmt.free();
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
    } else {
      users.forEach(user => {
        console.log(`   ID: ${user.id}, Email: ${user.email}, Name: ${user.firstName} ${user.lastName}, Active: ${user.isActive}`);
      });
    }
    console.log('');
    
    // 4. Test User model methods
    console.log('4. Testing User model methods...');
    
    // Test findByEmail
    console.log('   Testing User.findByEmail("test@example.com")...');
    const foundUser = await User.findByEmail('test@example.com');
    if (foundUser) {
      console.log(`   ✅ Found user: ${foundUser.email} (ID: ${foundUser.id})`);
      console.log(`   User data: ${JSON.stringify(foundUser.toPublicJSON(), null, 6)}`);
      
      // Test password comparison
      console.log('   Testing password comparison...');
      const passwordMatch = await foundUser.comparePassword('TestPass123');
      console.log(`   Password "TestPass123" matches: ${passwordMatch ? '✅ YES' : '❌ NO'}`);
    } else {
      console.log('   ❌ User not found');
    }
    
    console.log('\n5. Database connection test completed!');
    await database.close();
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    await database.close();
  }
}

checkDatabaseConnection();
