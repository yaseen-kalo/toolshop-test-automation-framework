import { test, expect } from "@playwright/test";
import { BrandService } from "@services/brand.service";
import { AuthService } from "@services/auth.service";
import { getBrandPayload, getPartialBrandPayload } from "@data/brand.data";

test.describe("Brand API Tests", () => {
  test.describe.configure({ mode: "serial" });
  let token: string;
  let brandId: string;
  let brandName: string;
  let brandForDeleteId: string;

  test.beforeAll(
    "login as an Admin and retrieve the access token",
    async ({ request }) => {
      //Arrange
      const authService = new AuthService(request);

      //Act
      const response = await authService.login({
        email: process.env.ADMIN_EMAIL!,
        password: process.env.ADMIN_PASSWORD!,
      });

      token = response.access_token;
      console.log("Access Token for later tests:", token); // Log the access token for debugging
    },
  );

  // Test case to get all brands
  test("should get all brands", async ({ request }) => {
    //Arrange
    const brandService = new BrandService(request);

    //Act
    const response = await brandService.getBrands();

    brandId = response[0].id; // Store the first brand ID for later tests
    brandName = response[1].name; // Store the first brand name for later tests

    //Assert
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBeGreaterThan(0);

    for (const brand of response) {
      expect(brand).toHaveProperty("id");
      expect(brand).toHaveProperty("name");
      expect(brand).toHaveProperty("slug");
    }
  });

  //Test case to get a brand by ID
  test("should get a brand by ID", async ({ request }) => {
    //Arrange
    const brandService = new BrandService(request);

    //Act
    const response = await brandService.getBrandById(brandId);

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty("id", brandId);
    expect(response).toHaveProperty("name");
    expect(response).toHaveProperty("slug");
  });

  //Test case to get a brand by name
  test("should get a brand by name", async ({ request }) => {
    //Arrange
    const brandService = new BrandService(request);

    //Act
    const response = await brandService.getBrandByName(brandName);

    //Assert
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBeGreaterThan(0);

    for (const brand of response) {
      expect(brand).toHaveProperty("id");
      expect(brand).toHaveProperty("name", brandName);
      expect(brand).toHaveProperty("slug");
    }
  });

  //Test case to create a new brand
  test("should create a new brand", async ({ request }) => {
    //Arrange
    const brandService = new BrandService(request, token);
    const payload = getBrandPayload();

    //Act
    const response = await brandService.createBrand(payload);

    brandForDeleteId = response.id; // Store the created brand ID for later deletion test

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("name", payload.name);
    expect(response).toHaveProperty("slug", payload.slug);
  });

  //Test case to update a brand using PUT
  test("should update a brand using PUT", async ({ request }) => {
    //Arrange
    const brandService = new BrandService(request, token);
    const payload = getBrandPayload();

    //Act
    const response = await brandService.putBrand(brandId, payload);

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty("success", true);
  });

  //Test case to update a brand using PATCH
  test("should update a brand using PATCH", async ({ request }) => {
    //Arrange
    const brandService = new BrandService(request, token);
    const payload = getPartialBrandPayload({ name: "Updated Brand Name" });

    //Act
    const response = await brandService.patchBrand(brandId, payload);

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty("success", true);
  });

  //Test case to delete a brand
  test("should delete a brand", async ({ request }) => {
    //Arrange
    const brandService = new BrandService(request, token);

    //Act
    const response = await brandService.deleteBrand(brandForDeleteId);

    //Assert
    expect(response).toBeUndefined();
  });
});
