import { test, expect, request } from "@playwright/test";
import { LoginRequest, LoginResponse } from "@models/auth.types";
import {
  createProductPayload,
  partialUpdateProductPayload,
} from "@data/products.data";
import {
  Product,
  PatchProductRequest,
  GetProductsResponse,
  GetProductByIdResponse,
  MutationProductResponse,
  ProductRequest,
} from "@models/products.types";
import { ProductService } from "@services/product.service";
import { AuthService } from "@services/auth.service";

test.describe("Product - API", () => {
  test.describe.configure({ mode: "serial" });
  let token: string;
  let productId: string;

  test.beforeAll(
    "Login as an Admin and reterive the access_token",
    async ({ request }) => {
      //Arrange
      const authService = new AuthService(request);
      const payload: LoginRequest = {
        email: process.env.ADMIN_EMAIL!,
        password: process.env.ADMIN_PASSWORD!,
      };

      //Act
      const response = await authService.login(payload);

      token = response.access_token;
    },
  );

  test("Get Products", async ({ request }) => {
    //Arrange
    const productService = new ProductService(request, token);

    //Act
    const response = await productService.getProducts();

    productId = response.data[1].id;
    console.log("Product ID: " + productId);

    //Assert
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.current_page).toBe(1);
    expect(response.total).toBeGreaterThan(0);
  });

  test("Get product By Id", async ({ request }) => {
    //Arrange
    const productService = new ProductService(request, token);

    //Act
    const response = await productService.getProductById(productId);

    //Assert
    expect(response.id).toEqual(productId);
    expect(response.specs.length).toBeGreaterThan(0);
  });

  test.skip("Create Product - SKIP: POST /products returns 500 bug", async ({
    request,
  }) => {
    //Arrange
    const productService = new ProductService(request, token);

    //Act
    const response = await productService.createProduct(createProductPayload);

    //Assert
    expect(response.name).toEqual(createProductPayload.name);
    expect(response.description).toEqual(createProductPayload.description);
    expect(response.price).toEqual(createProductPayload.price);
  });

  test("Partially update a exsisting product", async ({ request }) => {
    //Arrange
    const productService = new ProductService(request, token);

    //Act
    const response = await productService.patchProduct(
      productId,
      partialUpdateProductPayload,
    );

    //Assert
    expect(response.success).toEqual(true);
    expect(response.success).toBeTruthy();
  });

  test.skip("Delete an exsisting product", async ({ request }) => {
    //Arange
    const productService = new ProductService(request, token);

    //Act
    const response = await productService.deleteProduct(productId);

    //Assert
    expect(response.success).toEqual(true);
    expect(response.success).toBeTruthy();
  });
});
