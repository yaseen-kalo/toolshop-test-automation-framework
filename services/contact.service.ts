import { APIRequestContext } from "@playwright/test";
import {
  SendContactMessageRequest,
  AttachFileToContactMessageRequest,
  SendNewContactReplyMessageRequest,
  SetNewMessageStatusRequest,
  GetMessagesResponse,
  GetMessageByIdResponse,
  SendContactMessageResponse,
  SendNewContactReplyMessageResponse,
  ContactMutation,
} from "@models/contact.types";

export class ContactService {
  private request: APIRequestContext;
  private token?: string;

  constructor(request: APIRequestContext, token?: string) {
    ((this.request = request), (this.token = token));
  }

  async getContactMessages(): Promise<GetMessagesResponse> {
    if (!this.token) {
      throw new Error(
        `Admin Or Customer token is required to get the contact messages`,
      );
    }
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/messages`,
      {
        headers: this.getHeaders(true),
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Get Contact messages failed with status: ${response.status()}`,
      );
    }
    return response.json() as Promise<GetMessagesResponse>;
  }

  async getContactMessageById(
    messageId: string,
  ): Promise<GetMessageByIdResponse> {
    if (!this.token) {
      throw new Error(
        `Admin Or Customer token is required to get the contact message by id`,
      );
    }
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/messages/${messageId}`,
      {
        headers: this.getHeaders(true),
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Get Contact message by id failed with status: ${response.status()}`,
      );
    }
    return response.json() as Promise<GetMessageByIdResponse>;
  }

  async SendNewContactMessage(
    payload: SendContactMessageRequest,
  ): Promise<SendContactMessageResponse> {
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/messages`,
      {
        headers: this.getHeaders(false),
        data: payload,
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Send new Contact message failed with status: ${response.status()}`,
      );
    }
    return response.json() as Promise<SendContactMessageResponse>;
  }

  async AttachFileToContactMessage(
    messageId: string,
    payload: AttachFileToContactMessageRequest,
  ): Promise<ContactMutation> {
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/messages/${messageId}/attach-file`,
      {
        headers: {
            Accept: 'application/json'
        },
        multipart: payload,
      },
    );

    const body = await response.text();
    console.log("Status:", response.status());
    console.log("Body:", body);

    if (!response.ok()) {
      throw new Error(
        `Attach a file to the message failed with status: ${response.status()}`,
      );
    }
    return response.json() as Promise<ContactMutation>;
  }

  async SendNewContactMessageAsReply(
    messageId: string,
    payload: SendNewContactReplyMessageRequest,
  ): Promise<SendNewContactReplyMessageResponse> {
    if (!this.token) {
      throw new Error(
        `Customer token is required to send a reply of a message`,
      );
    }
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/messages/${messageId}/reply`,
      {
        headers: this.getHeaders(true),
        data: payload,
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Send new Contact message failed with status: ${response.status()}`,
      );
    }
    return response.json() as Promise<SendNewContactReplyMessageResponse>;
  }

  async UpdateTheMessageStatus(
    messageId: string,
    payload: SetNewMessageStatusRequest,
  ): Promise<ContactMutation> {
    if (!this.token) {
      throw new Error(`Admin token is required to send a reply of a message`);
    }
    const response = await this.request.put(
      `${process.env.API_BASE_URL}/messages/${messageId}/status`,
      {
        headers: this.getHeaders(true),
        data: payload,
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Update the message status failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<ContactMutation>;
  }

  private getHeaders(includeAuth: boolean = false) {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(includeAuth && { Authorization: `Bearer ${this.token}` }),
    };
  }
}
