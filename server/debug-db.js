const database = require('./config/database');

async function testDatabase() {
  try {
    console.log('Initializing database...');
    await database.initialize();
    
    console.log('Testing user creation...');
    const userId = await database.createUser({
      email: 'debug@test.com',
      password: 'hashedpassword123',
      firstName: 'Debug',
      lastName: 'User',
      isEmailVerified: false
    });
    
    console.log('User created with ID:', userId);
    
    console.log('Finding user by email...');
    const user = await database.findUserByEmail('debug@test.com');
    console.log('Found user:', user);
    
    console.log('Database test completed successfully');
    await database.close();
  } catch (error) {
    console.error('Database test error:', error);
    await database.close();
  }
}

testDatabase();
