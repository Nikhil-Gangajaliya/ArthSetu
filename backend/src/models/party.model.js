import mongoose, { Schema } from "mongoose";

const partySchema = new Schema(
{
    name: {
        type: String,
        required: true
    },

    nameInitial: {
        type: String,
        index: true
    },

    email: {
        type: String
    },

    phone: {
        type: String
    },

    isHidden: {
        type: Boolean,
        default: false
    }

},
{
    timestamps: true
}
);

partySchema.pre("save", function () {
    if (this.name) {
        this.nameInitial = this.name.charAt(0).toUpperCase();
    }
});

partySchema.index({ nameInitial: 1, name: 1 });
partySchema.index({ name: "text" });

export const Party = mongoose.model("Party", partySchema);