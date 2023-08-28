const express = require("express");
const app = express();
const axios = require("axios");
const port = process.env.PORT || 3000;
const path = require("path");

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:4200",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

const eventSearchAPI = "https://app.ticketmaster.com/discovery/v2/events.json?";
const eventDetailsAPI = "https://app.ticketmaster.com/discovery/v2/events/";
// const venueDetailsAPI =
//   "https://app.ticketmaster.com/discovery/v2/venues?.json?id=";
const venueDetailsAPI = "https://app.ticketmaster.com/discovery/v2/venues/";
const Authorization = "Bearer qNHGBwrCsREw50tqWDbzj99LyRfEJlc3";
const ticketMatsterApiKey = "qNHGBwrCsREw50tqWDbzj99LyRfEJlc3";

// const publicPath = path.join(__dirname, "/dist/hw8_app");

// app.use(express.static(publicPath));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/dist/hw8_app/index.html"));
// });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.get("/api/eventSearch", async function (req, res, next) {
  const query = req.query;
  const keyword = query.keyword;
  const geoPoint = query.geoPoint;
  const radius = query.radius;
  const unit = query.unit;
  let segmentId = query.segmentId;
  const apikey = query.apikey;

  const para = {
    params: {
      keyword: keyword,
      geoPoint: geoPoint,
      radius: radius,
      unit: unit,
      segmentId: segmentId,
      apikey: apikey,
    },
    headers: {
      Authorization: Authorization,
    },
  };
  // const response = await axios.get(eventSearchAPI + "keyword=" + keyword + "&segmentId=" + segmentId +
  // "&geoPoint=" + geoPoint +
  // "&radius=" + radius +
  // "&unit=miles" +);
  const response = await axios.get(eventSearchAPI, para);
  res.json(response.data);
});

app.get("/api/eventDetails", async function (req, res, next) {
  const query = req.query;
  const id = query.id;

  const response = await axios.get(
    eventDetailsAPI + id + "?apikey=" + ticketMatsterApiKey,
    {
      headers: {
        Authorization: Authorization,
      },
    }
  );
  res.json(response.data);
});

app.get("/api/venueDetails", async function (req, res, next) {
  const query = req.query;
  const venueId = query.venueId;

  const response = await axios.get(
    venueDetailsAPI + venueId + ".json?apikey=" + ticketMatsterApiKey,
    {
      headers: {
        Authorization: Authorization,
      },
    }
  );
  console.log(
    venueDetailsAPI + venueId + ".json?apikey=" + ticketMatsterApiKey
  );
  res.json(response.data);
});

app.get("/spotify/search/:artist", function (req, res, next) {
  var SpotifyWebApi = require("spotify-web-api-node");
  var clientId = "99d9df95daf6496791011b793c1b8cb2";
  var clientSecret = "b11f16fd21044a1bac30cd8ca4746186";
  var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
  });

  spotifyApi.clientCredentialsGrant().then(
    function (data) {
      spotifyApi.setAccessToken(data.body["access_token"]);
      var artistName = req.params.artist;
      spotifyApi.searchArtists(artistName).then(
        function (data) {
          res.send(data.body);
        },
        function (err) {
          res.status(400).send(err);
        }
      );
    },
    function (err) {
      res.status(400).send(err);
    }
  );
});

app.get("/spotify/album/:id", function (req, res, next) {
  var SpotifyWebApi = require("spotify-web-api-node");
  var clientId = "99d9df95daf6496791011b793c1b8cb2";
  var clientSecret = "b11f16fd21044a1bac30cd8ca4746186";
  var spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
  });

  spotifyApi.clientCredentialsGrant().then(
    function (data) {
      spotifyApi.setAccessToken(data.body["access_token"]);
      var artistId = req.params.id;
      spotifyApi.getArtistAlbums(artistId, { limit: 3 }).then(
        function (data) {
          res.send(data.body);
          console.log("Album information", data.body);
        },
        function (err) {
          console.error(err);
        }
      );
    },
    function (err) {
      res.status(400).send(err);
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
