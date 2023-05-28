# Swifttalk-messanger

Messenger web-application on NodeJS with top-notch security system.

##Setup

Instructions on how to start the project on your local machine...

### Requirements

1. Node.js
2. MongoDB

### Installation of Dependencies

1. Run `npm i` on the root directory.
2. Run `npm i --legacy-peer-deps` on the frontend directory

### Confirguration

- Look in the .env file for the server configuration such as the mongodb uri.

### Running the app

- Run `npm start` both on the frontend directory and the root directory.

## Implementation Details:

1.  Features

   - Light/Dark theme
   - Real Time Chatting with Typing indicators
   - One to One chat
   - Search Users
   - Create Group Chats
   - Notifications
   - Add or Remove users from group
   - View Other user Profile
   - E2E encryption in one to one chats  

2. Security

   #### Hashing
   - **PBKDF2** (SHA512 digest, 64 length) for hashing the password of each user account, incorporated with a salt(email) and uses it as a passphrase.

   #### Encryption
   - AES for encrypting the private key of the user stored on the database. Also used for encrypting chat messages, only one to one chats.
   
   #### Key Exchange
   - ECDH for public key exchange for two participants obtaining the same one secret key  
     to be used as the passphrase for encrypting/decrypting chat messages on their private channels.
     

 
#### Topics Related & Technologies Used

Cryptography, Assymetric Encryption, RSA, Hash Functions, WebDev, Javascript, NodeJs, ReactJs, ExpressJS, MongoDB, WebSockets, Express

## Made By 

- [@NikitaKalabin](https://github.com/NikitaKalabin)
- [@squizziee](https://github.com/squizziee)
- [@magnacartaam](https://github.com/magnacartaam)
