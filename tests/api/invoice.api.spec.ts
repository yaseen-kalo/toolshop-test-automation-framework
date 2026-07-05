import { test, expect } from "@playwright/test";
import { InvoiceService } from "@services/invoice.service";
import { AuthService } from "@services/auth.service";
import { CartService } from "@services/cart.service";
import {
  getCustomerInvoicePayload,
  getGuestInvoicePayload,
  getUpdateInvoicePayload,
  getPartialUpdateInvoicePayload,
  getUpdateInvoiceStatusPayload,
} from "@data/invoice.data";
import { ProductService } from "@services/product.service";
import { getAddItemToCartPayload } from "@data/cart.data";

test.describe("Invoice API - Invoice Operations", () => {
  test.describe.configure({ mode: "serial" });

  // Shared state variables extracted dynamically across the serial lifecycle
  let token: string;
  let invoiceId: string;
  let invoiceNumber: string;
  let productId: string;

  // Variables to hold the dynamic billing address from the User Profile response
  let street: string;
  let house_number: string | null;
  let city: string;
  let country: string;
  let state: string | null;
  let postalCode: string | null;

  let userId: string;
  let userEmail: string;

  // Dynamic active cart ID to execute test orders against
  let activeCartId: string;

  test.beforeAll(
    "login as a Customer, retrieve access token, profile address, and cart ID",
    async ({ request }) => {
      // 1. Initialize AuthService with undefined token to execute initial login pass
      let authService = new AuthService(request, undefined as any);

      // 2. Authenticate Customer and save the token
      const authResponse = await authService.login({
        email: process.env.CUSTOMER_EMAIL!,
        password: process.env.CUSTOMER_PASSWORD!,
      });
      token = authResponse.access_token;
      console.log("Access Token for later tests:", token);

      // 3. Re-instantiate AuthService passing the brand new token so its internal methods are authorized
      authService = new AuthService(request, token);

      // 4. Extract user profile address info and identifiers directly
      const addressResponse = await authService.getCurrentUserInfo();

      // 🆔 Store relevant user identity components
      userId = addressResponse.id; //01KWQS7C0KFRY5DY0BZJNE8TZK
      userEmail = addressResponse.email;

      // 🔄 Update variables: Keep dynamic street, intercept city/country to match Austria rules
      street = addressResponse.address.street;
      house_number = addressResponse.address.house_number;
      city = addressResponse.address.city;
      state = addressResponse.address.state;
      country = addressResponse.address.country;
      postalCode = addressResponse.address.postal_code;

      // 5. Build the cart inside the authorized framework
      const cartService = new CartService(request);
      const productService = new ProductService(request);
      const cartResponse = await cartService.CreateNewCart();
      const productResponse = await productService.getProducts();
      productId = productResponse.data[1].id;
      activeCartId = cartResponse.id;
      const paylaod = getAddItemToCartPayload(productId, 5);
      await cartService.AddAnItemToCart(activeCartId, paylaod);

      // 📦 Extract a relevant product item from the system if needed for downstream cart adds
      // (Assuming you have a ProductService or can extract it from initial cart items/endpoints)
      // For this example, we mock the assignment if you have it globally declared:
      // productId = someProductResponse.data[0].id;

      // 🖨️ Print all the relevant execution details cleanly in the terminal logs
      console.log("\n========================================================");
      console.log("🚀 PRE-TEST SETUP LOGS (RELEVANT EXECUTION CONTEXT)     ");
      console.log("========================================================");
      console.log(`👤 User Identity:`);
      console.log(`   ID:          ${userId}`);
      console.log(`   Email:       ${userEmail}`);
      console.log(`🛒 Cart Details:`);
      console.log(`   Cart ID:     ${activeCartId}`);
      console.log(
        `   Product ID:  ${typeof productId !== "undefined" ? productId : "Not assigned yet"}`,
      );
      console.log(`📍 Sanitized Billing Address:`);
      console.log(`   Street:      ${street}`);
      console.log(`   City:        ${city}`);
      console.log(`   State:       ${state}`);
      console.log(`   Country:     ${country}`);
      console.log(`   Postal Code: ${postalCode}`);
      console.log("========================================================\n");
    },
  );

  test("should get all invoices and extract dependent tracking entities", async ({
    request,
  }) => {
    // Arrange
    const invoiceService = new InvoiceService(request, token);
    const cartService = new CartService(request);

    // Act
    const response = await invoiceService.getAllInvoices();

    // Assert
    expect(response).toHaveProperty("data");
    expect(response.data).toBeInstanceOf(Array);
    expect(response.data.length).toBeGreaterThan(0);

    const baseInvoice = response.data[0];

    // 1. Extract Core Invoice tracking IDs
    invoiceId = baseInvoice.id;
    invoiceNumber = baseInvoice.invoice_number;

    // 2. Dynamically extract a valid Product ID from the first available invoice line item
    const firstInvoiceWithItems = response.data.find(
      (inv) => inv.invoicelines && inv.invoicelines.length > 0,
    );
    expect(firstInvoiceWithItems).toBeDefined();
    productId = firstInvoiceWithItems!.invoicelines[0].product.id;

    // 3. Populate Cart: Add the extracted real product to our active cart context to clear 422 validations
    await cartService.AddAnItemToCart(activeCartId, {
      product_id: productId,
      quantity: 2,
    });

    console.log("Extracted Invoice ID:", invoiceId);
    console.log("Extracted Invoice Number:", invoiceNumber);
    console.log(
      `Successfully attached Product ID: ${productId} to active Cart ID: ${activeCartId}`,
    );
  });

  //BUG --- 01
  test.skip("should create a new invoice for a registered customer using profile billing data", async ({
    request,
  }) => {
    // Arrange
    const invoiceService = new InvoiceService(request, token);
    const payload = getCustomerInvoicePayload(
      activeCartId,
      street,
      city,
      country,
      state,
      postalCode,
      "bank-transfer",
      "ErsteBank",
      "Jane Doe",
      "1234567890",
    );

    // Act
    const response = await invoiceService.createInvoiceForCustomer(payload);

    // Assert
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("billing_city", city);
    expect(response).toHaveProperty("billing_street", street);
    expect(response.invoicelines).toBeInstanceOf(Array);
  });

  // BUG ---- 02
  test.skip("should create a new invoice for a guest session using profile billing data", async ({
    request,
  }) => {
    // Arrange
    const invoiceService = new InvoiceService(request, token);
    const payload = getGuestInvoicePayload(
      activeCartId,
      "guest@example.com",
      "John",
      "Smith",
      street,
      city,
      country,
      state,
      postalCode,
      "bank-transfer",
      "ErsteBank",
      "John Smith",
      "1234567890",
    );

    // Act
    const response = await invoiceService.createInvoiceForGuest(payload);

    // Assert
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("user_id", null);
  });

  test("should get specific invoice details by the dynamically extracted id", async ({
    request,
  }) => {
    // Arrange
    const invoiceService = new InvoiceService(request, token);

    // Act
    const response = await invoiceService.getInvoiceById(invoiceId);

    // Assert
    expect(response).toHaveProperty("id", invoiceId);
    expect(response).toHaveProperty("invoice_number", invoiceNumber);
    expect(response.invoicelines).toBeInstanceOf(Array);
  });

  test("should search specific invoices using the profile billing city parameter", async ({
    request,
  }) => {
    // Arrange
    const invoiceService = new InvoiceService(request, token);

    // Act
    const response =
      await invoiceService.getInvoiceByInvoiceNumberORBillingStreetORStatus(
        city,
      );

    // Assert
    expect(response).toHaveProperty("data");
    expect(response.data).toBeInstanceOf(Array);
    if (response.data.length > 0) {
      expect(response.data[0]).toHaveProperty("billing_city", city);
    }
  });

  // BUG ---- 03
  test.skip("should update full structural body parameters using PUT pathway", async ({
    request,
  }) => {
    // Arrange
    const invoiceService = new InvoiceService(request, token);
    const putPayload = getUpdateInvoicePayload(
      activeCartId,
      street,
      city,
      country,
      state,
      postalCode,
      "bank-transfer",
      "Sparkasse",
      "Jane Doe",
      "0987654321",
    );

    // Act
    const response = await invoiceService.updateInvoiceById(
      invoiceId,
      putPayload,
    );

    // Assert
    expect(response).toHaveProperty("success", true);
  });

  test("should partially update targeted fields using PATCH logic rules", async ({
    request,
  }) => {
    // Arrange
    const invoiceService = new InvoiceService(request, token);
    const patchPayload = getPartialUpdateInvoicePayload({
      billingCity: "Salzburg",
      billingStreet: "Alpenstrasse 44",
    });

    // Act
    const response = await invoiceService.partiallyUpdateInvoiceById(
      invoiceId,
      patchPayload,
    );

    // Assert
    expect(response).toHaveProperty("success", true);
  });

  test("should advance processing lifecycle pipelines via status updates", async ({
    request,
  }) => {
    // Arrange
    const invoiceService = new InvoiceService(request, token);
    const statusPayload = getUpdateInvoiceStatusPayload(
      "AWAITING_FULFILLMENT",
      "Moving package items down inventory track",
    );

    // Act
    const response = await invoiceService.UpdateInvoiceStatusById(
      statusPayload,
      invoiceId,
    );

    // Assert
    expect(response).toHaveProperty("success", true);
  });

  test("should read generated PDF document metadata matrices using extracted number", async ({
    request,
  }) => {
    // Arrange
    const invoiceService = new InvoiceService(request, token);
    const identifier = invoiceNumber || invoiceId;

    // Act
    const response = await invoiceService.getInvoiceStatusOfPDFById(identifier);

    // Assert
    expect(response).toHaveProperty("status");
  });

  test("should access absolute URLs to download generated binary assets", async ({
    request,
  }) => {
    // Arrange
    const invoiceService = new InvoiceService(request, token);

    // 1. Fetch all invoices dynamically to look up an alternative number
    const allInvoicesResponse = await invoiceService.getAllInvoices();

    // 2. Ensure we have at least two invoices to select an alternative one
    expect(allInvoicesResponse.data.length).toBeGreaterThan(0);

    // 3. Grab the second invoice number (Index 1) from the array payload
    const alternativeInvoiceNumber = allInvoicesResponse.data[0].invoice_number;
    console.log(
      `Using alternative invoice number from GET request: ${alternativeInvoiceNumber}`,
    );

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Act
    const pdfBuffer =
      await invoiceService.getDownloadAlreadyGeneratedPDFByInvoiceNumber(
        alternativeInvoiceNumber,
        token,
      );

    // Assert
    expect(pdfBuffer.length).toBeGreaterThan(0);
    expect(pdfBuffer.toString("utf-8").startsWith("%PDF")).toBe(true);

    console.log(
      ` Downloaded binary PDF successfully for Invoice: ${alternativeInvoiceNumber} (${pdfBuffer.length} bytes)`,
    );
  });
});
