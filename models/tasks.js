var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
    task: String,
    priority: { type: Number, default: 0 },
});

mongoose.model('Task', TaskSchema);