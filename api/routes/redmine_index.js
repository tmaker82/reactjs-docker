const express = require('express');
const redrouter = express.Router();
const redmineController = require('../controllers/redmineController');

redrouter.get('/issues', redmineController.getIssues);
redrouter.post('/issues', redmineController.createIssue);
redrouter.put('/issues/:id', redmineController.updateIssues);
redrouter.delete('/issues/:id', redmineController.deleteIssue);

module.exports = redrouter;