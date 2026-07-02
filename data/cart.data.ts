import { AddItemToCartByIdRequest } from "@models/cart.types";

export const getAddItemToCartPayload = (
  productId: string,
  quantity: number,
) => {
  return {
    product_id: productId,
    quantity: quantity,
  } as AddItemToCartByIdRequest;
};
 