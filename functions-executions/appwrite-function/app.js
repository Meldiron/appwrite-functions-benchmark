const axios = require("axios");

module.exports = async function (req, res) {
  let lastErr;

  let finished = false;
  let index = 0;
  while (!finished && index < 120) {
    index++;
    try {
      const res = await axios.default.get("http://138.68.70.184:7777");
      if (res.data !== "OK") {
        throw new Error("Not fine..." + res.data);
      }

      finished = true;
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
