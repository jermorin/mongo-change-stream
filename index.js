const mongoose = require('mongoose')
const token = require('./models/token')
const task = require('./models/task')

mongoose.connect('mongodb://localhost:27017/tasks');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));

db.once('open', async () => {
    console.log('watching..')

    // getting the cursor
    const [resumeAfter] = await token.find({}).sort({ _id: -1 }).limit(1)
    console.log(String(resumeAfter._id))

    // watching tasks collection
    const changeStream = task.collection.watch([
        {
            "$match": {
                "operationType": {
                    "$in": [
                        "insert"
                    ]
                }
            }
        }
    ], resumeAfter ? { resumeAfter: resumeAfter.token } : null);

    changeStream.on('change', async (change) => {
        console.log(change.fullDocument);
        // save the new cursor
        await token.insertMany({ token: change._id })
    });
});