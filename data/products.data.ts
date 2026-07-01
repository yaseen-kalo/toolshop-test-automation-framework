import { ProductRequest, PatchProductRequest } from "@models/products.types";
export const createProductPayload: ProductRequest = {
  name: "Cricket Bat",
  description: "CA Cricket Bat from Pakistan",
  price: 329.99,
  category_id: "01JFG8Q5XKZJY4BEYQ87PC2Q1Y",
  brand_id: "01JFG8Q5XKZJY4BEYQ87PC2Q1Y",
  product_image_id: "01JFG8Q5XKZJY4BEYQ87PC2Q1Y",
  is_location_offer: 1,
  is_rental: 0,
  co2_rating: "A",
};

export const partialUpdateProductPayload: PatchProductRequest = {
  name: "Name has been updated",
  description: "Description has been updated",
};
