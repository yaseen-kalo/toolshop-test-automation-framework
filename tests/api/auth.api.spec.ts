import { test, expect } from "@playwright/test";
import { AuthService } from "@services/auth.service";
import { LoginRequest } from "@models/auth.types";
import { loginPayload } from "@data/auth.data";

test.describe("Authentication API - Login", () => {
  test("should login successfully as admin and return access token", async ({
    request,
  }) => {
    //Arrange
    const authService = new AuthService(request);

    //Act
    const response = await authService.login(
      loginPayload(process.env.ADMIN_PASSWORD!),
    );

    //Assert
    expect(response.access_token).toBeTruthy();
    expect(response.token_type).toBe("bearer");
    expect(response.expires_in).toBeGreaterThan(0);
  });

  test("should fail to login with wrong password and return 401", async ({
    request,
  }) => {
    //Arrange

    const authService = new AuthService(request);

    //Act
    const response = authService.login(loginPayload(`Welcom01@1`));

    //Assert
    await expect(response).rejects.toThrow("Login failed with status: 401");
  });
});
