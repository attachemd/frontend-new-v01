const PROXY_CONFIG = {
  "/api": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true,
    "bypass": function (req, res, proxyOptions) {
      if (req.headers.accept.indexOf("html") !== -1) {
        console.log("Skipping proxy for browser request.");
        // console.log("access: ", localStorage.getItem("access"));
        return "/index.html";
      }  else {
        // console.log(
        //   '%c PROXY_CONFIG ',
        //   'background: red; color: #fff; padding: 0 100px;'
        // );
      }
      req.headers["X-Custom-Header"] = "yes";
    }
  }
}

module.exports = PROXY_CONFIG;
