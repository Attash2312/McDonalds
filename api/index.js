// Vercel serverless function entry point
const app = require('../server');

// Export the Express app as a Vercel function
module.exports = app;

// Alternative: Explicit handler for Vercel
// module.exports = (req, res) => {
//   return app(req, res);
// }; 