const mongoose = require('mongoose')

// setup, validate DB schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 5,
    required: [true, 'Title required']
  },
  author: {
    type: String,
    required: [true, 'Author required']
  },
  url: {
    type: String,
    required: [true, 'URL required'],
  },
  likes: {
    type: Number,
    default: 0
  },
  user:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
})

// transform DB output fields for relevant data
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// export to blogsController
module.exports = mongoose.model('Blog', blogSchema)

