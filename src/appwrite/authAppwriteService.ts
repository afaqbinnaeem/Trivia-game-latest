import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}`)
      .setProject(`${process.env.NEXT_PUBLIC_PROJECTID}`);
    this.account = new Account(this.client);
  }

  async createAccount(email: string, password: string, nickname: string) {
    try {
      console.log(password);
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        nickname
      );
      if (userAccount) {
        return userAccount;
      } else {
        return "User is not created";
      }
    } catch (error) {
      console.error("Error in creating User", error);
    }
  }

  async login(email: string) {
    try {
      console.log(email);
      const password = email+"newUser123"
      console.log(password);
      return await this.account.createEmailSession(email, password);
    } catch (error) {
      console.error("Error in Login User", error);
    }
  }

  async getCurrectUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("AppWrite Service :: getCurrectUser :: Error", error);
    }

    return null;
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("AppWrite Service :: logout :: Error", error);
    }
  }
  // getting all the users ,,///
 
}

const authService = new AuthService();
export default authService;
