const mongoose = require('mongoose')

const connectToDB = () => {
    const url = process.env.MONGO_URL
    mongoose.connect(url, () => {
        console.log('DB Started')
    })
}
module.exports = connectToDB