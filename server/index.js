const express = require('express')
const connectToDB = require('./db.js')
require('dotenv').config()
connectToDB()
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema.js')
const cors = require('cors')
const app = express()
app.use(cors())
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))
app.listen(5000, () => {
    console.log('Server started')
})