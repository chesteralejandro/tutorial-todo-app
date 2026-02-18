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

app.get('/', async (_, res) => {
	const items = await mongodb.itemsCollection.find().toArray();

	const homepageHTML = `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple To-Do App</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
        </head>
        <body>
            <div class="container">
                <h1 class="display-4 text-center py-1">To-Do App</h1>
                <div class="jumbotron p-3 shadow-sm">
                    <form id="create-form" action="/create-item" method="POST">
                        <div class="d-flex align-items-center">
                            <input id="create-input" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                            <button class="btn btn-primary">Add New Item</button>
                        </div>
                    </form>
                </div>
                <ul id="items-list" class="list-group pb-5"></ul>
            </div>
            <script>
                    const items = ${JSON.stringify(items)};
            </script>
            <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
            <script src="/index.js"></script>
        </body>
        </html>`;

	res.send(homepageHTML);
});

app.post('/create-item', sanitizeHTMLText, async (req, res) => {
	const { text } = req.body;

	const item = await mongodb.itemsCollection.insertOne({ text });

	return res.json({ _id: item.insertedId, text });
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
