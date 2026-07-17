import { faker } from "@faker-js/faker";
import { AddORUpdateSpecToAProductRequest } from "@models/product-spec.types";
export const getAddORUpdateSpecToAProductPayload =
  (): AddORUpdateSpecToAProductRequest => ({
    spec_name: faker.commerce.productName(),
    spec_value: faker.number.int({ min: 1, max: 100 }).toString(),
    spec_unit: "Kg",
  });
