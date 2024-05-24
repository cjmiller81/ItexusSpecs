// Local HTTPS server to test production build with self signed certs.
// @see: https://github.com/vercel/next.js/discussions/10935#discussioncomment-6888422
// @see: https://github.com/vercel/next.js/discussions/10935

const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const dev = false; //process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT) || 3000;

/**
 * SSL_KEY_FILE and SSL_CRT_FILE are using the `yarn dev` generated cert files
 * when using `next dev --experimental-https`
*/
const privateKeyPath = 'certificates/localhost-key.pem'; //process.env.SSL_KEY_FILE;
const certificatePath = 'certificates/localhost.pem'; //process.env.SSL_CRT_FILE;
console.log(`> Local HTTPS Server user cert files key: ${privateKeyPath} cert: ${certificatePath}`);
console.log(`> Run 'yarn dev' once if these files do not exist yet.`);
var httpsOptions = {
  key: fs.readFileSync(privateKeyPath),
  cert: fs.readFileSync(certificatePath),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Local HTTPS Server started on https://localhost:${port}`);
  });
});
