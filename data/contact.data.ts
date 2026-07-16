import fs from "fs";
import { faker } from "@faker-js/faker";
import { MessageStatus, SetNewMessageStatusRequest } from "@models/contact.types";

// send message and send reply
export const getSendNewContactMessagePayload = (email: string) => ({
  name: faker.person.fullName(),
  email: email,
  subject: faker.lorem.words(3),
  message: faker.lorem.paragraph(),
});

export const getAttachFileContactMessagePayyload = () => ({
  file: {
    name: "empty.txt",
    mimeType: "text/plain",
    buffer: fs.readFileSync("fixtures/empty.txt"),
  },
});

export const getUpdateMessageStatusPayload = (
  messageStatus: MessageStatus,
): SetNewMessageStatusRequest => ({
  status: messageStatus,
});
