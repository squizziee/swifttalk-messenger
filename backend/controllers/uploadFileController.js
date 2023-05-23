const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Message = require("../models/messageModel");
const UploadFile = require("../models/uploadFileModel");

const uploadFile = expressAsyncHandler(async (req, res) => {
    const { filename, size, url, messageId } = req.body;
    console.log("In file controller");
    console.log(filename);
    console.log(size);
    console.log(url);
    console.log(messageId);
    if (!messageId || !size || !url || !filename) {
        console.log("Invalid data passed into the request");
        return res.sendStatus(400);
    }

    const newUploadFile = {
        filename: filename,
        size: size,
        url: url,
        message: messageId,
    };

    try {
        const createdUploadFile = await UploadFile.create(newUploadFile);

        await createdUploadFile.populate({ path: "message", select: "sender chat" });

        await Message.findByIdAndUpdate(req.body.messageId, { $push: { attachments: createdUploadFile._id } });

        res.json(createdUploadFile);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = { uploadFile };
