import { test, expect } from "@playwright/test";
import { CategoryService } from "@services/category.service";
import {
  getCategoryPayload,
  getPartialCategoryPayload,
} from "@data/category.data";
import { AuthService } from "@services/auth.service";
import { faker } from "@faker-js/faker";

test.describe("Category API - Category", () => {
  test.describe.configure({ mode: "serial" });
  let categoryId: string;
  let categoryForDeleteId: string;
  let categoryName: string;
  let token: string;

  test.beforeAll(
    "login as an Admin and retieve the access token",
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

  test("should get all categories with subcategories", async ({ request }) => {
    //Arrange
    const categoryService = new CategoryService(request);

    //Act
    const response = await categoryService.getCategoriesWithSubCategories();

    //assert
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBeGreaterThan(0);
    categoryId = response[0].id; // Store the first category ID for later tests
    categoryName = response[1].name; // Store the first category name for later tests

    categoryForDeleteId = response[response.length - 1].id; // Store the last category ID for deletion test

    for (const category of response) {
      //Validate top-level category properties
      expect(category).toHaveProperty("id");
      expect(category).toHaveProperty("name");
      expect(category).toHaveProperty("slug");
      expect(category).toHaveProperty("parent_id");
      expect(category).toHaveProperty("sub_categories");
      expect(category.sub_categories).toBeInstanceOf(Array);

      for (const subCategory of category.sub_categories) {
        //Validate first-level subcategory properties
        expect(subCategory).toHaveProperty("id");
        expect(subCategory).toHaveProperty("name");
        expect(subCategory).toHaveProperty("slug");
        expect(subCategory).toHaveProperty("parent_id");
        expect(subCategory).toHaveProperty("sub_categories");
        expect(subCategory.sub_categories).toBeInstanceOf(Array);
      }
    }
    console.log("Category ID for later tests:", categoryId); // Log the category ID for debugging
    console.log("Category Name for later tests:", categoryName); // Log the category name for debugging //f5dd956b-71c3-42c9-b8f2-687a2372c3f7
  });

  test("should get all categories without subcategories", async ({
    request,
  }) => {
    //Arrange
    const categoryService = new CategoryService(request);

    //Act
    const response = await categoryService.getCategoriesWithoutSubCategories();

    //Assert
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBeGreaterThan(0);

    for (const category of response) {
      //Validate category properties
      expect(category).toHaveProperty("id");
      expect(category).toHaveProperty("name");
      expect(category).toHaveProperty("slug");
      expect(category).toHaveProperty("parent_id");
    }
  });

  test("should get category with subcategories by id", async ({ request }) => {
    //Arrange
    const categoryService = new CategoryService(request);

    //Act
    const response =
      await categoryService.getCategoriesWithSubCategoriesById(categoryId);

    //Assert
    expect(response).toHaveProperty("id", categoryId);
    expect(response).toHaveProperty("name");
    expect(response).toHaveProperty("slug");
    expect(response).toHaveProperty("parent_id");
    expect(response).toHaveProperty("sub_categories");
    expect(response.sub_categories).toBeInstanceOf(Array);

    for (const subCategory of response.sub_categories) {
      //Validate first-level subcategory properties
      expect(subCategory).toHaveProperty("id");
      expect(subCategory).toHaveProperty("name");
      expect(subCategory).toHaveProperty("slug");
      expect(subCategory).toHaveProperty("parent_id");
      expect(subCategory).toHaveProperty("sub_categories");
      expect(subCategory.sub_categories).toBeInstanceOf(Array);
    }
  });

  test("should get single category with subcategories by name", async ({
    request,
  }) => {
    //Arrange
    const categoryService = new CategoryService(request);

    //Act
    const response =
      await categoryService.getSingleCategoryWithSubCategoryByName(
        categoryName,
      );

    expect(response).toHaveLength(1);

    const category = response[0];

    expect(category).toHaveProperty("id");
    expect(category).toHaveProperty("name", categoryName);
    expect(category).toHaveProperty("slug");
    expect(category).toHaveProperty("parent_id");
    expect(category).toHaveProperty("sub_categories");

    // Validate subcategories exist and structure is correct
    for (const sub of category.sub_categories) {
      expect(sub).toHaveProperty("id");
      expect(sub).toHaveProperty("name");
      expect(sub).toHaveProperty("slug");
      expect(sub).toHaveProperty("parent_id");
      expect(sub).toHaveProperty("sub_categories");
    }
  });

  // Create an existing category skiped due to bug in the API.
  test.skip("Skipped -- should create a new category", async ({ request }) => {
    //Arrange
    const categoryService = new CategoryService(request);
    const postCategoryPayload = getCategoryPayload({
      name: faker.commerce.productName(),
      slug: faker.helpers.slugify(faker.commerce.productName()),
      parent_id: "Spodscvbsrete5345rt",
    });

    //Act
    const response = await categoryService.createCategory(postCategoryPayload);

    //Assert
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("name", postCategoryPayload.name);
    expect(response).toHaveProperty("slug", postCategoryPayload.slug);
    expect(response).toHaveProperty("parent_id", postCategoryPayload.parent_id);
  });

  // PUT an existing category skiped due to bug in the API.
  test.skip("Skipped -- should update an existing category", async ({ request }) => {
    //Arrange
    const categoryService = new CategoryService(request);
    const putCategoryPayload = getCategoryPayload({
      name: faker.commerce.productName(),
      slug: faker.helpers.slugify(faker.commerce.productName()),
      parent_id: "Spodscvbsrete5345rt",
    });

    //Act
    const response = await categoryService.putCategory(
      categoryId,
      putCategoryPayload,
    );

    //Assert
    expect(response).toHaveProperty("success", true);
  });

  test.skip("Skipped -- should partially update an existing category", async ({ request }) => {
    //Arrange
    const categoryService = new CategoryService(request);
    const patchCategoryPayload = getPartialCategoryPayload({
      name: faker.commerce.productName(),
    });

    //Act
    const response = await categoryService.patchCategory(
      categoryId,
      patchCategoryPayload,
    );

    //Assert
    expect(response).toHaveProperty("success", true);
  });

  // Delete an existing category skiped due to bug in the API.
  test.skip("Skipped -- should delete an existing category", async ({ request }) => {
    //Arrange
    const categoryService = new CategoryService(request, token);

    //Act
    await categoryService.deleteCategory(categoryForDeleteId);

    //Assert
    // Verify that the category has been deleted by attempting to fetch it again
    await expect(
      categoryService.getCategoriesWithSubCategoriesById(categoryForDeleteId),
    ).rejects.toThrow(`Get Category By Id failed with status: 404`);
  });
});
