const axios = require("axios");

module.exports = async function (req, res) {
  await axios.default.get('http://localhost:7777');
  res.json({ success: true });
};