import mongoose, { Schema } from "mongoose";

const entrySchema = new Schema(
{
    party: {
        type: Schema.Types.ObjectId,
        ref: "Party",
        required: true
    },

    type: {
        type: String,
        enum: ["credit", "debit"],
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    reference: {
        type: String,
        default: "cash"
    },

    note: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now
    }

},
{
    timestamps: true
});

entrySchema.index({ date: -1 });
entrySchema.index({ party: 1 });
entrySchema.index({ type: 1 });

export const Entry = mongoose.model("Entry", entrySchema);