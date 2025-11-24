// server.js
const app = require("./app");
const PORT = process.env.PORT || 8081;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the server instance for testing
module.exports = server;
