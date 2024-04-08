import mongoose, { Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
var SocialMediaPlatform;
(function (SocialMediaPlatform) {
    SocialMediaPlatform["Facebook"] = "facebook";
    SocialMediaPlatform["Instagram"] = "instagram";
    SocialMediaPlatform["Twitter"] = "twitter";
    SocialMediaPlatform["LinkedIn"] = "linkedin";
    SocialMediaPlatform["TikTok"] = "tiktok";
    SocialMediaPlatform["YouTube"] = "youtube";
    SocialMediaPlatform["Snapchat"] = "snapchat";
})(SocialMediaPlatform || (SocialMediaPlatform = {}));
const companySchema = new Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    legalName: {
        type: String,
        trim: true,
    },
    hasParentCompany: {
        type: Boolean,
        default: false,
    },
    parentCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    isClient: {
        type: Boolean,
        default: false,
    },
    peoples: [{ type: mongoose.Schema.Types.ObjectId, ref: 'People', autopopulate: true }],
    mainContact: { type: mongoose.Schema.Types.ObjectId, ref: 'People', autopopulate: true },
    icon: {
        type: String,
        trim: true,
    },
    logo: {
        type: String,
        trim: true,
    },
    imageHeader: String,
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
    bankCountry: {
        type: String,
        trim: true,
    },
    companyRegNumber: {
        type: String,
        trim: true,
    },
    companyTaxNumber: {
        type: String,
        trim: true,
    },
    companyTaxId: {
        type: String,
        trim: true,
    },
    companyRegId: {
        type: String,
        trim: true,
    },
    securitySocialNbr: String,
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
    fax: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    otherEmail: [String],
    website: {
        type: String,
        trim: true,
        lowercase: true,
    },
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
    category: String,
    approved: {
        type: Boolean,
        default: true,
    },
    verified: Boolean,
    notes: String,
    tags: [String],
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
});
companySchema.plugin(autopopulate);
export default mongoose.model('Company', companySchema);
//# sourceMappingURL=Company.js.map