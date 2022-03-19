const Express = require("express");
const Gun = require("gun");
const App = Express();
const PORT = 5000;

App.use(Gun.serve);

const server = App.listen(PORT, () => {
	console.log(`app is running on port http://localhost:${PORT}`);
});

Gun({ web: server });
