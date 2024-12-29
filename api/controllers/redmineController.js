const pool = require('../config/db');
var Redmine = require('node-redmine');
var hostname = process.env.REDMINE_HOST || '192.168.0.238:33563';
var config = {
    apiKey: process.env.REDMINE_APIKEY || 'ea8487e9edd3879f7ab516640e68e4921356bbc4'
};

var redmine = new Redmine(hostname, config);

exports.getIssues = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/*
 * create issue
 */
var issue = {
    "issue": {
        "project_id": 1,
        "subject": 'Redmine REST API by Node.js',
        "assigned_to_id": 5,
        "notes": "automative update redmine notes by node js",
        "priority_id": 4
    }
};
/*redmine.create_issue(issue, function(err, data) {
    if (err) throw err;

    console.log(data);
});*/

exports.createIssue = async (req, res) => {
    const { name, email } = req.body;
    console.log('req.body', req.body)
    try {
        const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateIssues = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteIssue = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};