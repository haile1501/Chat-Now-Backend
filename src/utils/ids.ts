import { customAlphabet, nanoid } from 'nanoid';

export const createConversationID= customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  6,
);

export const createFriendID = () => nanoid();
export const createMessID = () => nanoid(8);
export const createuserID = () => nanoid(8);
