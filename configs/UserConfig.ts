type UserRoles = "admin" | "customer1";

class UserConfig {
  credentials: Record<string, { email: string; password: string }>;

  constructor() {
    if (!process.env.TEST_USERS)
      throw new Error("TEST_USERS env variable is not set");

    this.credentials = JSON.parse(process.env.TEST_USERS);
  }

  getCredentials(role: UserRoles) {
    return this.credentials[role];
  }
}

export default UserConfig;
