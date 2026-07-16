import { AuthService } from "@services/auth.service";
import { ContactService } from "@services/contact.service";
import {
  getSendNewContactMessagePayload,
  getAttachFileContactMessagePayyload,
  getUpdateMessageStatusPayload,
} from "@data/contact.data";
import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { request } from "http";

test.describe("Contact --- API Tests", () => {
  test.describe.configure({ mode: "serial" });

  let authService;
  let contactService;
  let adminToken: string;
  let customerToken: string;
  let messageId: string;
  let replyToEmail: string;

  test.beforeAll(
    "Login as a Customer & Admin account to reterive the token",
    async ({ request }) => {
      //Arrange
      authService = new AuthService(request);

      //Act --- Admin
      const adminResponse = await authService.login({
        email: `${process.env.ADMIN_EMAIL}`,
        password: `${process.env.ADMIN_PASSWORD}`,
      });

      adminToken = adminResponse.access_token;

      //Act --- Customer
      const customerResponse = await authService.login({
        email: `${process.env.CUSTOMER_EMAIL}`,
        password: `${process.env.CUSTOMER_PASSWORD}`,
      });

      customerToken = customerResponse.access_token;
    },
  );

  test("Get all messages as an Admin", async ({ request }) => {
    //Arrange
    contactService = new ContactService(request, adminToken);

    //Act
    const response = await contactService.getContactMessages();

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response.current_page).toBeGreaterThan(0);
    expect(response.data).toBeInstanceOf(Array);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.total).toBeGreaterThan(0);

    for (const message of response.data) {
      expect(message).toHaveProperty("id");
      expect(message).toHaveProperty("name");
      expect(message).toHaveProperty("email");
      expect(message).toHaveProperty("subject");
      expect(message).toHaveProperty("message");
      expect(message).toHaveProperty("status");
      expect(["NEW", "IN_PROGRESS", "RESOLVED"]).toContain(message.status);
      expect(message).toHaveProperty("created_at");
    }
  });

  test("Send new Contact message as a Customer", async ({ request }) => {
    //Arrange
    contactService = new ContactService(request);
    const toEmail = faker.internet.email();
    const payload = getSendNewContactMessagePayload(toEmail);
    //Act -- Customer
    const response = await contactService.SendNewContactMessage(payload);
    messageId = response.id;
    replyToEmail = response.email;

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty("name");
    expect(response).toHaveProperty("email", toEmail);
    expect(response).toHaveProperty("subject");
    expect(response).toHaveProperty("message");
    expect(["NEW", "IN_PROGRESS", "RESOLVED"]).toContain(response.status);
    expect(response.id).not.toBeNull();
    expect(response.created_at).not.toBeNull();
  });

  test("Get a specific message By Id as an Admin", async ({ request }) => {
    //Arrange
    contactService = new ContactService(request, adminToken);

    //Act -- Admin
    const response = await contactService.getContactMessageById(messageId);

    //Assert
    expect(response).toHaveProperty("id", messageId);
    expect(response).toHaveProperty("user_id");
    expect(response).toHaveProperty("email");
    expect(response).toHaveProperty("subject");
    expect(response).toHaveProperty("message");
    expect(response).toHaveProperty("status");
    expect(response).toHaveProperty("created_at");
    expect(response.replies).toBeInstanceOf(Array);
  });

  test("Attach file to the message", async ({ request }) => {
    //Arrange
    contactService = new ContactService(request);
    const payload = getAttachFileContactMessagePayyload();

    //Act
    const response = await contactService.AttachFileToContactMessage(
      messageId,
      payload,
    );

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty("success", true);
  });

  test("Send new message as a reply", async ({ request }) => {
    //Arrange
    contactService = new ContactService(request, customerToken);
    const payload = getSendNewContactMessagePayload(replyToEmail);

    //Act
    const response = await contactService.SendNewContactMessageAsReply(
      messageId,
      payload,
    );

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty("message");
    expect(response.message).not.toBeNull();
    expect(response).toHaveProperty("id");
    expect(response.id).not.toBeNull();
    expect(response).toHaveProperty("created_at");
    expect(response.created_at).not.toBeNull();
  });

  test("Update the new message status", async ({ request }) => {
    //Arrange
    contactService = new ContactService(request, adminToken);
    const payload = getUpdateMessageStatusPayload("IN_PROGRESS");

    //Act
    const response = await contactService.UpdateTheMessageStatus(
      messageId,
      payload,
    );

    //Assert
    expect(response).toBeInstanceOf(Object);
    expect(response).toHaveProperty("success", true);
  });
});
