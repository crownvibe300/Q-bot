const database = require('./config/database');

async function listUsers() {
  try {
    console.log('Initializing database...');
    await database.initialize();
    
    console.log('Listing all users...');
    const stmt = database.db.prepare('SELECT * FROM users');
    const users = [];

    while (stmt.step()) {
      const row = stmt.getAsObject();
      users.push(row);
    }

    console.log('Users in database:');
    users.forEach(user => {
      console.log(`ID: ${user.id}, Email: ${user.email}, Name: ${user.firstName} ${user.lastName}`);
    });

    stmt.free();
    await database.close();
  } catch (error) {
    console.error('Error listing users:', error);
    await database.close();
  }
}

listUsers();
