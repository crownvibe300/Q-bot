const bcrypt = require('bcryptjs');
const database = require('../config/database');

class User {
  constructor(userData) {
    // Manually assign properties to avoid getter/setter conflicts
    this.id = userData.id;
    this.email = userData.email;
    this.password = userData.password;
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.googleId = userData.googleId;
    this.avatar = userData.avatar;
    this.isEmailVerified = userData.isEmailVerified;
    this.emailVerificationToken = userData.emailVerificationToken;
    this.passwordResetToken = userData.passwordResetToken;
    this.passwordResetExpires = userData.passwordResetExpires;
    this.isActive = userData.isActive;
    this.role = userData.role;

    // Handle timestamps properly
    this._lastLogin = userData.lastLogin;
    this._createdAt = userData.createdAt;
    this._updatedAt = userData.updatedAt;
  }

  // Static method to create a new user
  static async create(userData) {
    const { email, password, firstName, lastName, googleId, avatar, isEmailVerified } = userData;

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email');
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      const salt = await bcrypt.genSalt(12);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    try {
      const userId = await database.createUser({
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        googleId,
        avatar,
        isEmailVerified: isEmailVerified || false
      });

      const user = await User.findById(userId);
      return user;
    } catch (error) {
      if (error && error.message && error.message.includes('UNIQUE constraint failed')) {
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  }

  // Static method to find user by email
  static async findByEmail(email) {
    const userData = await database.findUserByEmail(email.toLowerCase());
    return userData ? new User(userData) : null;
  }

  // Static method to find user by ID
  static async findById(id) {
    const userData = await database.findUserById(id);
    return userData ? new User(userData) : null;
  }

  // Static method to find user by Google ID
  static async findByGoogleId(googleId) {
    const userData = await database.findUserByGoogleId(googleId);
    return userData ? new User(userData) : null;
  }

  // Instance method to check password
  async comparePassword(candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Instance method to update user
  async update(updates) {
    const success = await database.updateUser(this.id, updates);
    if (success) {
      Object.assign(this, updates);
      this.updatedAt = Math.floor(Date.now() / 1000);
    }
    return success;
  }

  // Instance method to update password
  async updatePassword(newPassword) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const success = await database.updateUserPassword(this.id, hashedPassword);
    if (success) {
      this.password = hashedPassword;
      this.updatedAt = Math.floor(Date.now() / 1000);
    }
    return success;
  }

  // Instance method to save (for compatibility)
  async save() {
    if (this.id) {
      // Update existing user
      const updates = {
        firstName: this.firstName,
        lastName: this.lastName,
        avatar: this.avatar,
        lastLogin: this.lastLogin ? Math.floor(this.lastLogin.getTime() / 1000) : null,
        isEmailVerified: this.isEmailVerified,
        googleId: this.googleId
      };
      return await this.update(updates);
    } else {
      throw new Error('Cannot save user without ID. Use User.create() instead.');
    }
  }

  // Instance method to get public profile
  toPublicJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar,
      isEmailVerified: !!this.isEmailVerified,
      lastLogin: this.lastLogin ? new Date(this.lastLogin * 1000) : null,
      createdAt: this.createdAt ? new Date(this.createdAt * 1000) : null
    };
  }

  // Convert timestamps for compatibility
  get lastLogin() {
    return this._lastLogin ? new Date(this._lastLogin * 1000) : null;
  }

  set lastLogin(date) {
    this._lastLogin = date ? Math.floor(date.getTime() / 1000) : null;
  }

  get createdAt() {
    return this._createdAt ? new Date(this._createdAt * 1000) : null;
  }

  get updatedAt() {
    return this._updatedAt ? new Date(this._updatedAt * 1000) : null;
  }
}

module.exports = User;
