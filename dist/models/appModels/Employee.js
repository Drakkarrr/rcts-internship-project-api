import mongoose, { Schema } from 'mongoose';
const employeeSchema = new Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    isAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    firstname: {
        type: String,
        trim: true,
        required: true,
    },
    lastname: {
        type: String,
        trim: true,
        required: true,
    },
    birthplace: String,
    gender: String,
    idCardNumber: {
        type: String,
        trim: true,
    },
    idCardType: String,
    birthday: Date,
    securitySocialNbr: String,
    taxNumber: String,
    nationality: {
        type: String,
        trim: true,
    },
    photo: {
        type: String,
        trim: true,
    },
    headerImage: {
        type: String,
        trim: true,
    },
    bankName: {
        type: String,
        trim: true,
    },
    bankIban: {
        type: String,
        trim: true,
    },
    bankSwift: {
        type: String,
        trim: true,
    },
    bankNumber: {
        type: String,
        trim: true,
    },
    bankRouting: {
        type: String,
        trim: true,
    },
    customField: [
        {
            fieldName: {
                type: String,
                trim: true,
                lowercase: true,
            },
            fieldType: {
                type: String,
                trim: true,
                lowercase: true,
                default: 'string',
            },
            fieldValue: {},
        },
    ],
    location: {
        latitude: Number,
        longitude: Number,
    },
    address: String,
    city: String,
    State: String,
    postalCode: Number,
    country: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    otherPhone: [String],
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    otherEmail: [String],
    socialMedia: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String,
        tiktok: String,
        youtube: String,
        snapchat: String,
    },
    images: [
        {
            id: String,
            name: String,
            path: String,
            description: String,
            isPublic: {
                type: Boolean,
                default: false,
            },
        },
    ],
    files: [
        {
            id: String,
            name: String,
            path: String,
            description: String,
            isPublic: {
                type: Boolean,
                default: false,
            },
        },
    ],
    notes: String,
    category: String,
    status: String,
    approved: Boolean,
    verified: Boolean,
    tags: [String],
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    },
});
employeeSchema.plugin(require('mongoose-autopopulate'));
export default mongoose.model('Employee', employeeSchema);
