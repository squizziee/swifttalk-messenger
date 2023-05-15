import CryptoJS from "crypto-js";
const { AES } = CryptoJS;
const createECDH = require('create-ecdh/browser')

export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSender = (loggedUser, users) => {
  if (loggedUser === undefined) {
    window.location.reload();
  }
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  if (loggedUser === undefined) {
    window.location.reload();
  }
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const getLastMessageContent = (chat, loggedUser) => {
  if (!chat.isGroupChat) {
    const publicKeyOfOtherUserStr = getSenderFull(loggedUser, chat.users).publicKey;
    const pvkStr = localStorage.getItem("pvk");
    const pvkParse = JSON.parse(pvkStr);
    const pvk = Buffer.from(pvkParse.data);
    const ecdh = createECDH("secp256k1");
    ecdh.setPrivateKey(pvk);
    const publicKeyOfOtherUserParsed = JSON.parse(publicKeyOfOtherUserStr);
    const publicKeyOfOtherUser = Buffer.from(publicKeyOfOtherUserParsed.data);
    const passphraseOfOtherUser = ecdh.computeSecret(publicKeyOfOtherUser).toString("hex");
    return AES.decrypt(chat.latestMessage.content, passphraseOfOtherUser).toString(
      CryptoJS.enc.Utf8
    );
  } else {
    return chat.latestMessage.content;
  }
}