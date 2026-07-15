// ------- Favirote Request ----------------------------------------------------------------------------

export interface FavoriteRequest {
  product_id: string;
}

// ----------------- Common Interfaces -----------------

export interface ProductImage {
  id: string;
  by_name: string;
  by_url: string;
  source_name: string;
  source_url: string;
  file_name: string;
  title: string;
}

export interface FavoriteProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  is_location_offer: boolean;
  is_rental: boolean;
  co2_rating: string;
  in_stock: boolean;
  is_eco_friendly: boolean;
  product_image: ProductImage;
}

// ----------------- Response Interfaces -----------------

// GET /favorites
export interface FavoriteResponse {
  id: string;
  user_id: string;
  product_id: string;
  product: FavoriteProduct;
}

export type GetFavoritesResponse = FavoriteResponse[];

// GET /favorites/:id
export interface GetFavoriteByIdResponse {
  id: string;
  user_id: string;
  product_id: string;
}

// POST /favorites
export interface CreateFavoriteResponse {
  id: string;
  user_id: string;
  product_id: string;
}
