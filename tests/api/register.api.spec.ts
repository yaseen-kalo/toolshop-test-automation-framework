import { test, expect } from "@playwright/test";
import { RegisterService } from "@services/register.service";
import { RegisterRequest } from "@models/register.types";
import { registerPayload, partialRegisterPayload } from "@data/register.data";

test.describe("Registration API - Register", () => {
  const timestamp = Date.now();
  const email = `smithwill${timestamp}@go.com`;
  const password = `Testsfdl#213`;

  test("should register successfully and return unique id", async ({
    request,
  }) => {
    //Arrange
    const registerService = new RegisterService(request);

    //Act

    const response = await registerService.register(
      registerPayload(email, password),
    );

    //Assert
    expect(response.id).toBeTruthy();
    expect(response.email).toBe(email);
  });

  test("should fail register with duplicate email and return 409", async ({
    request,
  }) => {
    //Arrange
    const registerService = new RegisterService(request);

    //Act & Assert
    await expect(
      registerService.register(
        registerPayload(process.env.DUPLICATEDEMAIL!, password),
      ),
    ).rejects.toThrow("Registration failed with status: 409");
  });

  test("should fail register with too short password and return 422", async ({
    request,
  }) => {
    //Arrange
    const registerService = new RegisterService(request);
    const timestamp = Date.now();
    const email = `smithwill${timestamp}@go.com`;
    const password = `Te@345`;

    //Act & Assert
    await expect(
      registerService.register(registerPayload(email, password)),
    ).rejects.toThrow("Registration failed with status: 422");
  });

  test("should fail registration when the password contains no uppercase letters and return 422", async ({
    request,
  }) => {
    //Arrange
    const registerService = new RegisterService(request);
    const timestamp = Date.now();
    const email = `smithwill${timestamp}@go.com`;
    const password = `tfddfvwe@345`;

    await expect(
      registerService.register(registerPayload(email, password)),
    ).rejects.toThrow("Registration failed with status: 422");
  });

  test("should fail registration when the password contains no special character and return 422", async ({
    request,
  }) => {
    //Arrange
    const registerService = new RegisterService(request);
    const timestamp = Date.now();
    const email = `smithwill${timestamp}@go.com`;
    const password = `tfddfTvwe345`;

    //Act & Assert

    await expect(
      registerService.register(registerPayload(email, password)),
    ).rejects.toThrow("Registration failed with status: 422");
  });

  test("should fail registration when the password contains no number and return 422", async ({
    request,
  }) => {
    //Arrange
    const registerService = new RegisterService(request);
    const timestamp = Date.now();
    const email = `smithwill${timestamp}@go.com`;
    const password = `tfddfTvw@`;

    //Act & Assert
    await expect(
      registerService.register(registerPayload(email, password)),
    ).rejects.toThrow("Registration failed with status: 422");
  });

  test("should fail registration when missing mandatory field and return 422", async ({
    request,
  }) => {
    //Arrange
    const registerService = new RegisterService(request);

    //Act & Assert
    await expect(
      registerService.registerPartial(partialRegisterPayload),
    ).rejects.toThrow("Registration failed with status: 422");
  });
});
