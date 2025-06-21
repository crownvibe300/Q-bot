const User = require('./models/User');
const database = require('./config/database');

async function createTestUser() {
  try {
    console.log('Initializing database...');
    await database.initialize();
    
    console.log('Creating test user...');
    const user = await User.create({
      email: 'test@example.com',
      password: 'TestPass123',
      firstName: 'Test',
      lastName: 'User'
    });
    
    console.log('✅ Test user created successfully!');
    console.log('Email: test@example.com');
    console.log('Password: TestPass123');
    console.log('User ID:', user.id);
    
    await database.close();
  } catch (error) {
    if (error && error.message && error.message.includes('already exists')) {
      console.log('✅ Test user already exists!');
      console.log('Email: test@example.com');
      console.log('Password: TestPass123');
    } else {
      console.error('Error creating test user:', error);
    }
    await database.close();
  }
}

createTestUser();
