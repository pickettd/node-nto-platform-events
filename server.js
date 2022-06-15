require("dotenv").config();

let nforce = require("nforce");
let faye = require("faye");
let express = require("express");
let cors = require("cors");
let app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);

let muxJobs = [];

let getMuxJobs = (req, res) => {
  /*let q =
    "SELECT Id, Name, Account__r.Name FROM Merchandising_Mix__c WHERE Status__c='Submitted to Manufacturing'";
  org.query({ query: q }, (err, resp) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      let mixes = resp.records;
      let prettyMixes = [];
      mixes.forEach((mix) => {
        prettyMixes.push({
          mixId: mix.get("Id"),
          mixName: mix.get("Name"),
          account: mix.get("Account__r").Name,
        });
      });
      res.json(prettyMixes);
    }
  });*/
  res.json(muxJobs);
};

/*let getMixDetails = (req, res) => {
  let mixId = req.params.mixId;
  let q =
    "SELECT Id, Merchandise__r.Name, Merchandise__r.Price__c, Merchandise__r.Category__c, Merchandise__r.Picture_URL__c, Qty__c " +
    "FROM Mix_Item__c " +
    "WHERE Merchandising_Mix__c = '" +
    mixId +
    "'";
  org.query({ query: q }, (err, resp) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      let mixItems = resp.records;
      let prettyMixItems = [];
      mixItems.forEach((mixItem) => {
        prettyMixItems.push({
          productName: mixItem.get("Merchandise__r").Name,
          price: mixItem.get("Merchandise__r").Price__c,
          pictureURL: mixItem.get("Merchandise__r").Picture_URL__c,
          mixId: mixItem.get("Id"),
          productId: mixItem.get("Merchandise__r"),
          qty: mixItem.get("Qty__c"),
        });
      });
      res.json(prettyMixItems);
    }
  });
};*/

let approveMuxJob = (req, res) => {
  //   let mixId = req.params.muxId;
  let event = nforce.createSObject("MUX_Inbound__e");
  //event.set("Mix_Id__c", mixId);
  //event.set("Confirmation_Number__c", "xyz123");
  org.insert({ sobject: event }, (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
};

let PORT = process.env.PORT || 5000;

app.use(cors());
app.use("/", express.static(__dirname + "/www"));
app.get("/mux-jobs", getMuxJobs);
// app.get("/mux-jobs/:mixId", getMixDetails);
app.post("/approvals/:muxId", approveMuxJob);

let bayeux = new faye.NodeAdapter({ mount: "/faye", timeout: 45 });
bayeux.attach(server);
bayeux.on("disconnect", function (clientId) {
  console.log("Bayeux server disconnect");
});

server.listen(PORT, () => console.log(`Express server listening on ${PORT}`));

// Connect to Salesforce
let SF_CLIENT_ID = process.env.SF_CLIENT_ID;
let SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET;
let SF_USER_NAME = process.env.SF_USER_NAME;
let SF_USER_PASSWORD = process.env.SF_USER_PASSWORD;
let SF_USER_SECURITY_TOKEN = process.env.SF_USER_SECURITY_TOKEN;

let org = nforce.createConnection({
  clientId: SF_CLIENT_ID,
  clientSecret: SF_CLIENT_SECRET,
  environment: "sandbox",
  redirectUri: "http://localhost:3000/oauth/_callback",
  mode: "single",
  autoRefresh: true,
});

org.authenticate(
  {
    username: SF_USER_NAME,
    password: SF_USER_PASSWORD,
    securityToken: SF_USER_SECURITY_TOKEN,
  },
  (err) => {
    if (err) {
      console.error("Salesforce authentication error");
      console.error(err);
    } else {
      console.log("Salesforce authentication successful");
      console.log(org.oauth.instance_url);
      subscribeToPlatformEvents();
    }
  }
);

// Subscribe to Platform Events
let subscribeToPlatformEvents = () => {
  var client = new faye.Client(org.oauth.instance_url + "/cometd/40.0/");
  client.setHeader("Authorization", "OAuth " + org.oauth.access_token);
  client.subscribe("/event/MUX_Outbound__e", function (message) {
    console.log("Received MUX_Outbound__e event");
    const muxJob = {
      amount: message.payload.Amount__c,
      msgId: message.payload.MUX_Job_ID__c,
    };
    muxJobs.push(muxJob);
    // Send message to all connected Socket.io clients
    io.of("/").emit("mux_outbound", muxJob);
  });
  /*client.subscribe("/event/MUX_Inbound__e", function (message) {
    // Send message to all connected Socket.io clients
    io.of("/").emit("mux_inbound", {
      jobId: message.payload.MUX_Job_ID__c,
    });
  });*/
};
