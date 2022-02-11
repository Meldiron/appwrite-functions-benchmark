const axios = require("axios");

const httpServerEndpoint = "http://138.68.70.184:7777";

module.exports = async function (req, res) {
  let lastErr;

  let finished = false;
  let index = 0;
  while (!finished && index < 120) {
    index++;
    try {
      const res = await axios.default.get(httpServerEndpoint);
      if (res.data !== "OK") {
        throw new Error("Not fine..." + res.data);
      }

      finished = true;
      lastErr = null;
    } catch (err) {
      lastErr = err;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  if (lastErr) {
    throw lastErr;
  }

  res.json({ success: true });
};
