import ApiHelper from './apiHelper';


class UserApi {
  static async getUsers() {
    const res = await ApiHelper.request('users');
    return res.users;
  }

  /**
   * Get an existing user given id;
   * return {id, username, firstName, lastName, email}
   * @param {Number} userId 
   */
  static async getUser(userId) {
    let res = await ApiHelper.request(`users/${userId}`);
    return res.user;
  }

  /**
   * Create a new user based on given user data;
   * return token
   * @param {Object} user - { username, password, first_name, last_name, email }
   */
  static async createUser(user) {
    const res = await ApiHelper.request('users', user, "post");
    return res.token;
  }

  /**
   * Update an existing user based on fields given an object containing 
   * fields to be updated; 
   * return {id, username, firstName, lastName, email}
   * @param {Number} userId 
   * @param {Object} user - { username, password, first_name, last_name, email }
   */
  static async updateUser(userId, user) {
    const res = await ApiHelper.request(`users/${userId}`, user, "patch");
    return res.user;
  }

  /**
   * Remove an existing user; return message string
   * @param {Number} userId 
   */
  static async removeUser(userId) {
    const res = await ApiHelper.request(`users/${userId}`, undefined, "delete");
    return res.message;
  }
}


export default UserApi;