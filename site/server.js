const express = require('express');
const app = express();
app.use('/svelte-toasts', express.static('public'));

app.get('/', (req, res) => {
	res.redirect('/svelte-toasts');
});
app.get('*', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.listen(process.env.PORT || 3000, () => {
	console.log('App listening on port 3000');
});
