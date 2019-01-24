const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const { promisify } = require('util')
const fs = require('fs-extra')

const { db } = require('./db/mongoose')
const { Question } = require('./models/question.model')

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))


let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + '.json');
    }
});

const upload = promisify(multer({ storage }).single('question'))

app.post('/api/v1/submit/questions', async (req, res) => {
    try {
        await upload(req, res)
        let questions = JSON.parse(await fs.readFile(req.file.path, 'utf8'))
        await fs.unlink(req.file.path)
        await Promise.all(
            questions
                .map(async question => {
                    return new Question({
                        choice_d: question.choice_d,
                        choice_a: question.choice_a,
                        choice_b: question.choice_b,
                        choice_c: question.choice_c,
                        solution: question.solution,
                        statement: question.statement,
                        question_id: question.id
                    })
                        .save()
                })
        )
    } catch (err) {
        return res.status(400).send({ message: err.message })
    }
    res.send({ message: "File is uploaded" })
})


app.post('/api/v1/questions/list', (req, res) => {
    console.log(`page ======> ${JSON.stringify(req.body.page)}`)
    Question.paginate({}, { page: parseInt((req.body.page || '1')), limit: parseInt((req.body.limit || '50')) }, function (err, result) {
        if (err) {
            res.status(400).send(err)
        } else if (result.docs.length === 0 && result.total === 0) {
            res.status(400).send("No questions found")
        } else {
            res.send(result)
        }
    });

})

app.delete('/api/v1/questions/drop', async (req, res) => {

    let count, delOK;
    try {
        count = await db.collection('questions').count();
    } catch (err) {
        throw err;
    }
    if (count) {
        try {
            delOK = await db.collection('questions').drop();
        } catch (err) {
            throw err;
        }
        if (delOK) res.send({ message: 'questions dropped!' });
    } else {
        res.send({ message: 'questions already dropped!' });
    }
})

const port = process.env.PORT || 3500
app.listen(port, () => console.log(`Server listening on port ${port}!`))