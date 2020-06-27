const router = require('express').Router();
const db = require('../app/models')

router.post('/submit', ({body}, res) => {
    console.log(body);
    db.Exercises.create(body).then((newExercise) => {
        console.log(newExercise);
        return db.Workouts.findOneAndUpdate({}, { $push: {exercises: newExercise._id} }, { new: true })
    }).then(dbWorkouts => {
        res.json(newExercise);
    }).catch(error => {
        res.json(error);
    })
});

router.get('/exercises', (req, res) => {
    db.Exercises.find({}).sort({_id: 'description'})
    .then(dbExercises => {
        res.json(dbExercises);
    }).catch(error => {
        res.json(error);
    })
})

// Find by ID
router.get('/exercises/:id', (req, res) => {
    db.Exercises.findById(req.params.id).then(result => {
        if(!result) {
            return res.status(404).send({
                message: 'Exercise not found. Invalid ID.'
            });
        }
        res.send(result);
    }).catch(error => {
        if (error.kind === 'ObjectId') {
            return res.status(404).send({
                message: 'Exercise not found. Invalid ID.'
            })
        }
        return res.status(500).send({
            message: 'Error finding exercise with that ID.'
        })
    })
});

// by noteId
router.put('/exercises:id', (req, res) => {
    if (!req.body.name) {
        return res.status(400).send({
            message: 'Exercise name cannot be empty!'
        })
    }

    db.Exercises.findByIdAndUpdate(req.params.id, {
        name: req.body.name || 'Untitled',
        description: req.body.description,
        difficulty: req.body.difficulty
    }, { new: true }).then(results => {
        if (!results) {
            return res.status(404).send({
                message: 'Exercise not found. Invalid ID.'
            });
        }
        res.send(results);
    }).catch(error => {
        if (error.kind === 'ObjectId') {
            return res.status(404).send({
                message: 'Exercise not found. Invalid ID'
            });
        }
        return res.status(500).send({
            message: 'Error updating note.'
        })
    })
})