export const isSameSenderMargin = (messages, m, i, userId) => {
  const nextSenderId = messages[i + 1]?.sender && typeof messages[i + 1].sender === "object"
    ? messages[i + 1].sender._id
    : messages[i + 1]?.sender;

  const currentSenderId = m.sender && typeof m.sender === "object"
    ? m.sender._id
    : m.sender;

  const currentUserId = userId && typeof userId === "object" ? userId._id : userId;

  if (
    i < messages.length - 1 &&
    String(nextSenderId) === String(currentSenderId) &&
    String(currentSenderId) !== String(currentUserId)
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      String(nextSenderId) !== String(currentSenderId) &&
      String(currentSenderId) !== String(currentUserId)) ||
    (i === messages.length - 1 && String(currentSenderId) !== String(currentUserId))
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  const nextSenderId = messages[i + 1]?.sender && typeof messages[i + 1].sender === "object"
    ? messages[i + 1].sender._id
    : messages[i + 1]?.sender;

  const currentSenderId = m.sender && typeof m.sender === "object"
    ? m.sender._id
    : m.sender;

  const currentUserId = userId && typeof userId === "object" ? userId._id : userId;

  return (
    i < messages.length - 1 &&
    (String(nextSenderId) !== String(currentSenderId) || nextSenderId === undefined) &&
    String(currentSenderId) !== String(currentUserId)
  );
};

export const isLastMessage = (messages, i, userId) => {
  const lastMessageSenderId = messages[messages.length - 1]?.sender && typeof messages[messages.length - 1].sender === "object"
    ? messages[messages.length - 1].sender._id
    : messages[messages.length - 1]?.sender;

  const currentUserId = userId && typeof userId === "object" ? userId._id : userId;

  return (
    i === messages.length - 1 &&
    String(lastMessageSenderId) !== String(currentUserId) &&
    lastMessageSenderId
  );
};

export const isSameUser = (messages, m, i) => {
  const prevSenderId = messages[i - 1]?.sender && typeof messages[i - 1].sender === "object"
    ? messages[i - 1].sender._id
    : messages[i - 1]?.sender;

  const currentSenderId = m.sender && typeof m.sender === "object"
    ? m.sender._id
    : m.sender;

  return i > 0 && String(prevSenderId) === String(currentSenderId);
};

export const getSender = (loggedUser, users) => {
  const loggedUserId = loggedUser && typeof loggedUser === "object" ? loggedUser._id : loggedUser;
  const user0Id = users[0] && typeof users[0] === "object" ? users[0]._id : users[0];

  return String(user0Id) === String(loggedUserId) ? users[1]?.name : users[0]?.name;
};

export const getSenderFull = (loggedUser, users) => {
  const loggedUserId = loggedUser && typeof loggedUser === "object" ? loggedUser._id : loggedUser;
  const user0Id = users[0] && typeof users[0] === "object" ? users[0]._id : users[0];

  return String(user0Id) === String(loggedUserId) ? users[1] : users[0];
};