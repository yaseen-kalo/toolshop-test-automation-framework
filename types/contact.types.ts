// ------- Contact Request ----------------------------------------------------------------------------
export interface SendContactMessageRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AttachFileToContactMessageRequest {
  file: {
    name: string;
    mimeType: string;
    buffer: Buffer;
  };
}

export interface SendNewContactReplyMessageRequest extends SendContactMessageRequest {}

export interface SetNewMessageStatusRequest {
  status: MessageStatus;
}

// ----------------- Common Interfaces -----------------

export type MessageStatus = "NEW" | "IN_PROGRESS" | "RESOLVED";

export interface ContactMessage {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  created_at: string;
  user: null;
}

// ------- Contact Response ----------------------------------------------------------------------------

export interface GetMessagesResponse {
  current_page: number;
  data: ContactMessage[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface GetMessageByIdResponse {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  created_at: string;
  user: null;
  replies: [];
}

export interface SendContactMessageResponse {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  id: string;
  created_at: string;
}

export interface SendNewContactReplyMessageResponse {
  message: string;
  id: string;
  created_at: string;
}
// AttachFileToContactMessageResponse and UpdateMessageStatusResponse
export interface ContactMutation {
  success: boolean;
}
