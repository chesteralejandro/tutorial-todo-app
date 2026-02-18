const path = require('node:path');

const express = require('express');
const sanitizeHTML = require('sanitize-html');

const mongodb = require('./config/db.js');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function protectWithPassword(req, res, next) {
	res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"');

	if (
		req.headers.authorization != process.env.BROWSER_AUTHENTICATION_STRING
	) {
		return res.status(401).send('Authentication required!');
	}

	next();
}

function sanitizeHTMLText(req, _, next) {
	const { text } = req.body;

	const safeText = sanitizeHTML(text, {
		allowedTags: [],
		allowedAttributes: {},
	});

	req.body.text = safeText;
	next();
}

app.use(protectWithPassword);

app.get('/test', (_, res) => {
	res.send('Server works!');
});

app.get('/read-items', async (_, res) => {
	const items = await mongodb.itemsCollection.find().toArray();

	res.status(200).json({ items });
});

app.post('/create-item', sanitizeHTMLText, async (req, res) => {
	const { text } = req.body;

	const item = await mongodb.itemsCollection.insertOne({ text });

	return res.status(201).json({ _id: item.insertedId, text });
});

app.post('/update-item', sanitizeHTMLText, async (req, res) => {
	const { text, id } = req.body;

	const formattedId = mongodb.getIdFormat(id);

	await mongodb.itemsCollection.findOneAndUpdate(
		{ _id: formattedId },
		{
			$set: { text },
		},
	);

	res.send('Success');
});

app.post('/delete-item', async (req, res) => {
	const { id } = req.body;

	const formattedId = mongodb.getIdFormat(id);

	await mongodb.itemsCollection.deleteOne({ _id: formattedId });

	res.send('Success');
});

module.exports = app;
