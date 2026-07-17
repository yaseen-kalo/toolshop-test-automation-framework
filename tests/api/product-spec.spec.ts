import { AuthService } from "@services/auth.service";
import { ProductSpecService } from "@services/product-spec.service";
import { getAddORUpdateSpecToAProductPayload } from "@data/product-spec.data";
import { test, expect } from "@playwright/test";

test.describe("Product Spec -- API Tests", () => {
  test.describe.configure({ mode: "serial" });

  let authService;
  let productSpecSerivce;
  let token: string;
  //hardcode it for now. will get with product api call in e2e test.
  let productId: string = "01KXB2TWFQ2XGY0R3KNZ0N3QY0";
  let specId: string;
  test.beforeAll(
    "Login as an Admin and reterive the admin token",
    async ({ request }) => {
      //Arrange
      authService = new AuthService(request);

      //Act
      const response = await authService.login({
        email: `${process.env.ADMIN_EMAIL}`,
        password: `${process.env.ADMIN_PASSWORD}`,
      });

      //Set token to variable
      token = response.access_token;
    },
  );

  test("get specs for a specific product", async ({ request }) => {
    //Arrange
    productSpecSerivce = new ProductSpecService(request);

    //Act
    const response = await productSpecSerivce.GetSpecForAProduct(productId);

    //Assert
    specId = response[0].id;
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBeGreaterThan(0);
    for (const spec of response) {
      expect(spec).toHaveProperty("id");
      expect(spec).toHaveProperty("product_id", productId);
      expect(spec).toHaveProperty("spec_name");
      expect(spec).toHaveProperty("spec_value");
      expect(spec).toHaveProperty("spec_unit");
    }
  });

  test("get specific spec for a specific product", async ({ request }) => {
    //Arrange
    productSpecSerivce = new ProductSpecService(request);

    //Act
    const response = await productSpecSerivce.GetASpecificSpecForAProduct(
      productId,
      specId,
    );

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty("id", specId);
    expect(response).toHaveProperty("product_id", productId);
    expect(response).toHaveProperty("spec_name");
    expect(response).toHaveProperty("spec_value");
    expect(response).toHaveProperty("spec_unit");
  });

  test("get distinct spec names with their values", async ({ request }) => {
    //Arrange
    productSpecSerivce = new ProductSpecService(request);

    //Act
    const response = await productSpecSerivce.GetDistinctSpecNames();

    //Assert
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBeGreaterThan(0);
    for (const spec of response) {
      expect(spec).toHaveProperty("name");
      expect(spec.name).not.toBeNull();
      expect(spec).toHaveProperty("values");
      expect(spec.values.length).toBeGreaterThan(0);
      expect(spec).toHaveProperty("unit");
    }
  });

  test("Add a spec to a product", async ({ request }) => {
    //Arrange
    productSpecSerivce = new ProductSpecService(request, token);
    const payload = getAddORUpdateSpecToAProductPayload();
    //Act
    const response = await productSpecSerivce.AddASpecToAProduct(
      productId,
      payload,
    );

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty("product_id", productId);
    expect(response).toHaveProperty("spec_name");
    expect(response).toHaveProperty("spec_value");
    expect(response).toHaveProperty("spec_unit");
    expect(response).toHaveProperty("id");
  });

  test("update a spec of a product", async ({ request }) => {
    //Arrange
    productSpecSerivce = new ProductSpecService(request, token);
    const payload = getAddORUpdateSpecToAProductPayload();
    //Act
    const response = await productSpecSerivce.UpdateASpecToAProduct(
      productId,
      specId,
      payload,
    );

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty("success", true);
  });

  test("delete a spec of a product", async ({ request }) => {
    //Arrange
    productSpecSerivce = new ProductSpecService(request, token);
    //Act
    await productSpecSerivce.DeleteASpecToAProduct(productId, specId);

    //Assert
    console.log("Spec of the specific product has been deleted successfully");
  });
});
