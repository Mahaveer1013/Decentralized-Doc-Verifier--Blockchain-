// models/document.model.js
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    user_public_key: {
        type: String,
        required: true,
    },
    issuer_public_key: {
        type: String,
        required: true,
    },
    document_hash: {
        type: String,
        required: true,
    },
    encrypted_document: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const DocumentModel = mongoose.model('Document', documentSchema);

export default DocumentModel;
