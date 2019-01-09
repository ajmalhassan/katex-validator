const express = require('express')
const bodyParser = require('body-parser')

const mongoose = require('./db/mongoose');
const { Todo } = require('./models/todo.model')
const { User } = require('./models/user.model')

const app = express()

app.use(bodyParser.json())

app.post('/api/v1/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    })

    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    })

})

const port = process.env.PORT || 3500
app.listen(port, () => console.log(`Server listening on port ${port}!`))