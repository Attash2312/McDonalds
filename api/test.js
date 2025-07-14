// Simple test function
module.exports = (req, res) => {
  res.json({
    message: 'API test function working',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}; 