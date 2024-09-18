/** @format */

export function displayFirstMessageUser(messages, chatroom, id) {
  if (messages) if (messages.length === 0) return null;
  let a = null;
  const result = [];

  messages.forEach((message) => {
    //
    if (message.userId !== a) {
      a = message.userId;
      result.push({
        ...message,
        displayName: message.username,
      });
    } else {
      result.push(message);
    }
  });

  return result;
}
