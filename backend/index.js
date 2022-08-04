const app = require("./app");
// const http = require("http");
// const port = 3000

//utils
const config = require("./utils/config");

// connect to server
// const server = http.createServer(app);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});