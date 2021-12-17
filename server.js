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
      clientId: "902d648f-7e6e-4323-8158-2a7b531e38e0",
      authority: "https://login.microsoftonline.com/e4449a56-cd3d-40ba-ae32-25a63deaab3b",
      clientSecret: "Ehy7Q~C.QnIdDU8PIgjBluiCt3YcMpTI8hrzw"
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
        redirectUri: "https://app-single-sign-on.azurewebsites.net/redirect",
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
        redirectUri: "https://app-single-sign-on.azurewebsites.net/redirect",
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