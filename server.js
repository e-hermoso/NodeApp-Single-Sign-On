const http = require('http');
const express = require('express');
const msal = require('@azure/msal-node');
const path = require('path');
const app = express();

const server = http.createServer(app);
const port = process.env.PORT || 3005;
server.listen(port);
console.debug('Server listening on port ' + port);

// Before running the sample, you will need to replace the values in the config,
// including the clientSecret
const config = {
  auth: {
      clientId: "8dec3eb5-6b85-43e9-8a42-2f64cae6ed18",
      authority: "https://login.microsoftonline.com/common/",
      clientSecret: "MmW7Q~lvWFyvM~GfDvA6d0kWXNLs9qYrlH91e"
  },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

  // Create msal application object
  const cca = new msal.ConfidentialClientApplication(config);

app.get('/', (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["user.read"],
        redirectUri: "https://amcdevfe.azurewebsites.net/redirect",
    };

    // get url to sign user in and consent to scopes needed for application
    cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
      console.log("testeh",response);
        res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
});

app.get('/redirect', (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: "https://amcdevfe.azurewebsites.net/redirect",
    };

    cca.acquireTokenByCode(tokenRequest).then((response) => {
        console.log("\nSuccess Response: \n:", response);
        //res.sendStatus(200);
        // res.redirect("/")
        app.use(express.json());
        app.use(express.static("express"));
        res.redirect("/ocamc")
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});


// default URL for website
app.use('/ocamc', function(req,res){
    res.sendFile(path.join(__dirname+'/express/index.html'));
    //__dirname : It will resolve to your project folder.
  });