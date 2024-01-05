const moongoose = require('mongoose');

const categorySchema = new moongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Please enter category name']
    },
});

categorySchema.pre('save', async function(next) {
    if (!this.id) {
        try {
            const result = await this.constructor.find().sort({ id: -1 }).limit(1);
            if (result.length > 0) {
                this.id = result[0].id + 1;
            } else {
                // If no records are found, set the initial id to 1 or any value you prefer.
                this.id = 1;
            }
            next();
        } catch (error) {
            // Handle any potential errors here
            console.error(error);
            next(error);
        }
    } else {
        next();
    }
});


const Category = moongoose.model('Category', categorySchema);
module.exports = Category;