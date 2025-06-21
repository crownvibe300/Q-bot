const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '../data/qbot.db');
  }

  async initialize() {
    try {
      // Initialize SQL.js
      const SQL = await initSqlJs();
      
      // Create data directory if it doesn't exist
      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Load existing database or create new one
      let buffer;
      if (fs.existsSync(this.dbPath)) {
        buffer = fs.readFileSync(this.dbPath);
      }
      
      this.db = new SQL.Database(buffer);
      
      // Create tables if they don't exist
      await this.createTables();
      
      console.log('SQLite database initialized successfully');
      return this.db;
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  async createTables() {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        firstName TEXT,
        lastName TEXT,
        googleId TEXT UNIQUE,
        avatar TEXT,
        isEmailVerified INTEGER DEFAULT 0,
        emailVerificationToken TEXT,
        passwordResetToken TEXT,
        passwordResetExpires INTEGER,
        lastLogin INTEGER,
        isActive INTEGER DEFAULT 1,
        role TEXT DEFAULT 'user',
        createdAt INTEGER DEFAULT (strftime('%s', 'now')),
        updatedAt INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `;

    try {
      this.db.run(createUsersTable);
      console.log('Users table created/verified');
    } catch (error) {
      console.error('Error creating users table:', error);
      throw error;
    }
  }

  async save() {
    try {
      const data = this.db.export();
      fs.writeFileSync(this.dbPath, data);
    } catch (error) {
      console.error('Error saving database:', error);
      throw error;
    }
  }

  async close() {
    if (this.db) {
      await this.save();
      this.db.close();
    }
  }

  // User methods
  async createUser(userData) {
    const { email, password, firstName, lastName, googleId, avatar, isEmailVerified } = userData;

    const stmt = this.db.prepare(`
      INSERT INTO users (email, password, firstName, lastName, googleId, avatar, isEmailVerified, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, strftime('%s', 'now'))
    `);

    try {
      const result = stmt.run([
        email || null,
        password || null,
        firstName || null,
        lastName || null,
        googleId || null,
        avatar || null,
        isEmailVerified ? 1 : 0
      ]);
      await this.save();
      return result.lastInsertRowid;
    } catch (error) {
      throw error;
    } finally {
      stmt.free();
    }
  }

  async findUserByEmail(email) {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ? AND isActive = 1');
    try {
      stmt.bind([email]);
      if (stmt.step()) {
        const result = stmt.getAsObject();
        return result;
      }
      return null;
    } finally {
      stmt.free();
    }
  }

  async findUserById(id) {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ? AND isActive = 1');
    try {
      stmt.bind([id]);
      if (stmt.step()) {
        const result = stmt.getAsObject();
        return result;
      }
      return null;
    } finally {
      stmt.free();
    }
  }

  async findUserByGoogleId(googleId) {
    const stmt = this.db.prepare('SELECT * FROM users WHERE googleId = ? AND isActive = 1');
    try {
      stmt.bind([googleId]);
      if (stmt.step()) {
        const result = stmt.getAsObject();
        return result;
      }
      return null;
    } finally {
      stmt.free();
    }
  }

  async updateUser(id, updates) {
    const allowedFields = ['firstName', 'lastName', 'avatar', 'lastLogin', 'isEmailVerified', 'googleId'];
    const updateFields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    updateFields.push('updatedAt = strftime(\'%s\', \'now\')');
    values.push(id);

    const stmt = this.db.prepare(`
      UPDATE users SET ${updateFields.join(', ')} WHERE id = ?
    `);

    try {
      const result = stmt.run(values);
      await this.save();
      return result.changes > 0;
    } finally {
      stmt.free();
    }
  }

  async updateUserPassword(id, hashedPassword) {
    const stmt = this.db.prepare(`
      UPDATE users SET password = ?, updatedAt = strftime('%s', 'now') WHERE id = ?
    `);

    try {
      const result = stmt.run([hashedPassword, id]);
      await this.save();
      return result.changes > 0;
    } finally {
      stmt.free();
    }
  }
}

// Create singleton instance
const database = new Database();

module.exports = database;
