const institutionSchema = new mongoose.Schema({
    wallet_address: {
        type: String,
        required: true,
        unique: true,
    },
    public_key: {
        type: String,
        required: true,
    },
    is_registered: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const InstitutionModel = mongoose.model('Institution', institutionSchema);

export default InstitutionModel;
