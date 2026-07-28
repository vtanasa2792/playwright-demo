import { APIRequestContext } from "@playwright/test";
import UserConfig from "../../configs/UserConfig";

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

    if (!response.ok()) {
      throw new Error(
        `Login as "${role}" failed: ${response.status()} ${await response.text()}`,
      );
    }

    const body = await response.json();
    if (!body.access_token) {
      throw new Error(
        `Login as "${role}" succeeded but returned no access_code`,
      );
    }
    return body.access_token;
  }
}

export default Authentication;
