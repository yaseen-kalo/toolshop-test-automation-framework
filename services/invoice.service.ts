import { APIRequestContext } from "@playwright/test";
import {
  CustomerInvoiceRequest,
  GuestInvoiceRequest,
  UpdateInvoiceByIdRequest,
  PartiallyUpdateInvoiceByIdRequest,
  UpdateInvoiceStatusRequest,
  GetInvoicesResponse,
  GetInvoiceByIdResponse,
  DownloadInvoicePdfResponse,
  GetInvoicePdfStatusResponse,
  SearchInvoicesResponse,
  UpdateInvoiceStatusResponse,
  CreateCustomerInvoiceResponse,
  CreateGuestInvoiceResponse,
  UpdateInvoiceResponse,
  PartiallyUpdateInvoiceStatusResponse,
} from "@models/invoice.types";

export class InvoiceService {
  private request: APIRequestContext;
  private token?: string;

  constructor(request: APIRequestContext, token?: string) {
    this.request = request;
    this.token = token;
  }

  //-- get all invoices
  async getAllInvoices(): Promise<GetInvoicesResponse> {
    if (!this.token) {
      throw new Error(`Admin token is required to get Invoices`);
    }
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/invoices`,
      {
        headers: this.getHeaders(true),
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Get all invoices failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<GetInvoicesResponse>;
  }

  // -- get specific invoice by Id
  async getInvoiceById(invoiceId: string): Promise<GetInvoiceByIdResponse> {
    if (!this.token) {
      throw new Error(`Admin token is required to get specific Invoice by Id`);
    }
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/invoices/${invoiceId}`,
      {
        headers: this.getHeaders(true),
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Get specific invoice ${invoiceId} failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<GetInvoiceByIdResponse>;
  }

  // get Download already generated PDF of a specific invoice
  async getDownloadAlreadyGeneratedPDFByInvoiceNumber(
    invoiceNumber: string,
    token: string,
  ): Promise<Buffer> {
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/invoices/${invoiceNumber}/download-pdf`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf", // Expect binary PDF stream
        },
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Downloading PDF failed with status: ${response.status()}`,
      );
    }

    // ✅ FIX: Use .body() instead of .json() to read binary data streams
    return response.body();
  }

  // get the status of the PDF
  async getInvoiceStatusOfPDFById(
    invoiceNumber: string,
  ): Promise<GetInvoicePdfStatusResponse> {
    if (!this.token) {
      throw new Error(
        `Admin token is required to get the invoice status of PDF`,
      );
    }
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/invoices/${invoiceNumber}/download-pdf-status`,
      {
        headers: this.getHeaders(true),
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Get the Invoice PDF status failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<GetInvoicePdfStatusResponse>;
  }

  // get specific invoice matching search query --- get specific invoices by billing_street OR invoice_number OR status starts
  async getInvoiceByInvoiceNumberORBillingStreetORStatus(
    query: string,
  ): Promise<SearchInvoicesResponse> {
    if (!this.token) {
      throw new Error(
        `Admin token is required to get the invoice status of PDF`,
      );
    }

    const response = await this.request.get(
      `${process.env.API_BASE_URL}/invoices/search`,
      {
        headers: this.getHeaders(true),
        params: { q: query },
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Get invoice search failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<SearchInvoicesResponse>;
  }

  //Create new Invoice for registered/login member
  async createInvoiceForCustomer(
    payload: CustomerInvoiceRequest,
  ): Promise<CreateCustomerInvoiceResponse> {
    if (!this.token) {
      throw new Error(
        `Admin token is required to create a invoice for Customer`,
      );
    }

    const response = await this.request.post(
      `${process.env.API_BASE_URL}/invoices`,
      {
        headers: this.getHeaders(true),
        data: payload,
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Create a new invoice for Customer failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<CreateCustomerInvoiceResponse>;
  }

  //Create new invoice for Geust

  async createInvoiceForGuest(
    payload: GuestInvoiceRequest,
  ): Promise<CreateGuestInvoiceResponse> {
    if (!this.token) {
      throw new Error(
        `Admin token is required to create a invoice for Customer`,
      );
    }

    const response = await this.request.post(
      `${process.env.API_BASE_URL}/invoices/guest`,
      {
        headers: this.getHeaders(true),
        data: payload,
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Create new Guest Invoice failed with status: ${response.status()}`,
      );
    }
    return response.json() as Promise<CreateGuestInvoiceResponse>;
  }

  // Update full invoice By Id
  async updateInvoiceById(
    invoiceId: string,
    payload: UpdateInvoiceByIdRequest,
  ): Promise<UpdateInvoiceResponse> {
    if (!this.token) {
      throw new Error(`Admin token is required to update the invoice`);
    }

    const response = await this.request.put(
      `${process.env.API_BASE_URL}/invoices/${invoiceId}`,
      {
        headers: this.getHeaders(true),
        data: payload,
      },
    );

    if (!response.ok()) {
      throw new Error(`Update the invoice failed with ${response.status()}`);
    }

    return response.json() as Promise<UpdateInvoiceResponse>;
  }

  // Update invoice status By Id
  async UpdateInvoiceStatusById(
    payload: UpdateInvoiceStatusRequest,
    invoiceId: string,
  ): Promise<UpdateInvoiceStatusResponse> {
    if (!this.token) {
      throw new Error(`Admin token is required to update the invoice status`);
    }

    const response = await this.request.put(
      `${process.env.API_BASE_URL}/invoices/${invoiceId}/status`,
      {
        headers: this.getHeaders(true),
        data: payload,
      },
    );

    if (!response.ok()) {
      throw new Error(
        `Invoice Status update failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<UpdateInvoiceStatusResponse>;
  }

  // Partially update the invoice by ID
  async partiallyUpdateInvoiceById(
    invoiceId: string,
    payload: PartiallyUpdateInvoiceByIdRequest,
  ): Promise<PartiallyUpdateInvoiceStatusResponse> {
    if (!this.token) {
      throw new Error(
        `Admin token is required to upddate the invoice partially`,
      );
    }

    const response = await this.request.patch(
      `${process.env.API_BASE_URL}/invoices/${invoiceId}`,
      {
        headers: this.getHeaders(true),
        data: payload,
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Update the invoice partially failed with status: ${response.status()}`,
      );
    }

    return response.json() as Promise<PartiallyUpdateInvoiceStatusResponse>;
  }

  private getHeaders(includeAuth: boolean = false) {
    return {
      "Content-type": "application/json",
      Accept: "application/json",
      ...(includeAuth && { Authorization: `Bearer ${this.token}` }),
    };
  }
}
