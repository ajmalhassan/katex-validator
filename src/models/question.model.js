const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

let schema = new mongoose.Schema({
    choice_d: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    choice_a: {
        type: String,
        default: false
    },
    choice_b: {
        type: String,
        default: null
    },
    choice_c: {
        type: String,
        default: null
    },
    solution: {
        type: String,
        default: null
    },
    statement: {
        type: String,
        default: null
    },
    question_id: {
        type: Number,
        default: null
    }
})

schema.plugin(mongoosePaginate)

let Question = mongoose.model('Question', schema);

module.exports = { Question }