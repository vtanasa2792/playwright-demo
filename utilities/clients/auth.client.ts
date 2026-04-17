import { APIRequestContext } from "@playwright/test";
import UserConfig from "../../config/UserConfig";

class Authentication {
  private request: APIRequestContext;
  private userConfig: UserConfig;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.userConfig = new UserConfig();
  }

  async loginAs(role: "admin" | "customer1"): Promise<string> {
    const credentials = this.userConfig.getCredentials(role);
    const response = await this.request.post("/users/login", {
      data: {
        email: credentials.email,
        password: credentials.password,
      },
    });

    const body = await response.json();
    return body.access_token;
  }
}

export default Authentication;
