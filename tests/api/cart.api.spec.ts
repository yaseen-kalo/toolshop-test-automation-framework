import { CartService } from "@services/cart.service";
import { AuthService } from "@services/auth.service";
import { getAddItemToCartPayload } from "@data/cart.data";
import { test, expect } from "@playwright/test";
import { request } from "node:http";
import { ProductService } from "@services/product.service";
import { id_ID } from "@faker-js/faker";

test.describe("Cart API Test", () => {
  let token: string;
  let cartId: string;
  let productId: string;
  test.describe.configure({ mode: "serial" });

  test.beforeAll(
    "login as an Admin and reterive the access token",
    async ({ request }) => {
      //Arrnage
      const authService = new AuthService(request);

      //Act
      const response = await authService.login({
        email: process.env.ADMIN_EMAIL!,
        password: process.env.ADMIN_PASSWORD!,
      });

      token = response.access_token;

      const productService = new ProductService(request);
      const responseProduct = await productService.getProducts();
      productId = responseProduct.data[0].id;
      console.log(productId);
    },
  );

  // POST - Create a new Cart
  test("Create a new Cart", async ({ request }) => {
    //Arrange
    const cartService = new CartService(request);

    //Act
    const response = await cartService.CreateNewCart();
    cartId = response.id;
    console.log("POST CART" + cartId);

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty("id");
  });

  // POST - Add item to the cart
  test("Add item to the cart", async ({ request }) => {
    //Arrange
    const cartService = new CartService(request);
    const payload = getAddItemToCartPayload(productId, 4);
    console.log("POST ITEM TO CART" + cartId);
    //Act
    const response = await cartService.AddAnItemToCart(cartId, payload);

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty("result", "item added or updated");
  });

  //PUT - Update quantity of item in cart
  test("Update the quantity of item in cart", async ({ request }) => {
    //Arrange
    const cartService = new CartService(request);
    const payload = getAddItemToCartPayload(productId, 7);
    console.log("PUT CART" + cartId);

    //Act
    const response = await cartService.UpdatetheQuantityInTheCart(
      cartId,
      payload,
    );

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty("result", "item added or updated");
  });

  //Get -- Retrieve specific cart
  test("Get the Specific Cart details", async ({ request }) => {
    //Arrange
    const cartService = new CartService(request);
    console.log("GET CART" + cartId);

    //Act
    const response = await cartService.GetItemFromCartById(cartId);

    // Assert
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty("id", cartId);
    expect(response.cart_items).toBeInstanceOf(Array);
    expect(response.cart_items.length).toBeGreaterThan(0);
    expect(response.cart_items[0]).toHaveProperty("product");
  });

  // DELETE - delete the product from the cart
  test("Delete the product from the cart", async ({ request }) => {
    //Arrange
    const cartService = new CartService(request);

    //Act
    const response = await cartService.DeleteProductFromCart(cartId, productId);

    //Assert
    expect(response).toBeUndefined();
  });

  //DELETE - delete the cart
  test("Delete the Cart", async ({ request }) => {
    //Arrange
    const cartService = new CartService(request);

    //Act
    const response = await cartService.DeleteCart(cartId);

    //Assert
    expect(response).toBeUndefined();
  });
});
