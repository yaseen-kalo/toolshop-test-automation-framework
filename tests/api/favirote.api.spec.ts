import { test, expect } from "@playwright/test";
import { getFavoritePayload } from "@data/favorite.data";
import { AuthService } from "@services/auth.service";
import { FavoriteService } from "@services/favirote.service";

test.describe("Favorite --- API tests", () => {
  test.describe.configure({ mode: "serial" });
  let favoriteService;
  let token: string;
  let userId: string;
  let favoriteId: string;
  //hardcode it for now. will get with product api call in e2e test.
  const productId = "01KXB2TWFQ2XGY0R3KNZ0N3QY0";
  test.beforeAll(
    "Login as Customer account and reterive the token for other api calls",
    async ({ request }) => {
      //Arrange
      const authService = new AuthService(request);

      //Act
      const response = await authService.login({
        email: `${process.env.CUSTOMER_EMAIL}`,
        password: `${process.env.CUSTOMER_PASSWORD}`,
      });

      //Assign
      token = response.access_token;

      const authServiceForCurrentUser = new AuthService(request, token);
      const userResponse = await authServiceForCurrentUser.getCurrentUserInfo();
      userId = userResponse.id;
    },
  );
  test("Get Favorite List", async ({ request }) => {
    //Arrange
    favoriteService = new FavoriteService(request, token);

    //Act
    const response = await favoriteService.getFavorites();

    // Assert
    expect(response).toBeInstanceOf(Array);
    expect(response.length).toBeGreaterThan(0);

    for (const favorite of response) {
      expect(favorite).toHaveProperty("id");
      expect(favorite).toHaveProperty("user_id");
      expect(favorite).toHaveProperty("product_id");

      expect(favorite).toHaveProperty("product");
      expect(favorite.product).toHaveProperty("id");
      expect(favorite.product).toHaveProperty("name");
      expect(favorite.product).toHaveProperty("description");
      expect(favorite.product).toHaveProperty("price");
      expect(favorite.product).toHaveProperty("in_stock");

      expect(favorite.product).toHaveProperty("product_image");
      expect(favorite.product.product_image).toHaveProperty("id");
      expect(favorite.product.product_image).toHaveProperty("file_name");
      expect(favorite.product.product_image).toHaveProperty("title");
    }
  });

  test("Create a Favorite list with product", async ({ request }) => {
    //Arrange
    favoriteService = new FavoriteService(request, token);
    const payload = getFavoritePayload(productId);

    //Act
    const response = await favoriteService.createFavorite(payload);

    favoriteId = response.id;
    //Assert
    expect(response.product_id).toEqual(productId);
    expect(response.id).not.toBeNull();
    expect(response.user_id).toEqual(userId);
  });

  test("get Favorite by Id", async ({ request }) => {
    //Arrange
    favoriteService = new FavoriteService(request, token);

    //Act
    const response = await favoriteService.getFavoriteById(favoriteId);

    //Assert
    expect(response.id).toEqual(favoriteId);
    expect(response.product_id).toEqual(productId);
    expect(response.user_id).toEqual(userId);
  });

  test("delete Favorite List", async ({ request }) => {
    //Arrange
    favoriteService = new FavoriteService(request, token);

    //Act
    const response = await favoriteService.deleteFavorite(favoriteId);

    console.log("Favorite List is successfully deleted..");
  });
});
