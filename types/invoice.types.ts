// ===================================================================================================================
// 1. GLOBAL TYPE ALIASES
// ===================================================================================================================
export type InvoiceStatus =
  | "COMPLETED"
  | "ON_HOLD"
  | "AWAITING_FULFILLMENT"
  | string;
export type PdfGenerationStatus = "INITIATED" | "IN_PROGRESS" | "COMPLETED";
export type Co2Rating = "A" | "B" | "C" | "D" | "E" | string;

// ===================================================================================================================
// 2. REQUEST DATA TRANSFER OBJECTS (DTOs)
// ===================================================================================================================
export interface PaymentDetails {
  bank_name: string;
  account_name: string;
  account_number: string;
}

export interface BaseInvoiceRequest {
  billing_street: string;
  billing_city: string;
  billing_state: string;
  billing_country: string;
  billing_postal_code: string;
  payment_method: string;
  cart_id: string;
  payment_details: PaymentDetails;
}

export interface CustomerInvoiceRequest extends BaseInvoiceRequest {}

export interface GuestInvoiceRequest extends BaseInvoiceRequest {
  guest_email: string;
  guest_first_name: string;
  guest_last_name: string;
}

export interface UpdateInvoiceByIdRequest extends BaseInvoiceRequest {}
export interface PartiallyUpdateInvoiceByIdRequest extends override Partial<BaseInvoiceRequest> {}

export interface UpdateInvoiceStatusRequest {
  status: InvoiceStatus;
  status_message: string;
}

// ===================================================================================================================
// 3. COMMON INTERFACES & SUB-MODELS
// ===================================================================================================================
export interface CompleteProductImage {
  id: string;
  by_name: string;
  by_url: string;
  source_name: string;
  source_url: string;
  file_name: string;
  title: string;
}

export interface SimplifiedProductImage {
  id: string;
  by_name: string;
  by_url: string;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface ProductBrand {
  id: string;
  name: string;
}

export interface InvoicePaymentSummary {
  payment_method: string;
  payment_details?: PaymentDetails; // Extends dynamically based on invoice status/payload availability
}

// ===================================================================================================================
// 4. DOMAIN DATA MODELS (MAPPED TO FLOW PAYLOADS)
// ===================================================================================================================

// ---- Flow: Get All Invoices & Search Invoices ----
export interface Product {
  id: string;
  name: string;
  price: number;
  co2_rating: Co2Rating;
  in_stock: number | null; // Audited & fixed: verified it returns numeric/null configurations, not boolean
  is_eco_friendly: boolean;
  product_image: CompleteProductImage;
}

export interface InvoiceLine {
  id: string;
  invoice_id: string;
  product_id: string;
  unit_price: number;
  quantity: number;
  discount_percentage: number | null;
  discounted_price: number | null;
  product: Product;
}

export interface Invoice {
  id: string;
  user_id: string | null; // Can be null if checked out via Guest pathway
  invoice_number: string;
  invoice_date: string;
  status: InvoiceStatus;
  total: number | null;
  subtotal: number | null;
  billing_street: string;
  billing_city: string;
  billing_state: string | null;
  billing_country: string;
  billing_postal_code: string | null;
  additional_discount_percentage: number | null;
  additional_discount_amount: number | null;
  invoicelines: InvoiceLine[];
  payment: InvoicePaymentSummary | null; // Confirmed nullable on fresh/unpaid items
}

// ---- Flow: Get Invoice By ID ----
export interface DetailedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  co2_rating: Co2Rating;
  is_rental: boolean;
  in_stock: number | null;
  is_eco_friendly: boolean;
  product_image: SimplifiedProductImage; // Verified variant image payload structure
  category: ProductCategory;
  brand: ProductBrand;
}

export interface DetailedInvoiceLine {
  id: string;
  invoice_id: string;
  product_id: string;
  unit_price: number;
  quantity: number;
  discount_percentage: number | null;
  discounted_price: number | null;
  product: DetailedProduct;
}

// ---- Flow: Create Invoice Components (Customer Checkouts) ----
export interface CreateInvoiceProductBrand {
  id: string;
  name: string;
  slug: string;
}

export interface CreateInvoiceProductCategory {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  sub_categories: string[];
}

export interface CreateInvoiceProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  is_location_offer: number;
  is_rental: number;
  in_stock: number;
  co2_rating: Co2Rating;
  is_eco_friendly: boolean;
  brand: CreateInvoiceProductBrand;
  category: CreateInvoiceProductCategory;
  product_image: CompleteProductImage;
}

export interface CreateInvoiceLine {
  id: string;
  invoice_id: string;
  product_id: string;
  unit_price: number;
  discount_percentage: number;
  discounted_price: number;
  quantity: number;
  product: CreateInvoiceProduct;
}

// ===================================================================================================================
// 5. ENDPOINT RESPONSE WRAPPERS
// ===================================================================================================================
export interface GetInvoicesResponse {
  current_page: number;
  data: Invoice[];
}

export interface SearchInvoicesResponse {
  current_page: number;
  data: Invoice[]; // Perfectly shared structural format with core list view
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface GetInvoiceByIdResponse {
  id: string;
  invoice_date: string;
  additional_discount_percentage: number | null;
  additional_discount_amount: number | null;
  eco_discount_percentage: number | null;
  eco_discount_amount: number | null;
  invoice_number: string;
  billing_street: string;
  billing_city: string;
  billing_state: string | null;
  billing_country: string;
  billing_postal_code: string | null;
  subtotal: number | null;
  total: number;
  status: InvoiceStatus;
  status_message: string | null;
  created_at: string;
  user_id: string | null;
  invoicelines: DetailedInvoiceLine[];
  payment: InvoicePaymentSummary | null;
}

export interface DownloadInvoicePdfResponse {
  download_url: string;
}

export interface GetInvoicePdfStatusResponse {
  status: PdfGenerationStatus;
}

export interface CreateCustomerInvoiceResponse {
  id: string;
  user_id: string;
  invoice_date: string;
  invoice_number: string;
  billing_street: string;
  billing_city: string;
  billing_country: string;
  billing_state: string | null;
  billing_postal_code: string | null;
  additional_discount_percentage: number | null;
  additional_discount_amount: number;
  subtotal: number;
  total: number;
  status: InvoiceStatus;
  status_message: string | null;
  invoicelines: CreateInvoiceLine[];
  created_at: string;
}

export interface CreateGuestInvoiceResponse {
  id: string;
  user_id: null;
  invoice_date: string;
  invoice_number: string;
  billing_street: string;
  billing_city: string;
  billing_country: string;
  billing_state?: string | null;
  billing_postal_code?: string | null;
  subtotal: number;
  total: number;
  additional_discount_percentage: number | null;
  additional_discount_amount: number;
  eco_discount_percentage: number;
  eco_discount_amount: number;
  created_at: string;
}

export interface UpdateInvoiceResponse {
  success: boolean;
}

export interface UpdateInvoiceStatusResponse extends UpdateInvoiceResponse {}
export interface PartiallyUpdateInvoiceStatusResponse extends UpdateInvoiceResponse {}
