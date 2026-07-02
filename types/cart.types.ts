// ------------ Request Interfaces -----------------------------------------------------------------

// POST & PUT -- Request interface for adding a item to the cart
export interface AddItemToCartByIdRequest {
  product_id: string;
  quantity: number;
}

// ----------- Common Interface ---------------------------------------------------------------------

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  is_location_offer: boolean;
  is_rental: boolean;
  co2_rating: string;
  in_stock: boolean;
  is_eco_friendly: boolean;
}

export interface CartItem {
  id: string;
  quantity: number;
  discount_percentage: any;
  cart_id: string;
  product_id: string;
  product: Product;
}

// ------------ Response Interfaces -----------------------------------------------------------------

// GET -- Response interface for getting the specific cart by ID
export interface CartByIdResponse {
  id: string;
  additional_discount_percentage: any;
  lat: any;
  lng: any;
  cart_items: CartItem[];
}

// POST -- Response interface for create a new cart
export interface CreateNewCartResponse {
  id: string;
}

// POST -- Response interface for adding a item to the cart
export interface AddItemToCartByIdResponse {
  result: string;
}

//PUT -- Response interface for update the quantity of item in cart
export interface UpdateTheQuantityOfItemInCart {
  success: boolean;
}
