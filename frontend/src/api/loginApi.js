import ApiHelper from './apiHelper';


class AuthApi {
  static async login(username, password) {
    const res = await ApiHelper.request('login', { username, password }, "post");
    return res.token;
  }
}


export default AuthApi;