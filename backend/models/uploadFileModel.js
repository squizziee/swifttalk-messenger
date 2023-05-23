const mongoose = require('mongoose')

const uploadFileModel = mongoose.Schema(
    {
        filename: { type: String, trim: true, required: true },
        size: { type: String, trim: true },
        url: { type: String, trim: true, required: true },
        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        },
    },
    {
        timestamps: true
    }
)

const UploadFile = mongoose.model("UploadFile", uploadFileModel)

module.exports = UploadFile;