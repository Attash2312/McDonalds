// Vercel serverless function entry point
const app = require('../server');

// Export as a Vercel function handler
module.exports = (req, res) => {
  return app(req, res);
}; 