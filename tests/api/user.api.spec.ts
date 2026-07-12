import { UserService } from "@services/user.service";
import { AuthService } from "@services/auth.service";
import {
  getForgetPasswordPaylaod,
  getChangePasswordPayload,
  getUpdateUserPayload,
  getPartialUpdateUserPayload,
} from "@data/user.data";
import { test, expect } from "@playwright/test";
import { EnvHelper } from "@utils/env.helper";

test.describe("User API Endpoints", () => {
  test.describe.configure({ mode: "serial" });
  let token: string;
  let userId: string;
  let userService;
  let user_last_name: string;
  const emailAddress = `${process.env.ADMIN_EMAIL}`;
  let refreshedToken: string;

  test.beforeAll(
    "login as an Admin and reterive the access token",
    async ({ request }) => {
      //Arrange
      const authService = new AuthService(request, token);

      //Act
      const response = await authService.login({
        email: emailAddress,
        password: `${process.env.ADMIN_PASSWORD}`,
      });

      token = response.access_token;
    },
  );
  test("Get User details", async ({ request }) => {
    //Arrange
    userService = new UserService(request, token);

    //Act
    const response = await userService.getCustomersDetails();

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.total).toBeGreaterThan(0);
  });

  test("Get current User Info", async ({ request }) => {
    //Arrange
    userService = new UserService(request, token);

    //Act
    const response = await userService.getCustomerInfoDetails();

    userId = response.id;
    user_last_name = response.last_name;

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response.id).not.toBeNull;
    expect(response).toHaveProperty("role", "admin");
    expect(response.email).toEqual(emailAddress);
  });

  test("Refresh the token", async ({ request }) => {
    //Arrange
    userService = new UserService(request, token);

    //Act
    const response = await userService.getRefreshToken();

    refreshedToken = response.access_token;
    //Assert
    expect(response).toHaveProperty("access_token");
    expect(response).toHaveProperty("token_type");
    expect(response.expires_in).toBeGreaterThan(100);
  });

  test("Get User info for a specific user with Id", async ({ request }) => {
    //Arrange
    userService = new UserService(request, refreshedToken);

    //Act
    const response = await userService.getUserInfoById(userId);

    //Assert
    expect(response.id).toEqual(userId);
    expect(response).toBeInstanceOf(Object);
    expect(response.email).toEqual(emailAddress);
    expect(response.address).not.toBeNull();
  });

  test("Get User info for a specific user with user's lastName", async ({
    request,
  }) => {
    //Arrange
    userService = new UserService(request, refreshedToken);

    //Act
    const response = await userService.getUserInfoByName(user_last_name);

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response.data[0].last_name).toEqual(user_last_name);
    expect(response.data.length).toBeGreaterThan(0);
    for (const user of response.data) {
      expect(user).toHaveProperty("email");
      expect(user.email).not.toBeNull();
    }
  });

  test("User is able to forget the password successfully", async ({
    request,
  }) => {
    //Arrange
    userService = new UserService(request, refreshedToken);
    const payload = getForgetPasswordPaylaod(emailAddress);
    //Act
    const response = await userService.forgetPassword(payload);

    //Assert
    expect(response).toHaveProperty("success", true);
  });

  test("User is able to change the password successfully", async ({
    request,
  }) => {
    // Arrange
    userService = new UserService(request, refreshedToken);
    const newPassword = `Welcome@${Date.now()}`;

    const payload = getChangePasswordPayload(
      process.env.ADMIN_PASSWORD!,
      newPassword,
    );

    // Act
    const response = await userService.changePassword(payload);

    // Assert
    expect(response).toHaveProperty("success", true);

    // Update .env
    EnvHelper.updateEnvVariable("ADMIN_PASSWORD", newPassword);
  });

  test("Update complete user info with user Id", async ({ request }) => {
    //Arrange
    userService = new UserService(request, refreshedToken);
    const payload = getUpdateUserPayload(
      `${process.env.API_BASE_URL}`,
      emailAddress,
    );

    //Act
    const response = await userService.updateTheUser(userId, payload);

    //Assert
    expect(response).toHaveProperty("success", true);
  });

  test("Update partially user info with user Id", async ({ request }) => {
    //Arrange
    userService = new UserService(request, refreshedToken);
    const payload = getUpdateUserPayload(
      `${process.env.API_BASE_URL}`,
      emailAddress,
    );

    //Act
    const response = await userService.partialUpdateTheUser(userId, payload);

    //Assert
    expect(response).toHaveProperty("success", true);
  });

  // skip so we can carray out test execution again n again. Delete endpoint is also working fine.
  test.skip("Delete User by User id --- NOTE: skip so we can carray out test execution again & again", async ({
    request,
  }) => {
    //Arrange
    userService = new UserService(request, refreshedToken);

    //Act
    const response = await userService.deleteUserById(userId);
  });

  test("Logout -- Invalidate the token", async ({ request }) => {
    //Arrange
    userService = new UserService(request, refreshedToken);

    //Act
    const response = await userService.InvalidateTheToken();

    //Asset
    expect(response).toHaveProperty("message", "Successfully logged out");
  });
});
