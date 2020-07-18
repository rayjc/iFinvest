const bcrypt = require("bcrypt");

const db = require("../db");
const ExpressError = require("../helpers/expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");
const partialUpdate = require("../helpers/partialUpdate");


class User {
  constructor(id, username, password, firstName, lastName, email) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.first_name = firstName;
    this.last_name = lastName;
    this.email = email;
  }

  get fullName() {
    return `${this.first_name} ${this.last_name}`;
  }

  /**
   * Registers a new user, returns a User instance.
   * @param {String} username 
   * @param {String} password 
   * @param {String} firstName 
   * @param {String} lastName 
   * @param {String} email 
   */
  static async register(username, password, firstName, lastName, email) {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    try {
      const result = await db.query(
        `INSERT INTO users
          (username, password, first_name, last_name, email)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, username, password, first_name, last_name, email`,
        [username, hashedPassword, firstName, lastName, email]
      );

      const r = result.rows[0];
      return new User(...Object.values(r));

    } catch (error) {
      if (error.code === "23505") {
        throw new ExpressError(`${error.column} already exists.`, 403);
      }
      throw error;
    }
  }

  /**
   * Authenticates with username and password, returns boolean.
   * @param {String} username 
   * @param {String} password 
   */
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT password FROM users WHERE username = $1`,
      [username]);
    const user = result.rows[0];

    if (user) {
      return await bcrypt.compare(password, user.password);
    }

    throw new ExpressError("Invalid user/password", 401);
  }

  /**
   * Get a user by id, returns a User instance
   * @param {Number} id 
   */
  static async getById(id) {
    const result = await db.query(
      `SELECT id, username, password, first_name, last_name, email
        FROM users
        WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`'${id}' not found`, 404);
    }

    const r = result.rows[0];
    return new User(...Object.values(r));
  }

  /**
   * Get a user by username, returns a User instance
   * @param {String} username
   */
  static async getByUsername(username) {
    const result = await db.query(
      `SELECT id, username, password, first_name, last_name, email
        FROM users
        WHERE username = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`'${username}' not found`, 404);
    }

    const r = result.rows[0];
    return new User(...Object.values(r));
  }

  /**
   * Get all users; returns an array of User objects
   */
  static async getAll() {
    const result = await db.query(
      `SELECT id, username, password, first_name, last_name, email
        FROM users`
    );

    return result.rows.map(r => new User(...Object.values(r)));
  }

  /**
   * Updates user data with `data`.
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   * Returns data for changed user.
   *
   * PRE: user should be authenticated and password field is unhashed.
   * @param {Number} id 
   * @param {Object} data
   */
  static async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    let { query, values } = partialUpdate(
      "users",
      data,
      "id",
      id
    );

    try {
      const result = await db.query(query, values);
      const user = result.rows[0];

      if (!user) {
        throw new ExpressError(`Cannot find userId:${id}`, 404);
      }

      return new User(...Object.values(user));

    } catch (error) {
      if (error.code === "23505") {
        throw new ExpressError(`${error.column} already exists.`, 403);
      }
      throw error;
    }
  }

  /**
   * Delete a user in db based on current instance 
   */
  async remove() {
    const result = await db.query(
      `DELETE FROM users WHERE id=$1 RETURNING *`,
      [this.id]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`Cannot find userId${this.id}.`, 404);
    }
  }
}


module.exports = User;