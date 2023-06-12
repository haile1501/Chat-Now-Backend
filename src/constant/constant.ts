export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum ConversationType {
  Private = 'private',
  Group = 'group',
}

export enum FriendStatus {
  Waiting = 'waiting',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export enum NotificationType {
  NEW_FRIEND_REQUEST = 'you has a new friend request from ',
  NEW_FRIEND_ACCPECTED = ' your request is accepted from ',
  NEW_CONVERSATION = 'you are added to new conversation ',
  NEW_MESSAGE = 'you have new message from ',
  LEAVE_CONVERSATION = 'conversation has left by '
}

export enum NotiStatus {
  READED = 'Readed',
  NOT_READ_YET = 'Not read yet'
}
