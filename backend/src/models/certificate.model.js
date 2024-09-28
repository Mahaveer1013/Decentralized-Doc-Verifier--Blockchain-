const certificateSchema = new mongoose.Schema({
    document_id: {
        type: String,
        required: true,
        unique: true,
    },
    issuer_address: {
        type: String,
        required: true,
    },
    recipient_address: {
        type: String,
        required: true,
    },
    encrypted_certificate: {
        type: String,
        required: true,
    },
    issuer_public_key: {
        type: String,
        required: true,
    },
    certificate_hash: {
        type: String,
        required: true,
    },
    isDone: {
        type: Boolean,
        default:false
    }
}, { timestamps: true });

const CertificateModel = mongoose.model('Certificate', certificateSchema);

export default CertificateModel;
