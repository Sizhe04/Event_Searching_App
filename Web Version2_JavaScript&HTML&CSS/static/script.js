const IPInfoAPI = "https://ipinfo.io/?token=b2a289d7dc271c";
const preGeocodingAPI = "https://maps.googleapis.com/maps/api/geocode/json?";
const GeocodingAPIKey = "AIzaSyC2djqPyaFZTIE2jdeoR0It0bQJ_YiZ6bs";

const eventSearchAPI = "http://127.0.0.1:8888/eventSearch";
// const eventSearchAPI = "https://wsizhe-hw6.wl.r.appspot.com/eventSearch";
// const eventSearchAPI_NoSeg =
//   "https://wsizhe-hw6.wl.r.appspot.com/eventSearchNoSeg";
const eventSearchAPI_NoSeg = "http://127.0.0.1:8888/eventSearchNoSeg";
// const eventDeatailsAPI = "https://wsizhe-hw6.wl.r.appspot.com/eventDetails";
const eventDeatailsAPI = "http://127.0.0.1:8888/eventDetails";
const venueDetailsAPI = "http://127.0.0.1:8888/venueDetails";
// const venueDetailsAPI = "https://wsizhe-hw6.wl.r.appspot.com/venueDetails";
const googleMapAPI = "https://www.google.com/maps/search/?api=1&query=";

const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearButton");

const autoGetLocation = document.getElementById("autocheck");

const allInput = document.querySelectorAll("select, input");

const table1 = document.getElementById("main-table");

const table2 = document.getElementById("table2");

const temTable = document.getElementById("template-table");
const noResult = document.querySelector(".norecords");

const tableBody = document.querySelector(".tablebody"); //
const tableBody_t = document.querySelector("tablebody");
const sortEle = document.querySelectorAll(".cansorted");
const table3 = document.querySelector(".venueDetails");
const table3inner = document.querySelector(".venueDetails2");
const tabl3Header = document.querySelector(".table3HeaderContainer");

const showvenueDetailsButton = document.querySelector(".showDetailsButton");
const venueDetailsHeader = document.querySelector(".venueDetailsHeaderspan");
const venueDetailspic = document.querySelector(".venueDetailspic");
const alladdressContent = document.querySelector(".alladdress");

const moreevents = document.querySelector(".moreevents");
const openInGoogle = document.querySelector(".opengoogle");

function showTable1() {
  table1.classList.remove("none");
}

function hideTable1() {
  table1.classList.add("none");
}

function showTable2() {
  table2.classList.remove("none");
}

function hideTable2() {
  table2.classList.add("none");
}

function showTable3() {
  table3.classList.remove("none");
}

function hideTable3() {
  table3.classList.add("none");
}

function showTable3Header() {
  tabl3Header.classList.remove("none");
}

function hideTable3Header() {
  tabl3Header.classList.add("none");
}

function autoDetectLocationHandler() {
  if (autoGetLocation.checked) {
    const inputOfLoc = document.getElementById("locationInput");
    const showInput = document.getElementById("div_locationInput");
    console.log(showInput);
    showInput.classList.add("none");
    inputOfLoc.disabled = true;
    inputOfLoc.value = "";
  } else {
    const inputOfLoc = document.getElementById("locationInput");
    const showInput = document.getElementById("div_locationInput");
    showInput.classList.remove("none");
    inputOfLoc.disabled = false;
  }
}

async function eventDetails(id) {
  showTable2();
  const response = await axios.get(eventDeatailsAPI + "/" + id);
  const responseData = response.data;

  console.log("details=");

  console.log(responseData);

  const dateH2 = document.getElementById("dateH2");
  const artistH2 = document.getElementById("artistH2");
  const picH2 = document.getElementById("pictureH2");
  const venueH2 = document.getElementById("venueH2");
  const genreH2 = document.getElementById("genreH2");
  const priceRangeH2 = document.getElementById("priceRangesH2");
  const ticketStatusH2 = document.getElementById("ticketStatusH2");
  const buyTicketH2 = document.getElementById("buyTicketH2");
  //add none
  dateH2.classList.add("none");

  artistH2.classList.add("none");
  picH2.classList.add("none");
  venueH2.classList.add("none");
  genreH2.classList.add("none");
  priceRangeH2.classList.add("none");
  ticketStatusH2.classList.add("none");
  buyTicketH2.classList.add("none");

  const date = document.getElementById("date");
  const artist = document.getElementById("artist");
  const picture = document.getElementById("picture");
  const venue = document.getElementById("venue");
  const genre = document.getElementById("genre");
  const priceRange = document.getElementById("priceRanges");
  const ticketStatus = document.getElementById("ticketStatus");
  const buyTicket = document.getElementById("buyTicket");

  const table2Head = document.getElementById("table2Header");
  //Detail Header
  table2Head.textContent = await responseData.name;

  //Date
  if ((await responseData.dates) != undefined) {
    dateH2.classList.remove("none");
    date.textContent =
      responseData.dates.start.localDate +
      " " +
      responseData.dates.start.localTime;
  }

  //Artists

  if (
    (await responseData._embedded) != undefined &&
    (await responseData._embedded.attractions) != undefined &&
    (await responseData._embedded.attractions[0]) != undefined &&
    (await responseData._embedded.attractions[0].name) != undefined
  ) {
    const t = responseData._embedded.attractions;
    if (t != undefined) {
      artistH2.classList.remove("none");
      if (t.length == 1) {
        const nameOfArt = t[0].name;
        if (t[0].url != undefined && t[0].url != "Undefined") {
          const artiurl = t[0].url;
          artist.innerHTML = `<a class="url1" href=${artiurl} target="_blank">${nameOfArt}</a>`;
        }
      } else {
        const nameOfArt1 = t[0].name;
        const nameOfArt2 = t[1].name;
        const artiurl1 = t[0].url;
        const artiurl2 = t[1].url;
        artist.innerHTML =
          `<a class="url1" href=${artiurl1} target="_blank">${nameOfArt1}</a>` +
          " | " +
          `<a class="url2" href=${artiurl2} target="_blank">${nameOfArt2}</a>`;
      }
    } else {
      artist.innerHTML = "";
    }
  } else {
    artist.innerHTML = "";
  }

  //pic
  if (
    (await responseData.seatmap) != undefined &&
    (await responseData.seatmap.staticUrl) != undefined &&
    (await responseData.seatmap.staticUrl) != "Undefined"
  ) {
    picture.classList.remove("none");
    const picurl = responseData.seatmap.staticUrl;
    // picH2.src = `<img src=${picurl} alt='seat' class='seatImage' />`;
    picture.src = picurl;
  } else {
    picture.src = "";
    picture.classList.add("none");
  }
  //venue
  if (
    (await responseData._embedded) != undefined &&
    (await responseData._embedded.venues) != undefined &&
    (await responseData._embedded.venues[0]) != undefined &&
    (await responseData._embedded.venues[0].name) != undefined &&
    (await responseData._embedded.venues[0].name) != "Undefined"
  ) {
    venueH2.classList.remove("none");
    venue.textContent = responseData._embedded.venues[0].name;
  } else {
    // venueH2.classList.add("none");
    venue.textContent = "";
  }

  //genre]
  if (
    (await responseData.classifications) != undefined &&
    (await responseData.classifications[0]) != undefined
  ) {
    genreH2.classList.remove("none");
    const classifications = responseData.classifications[0];
    let a = "";
    let b = "";
    let c = "";
    if (
      (await classifications.genre) != undefined &&
      (await classifications.genre.name) != "Undefined"
    ) {
      a = classifications.genre.name + " | ";
    }

    if (
      (await classifications.segment) != undefined &&
      (await classifications.segment.name) != "Undefined"
    ) {
      b = classifications.segment.name + " | ";
    }
    if (
      (await classifications.subGenre) != undefined &&
      (await classifications.subGenre.name) != "Undefined"
    ) {
      c = classifications.subGenre.name;
    }
    if (a == "" && b == "" && c == "") {
      genreH2.classList.add("none");
    } else {
      genre.textContent = a + b + c;
    }
  } else {
    // genreH2.classList.add("none");
    genre.textContent = "";
  }

  //priceRange
  if (
    (await responseData.priceRanges) != undefined &&
    (await responseData.priceRanges[0]) != undefined &&
    (await responseData.priceRanges[0].max) != undefined &&
    (await responseData.priceRanges[0].min) != undefined &&
    (await responseData.priceRanges[0].currency) != undefined
  ) {
    priceRangeH2.classList.remove("none");
    if (responseData.priceRanges[0].min == responseData.priceRanges[0].max) {
      priceRange.textContent =
        responseData.priceRanges[0].max +
        " " +
        responseData.priceRanges[0].currency;
    } else {
      priceRange.textContent =
        responseData.priceRanges[0].min +
        " - " +
        responseData.priceRanges[0].max +
        " " +
        responseData.priceRanges[0].currency;
    }
  } else {
    // priceRangeH2.classList.add("none");
    priceRange.textContent = "";
  }

  //ticketStatus
  if (
    (await responseData.dates) != undefined &&
    (await responseData.dates.status) != undefined &&
    (await responseData.dates.status) != "Undefined"
  ) {
    ticketStatusH2.classList.remove("none");
    ticketStatus.classList.remove("onsale");
    ticketStatus.classList.remove("offsale");
    ticketStatus.classList.remove("cancelled");
    ticketStatus.classList.remove("postponed");
    ticketStatus.classList.remove("rescheduled");
    const sellingSatus = responseData.dates.status.code;

    if (sellingSatus == "onsale") {
      ticketStatus.textContent = "On Sale";
      ticketStatus.classList.add("onsale");
    } else if (sellingSatus == "offsale") {
      ticketStatus.textContent = "Off Sale";
      ticketStatus.classList.add("offsale");
    } else if (sellingSatus == "cancelled") {
      ticketStatus.textContent = "Cancelled";
      ticketStatus.classList.add("cancelled");
    } else if (sellingSatus == "postponed") {
      ticketStatus.textContent = "Postponed";
      ticketStatus.classList.add("postponed");
    } else {
      //rescheduled
      ticketStatus.textContent = "Rescheduled";
      ticketStatus.classList.add("rescheduled");
    }
  } else {
    ticketStatusH2.classList.add("none");
    ticketStatus.textContent = "";
  }

  //buyTicket
  if ((await responseData.url) != undefined) {
    buyTicketH2.classList.remove("none");
    const ticktmasturl = responseData.url;
    buyTicket.innerHTML = `<a href=${ticktmasturl} class="ticketmasterurl"target="_blank">Ticketmaster</a>`;
  } else {
    buyTicketH2.classList.add("none");
    buyTicket.innerHTML = "";
  }
  showTable3Header();
  hideTable3();
  console.log(responseData);
  let nameOfVenue;
  if (
    (await responseData._embedded) != undefined &&
    (await responseData._embedded.venues) != undefined &&
    (await responseData._embedded.venues[0]) != undefined &&
    (await responseData._embedded.venues[0].name) != undefined &&
    (await responseData._embedded.venues[0].name) != "Undefined"
  ) {
    nameOfVenue = responseData._embedded.venues[0].name;
  }
  console.log(nameOfVenue);
  document
    .querySelector(".showDetailsButton")
    .addEventListener("click", showvenueDetails.bind(null, responseData));
}

// eventDetails("vvG10Z94XNA3TX");
// showvenueDetails("Dolby Theatre");
async function showvenueDetails(responseData) {
  hideTable3Header();
  showTable3();
  venueDetailspic.classList.remove("none");
  table3inner.classList.remove("smaller");
  table3.classList.remove("small");

  // let response = await axios.get(venueDetailsAPI + "/" + name);
  // let responseData = response.data;
  // console.log("venueDetails");
  // console.log(responseData);

  if ((await responseData._embedded) != undefined) {
    console.log(responseData._embedded.venues[0].name);
    venueDetailsHeader.innerHTML = responseData._embedded.venues[0].name;

    let alladdress;
    let query;

    if ((await responseData._embedded.venues) != undefined) {
      if ((await responseData._embedded.venues[0]) != undefined) {
        if ((await responseData._embedded.venues[0].url) != undefined) {
          moreevents.href = responseData._embedded.venues[0].url;
          console.log(responseData._embedded.venues[0].url);
        }
        //image
        venueDetailspic.src = "";
        if (
          (await responseData._embedded.venues[0].images) != undefined &&
          (await responseData._embedded.venues[0].images[0]) != undefined &&
          (await responseData._embedded.venues[0].images[0].url) != undefined &&
          (await responseData._embedded.venues[0].images[0].url) != "Undefined"
        ) {
          venueDetailspic.classList.remove("none");

          table3.classList.remove("small");
          table3inner.classList.remove("smaller");
          console.log("Remove None");
          venueDetailspic.src = responseData._embedded.venues[0].images[0].url;
        } else {
          table3.classList.add("small");
          table3inner.classList.add("smaller");
          console.log("here");
          venueDetailspic.classList.add("none");
          console.log("Add None");
        }

        if ((await responseData._embedded.venues[0].address) != undefined) {
          if (
            (await responseData._embedded.venues[0].address.line1) != undefined
          ) {
            // console.log(responseData._embedded.venues[0].address.line1);
            const firstword = responseData._embedded.venues[0].address.line1;
            alladdress = `${firstword}</br>`;
            query = firstword + " ";
          } else {
            const firstword = "N/A";
            alladdress = `${firstword}</br>`;
          }
        }
        if ((await responseData._embedded.venues[0].city) != undefined) {
          const secondword = responseData._embedded.venues[0].city.name;

          alladdress = alladdress + `${secondword} `;
          query = query + secondword + " ";
        } else {
          const secondword = "N/A";
          alladdress = alladdress + `${secondword} `;
        }
        if ((await responseData._embedded.venues[0].state) != undefined) {
          const thirdword = responseData._embedded.venues[0].state.stateCode;
          alladdress = alladdress + `${thirdword}</br>`;
          query = query + thirdword + " ";
        } else {
          const thirdword = "N/A";
          alladdress = alladdress + `${thirdword}</br>`;
        }
        if ((await responseData._embedded.venues[0].postalCode) != undefined) {
          const fourthword = responseData._embedded.venues[0].postalCode;
          alladdress = alladdress + `${fourthword}`;
          query = query + fourthword;
        } else {
          const fourthword = "N/A";
        }
      }
    }

    alladdressContent.innerHTML = alladdress;
    // console.log(query);
    const allGoogleMapAPI = googleMapAPI + query;
    openInGoogle.href = allGoogleMapAPI;
  }
}

async function submitHandler() {
  noResult.classList.add("none");
  hideTable2();
  hideTable3();
  hideTable3Header();
  // hideTable3();

  const inputOfKeyw = allInput[0].value;

  let inputOfDis = "10";

  if (allInput[1].value !== "") {
    inputOfDis = allInput[1].value;
  }

  const inputOfCat = allInput[2].value;
  let category;
  if (inputOfCat === "Music") {
    category = "KZFzniwnSyZfZ7v7nJ";
  } else if (inputOfCat === "Sports") {
    category = "KZFzniwnSyZfZ7v7nE";
  } else if (inputOfCat === "Arts & Theatre") {
    category = "KZFzniwnSyZfZ7v7na";
  } else if (inputOfCat === "Film") {
    category = "KZFzniwnSyZfZ7v7nn";
  } else if (inputOfCat === "Miscellaneous") {
    category = "KZFzniwnSyZfZ7v7n1";
  } else if (inputOfCat === "Default") {
    category = "";
  }

  const inputOfLoc = allInput[3].value;
  if (
    (autoGetLocation.checked === true || inputOfLoc !== "") &&
    inputOfKeyw !== ""
  ) {
    try {
      const geohashLoc = await Geo_IPLocation();
      //if no location
      if (geohashLoc == null) {
        hideTable1();
        hideTable2();
        noResult.classList.remove("none");
        return;
      }
      console.log(geohashLoc);
      let response = await axios.get(
        eventSearchAPI_NoSeg +
          "/" +
          geohashLoc +
          "/" +
          inputOfDis +
          "/" +
          inputOfKeyw
      );

      if (category !== "") {
        response = await axios.get(
          eventSearchAPI +
            "/" +
            geohashLoc +
            "/" +
            inputOfDis +
            "/" +
            inputOfKeyw +
            "/" +
            category
        );
        console.log("here not default");
      }
      console.log(response);

      clearElements(tableBody);

      // const fetchedData = response.data._embedded.events;
      // console.log(fetchedData);

      if (typeof response.data._embedded === "undefined") {
        hideTable1();
        hideTable2();
        // console.log(noResult);
        noResult.classList.remove("none");
      } else {
        // noResult.classList.add("none");
        const fetchedData = response.data._embedded.events;
        for (const data of fetchedData) {
          const addedData = document.importNode(temTable.content, true);
          let child1 = addedData.childNodes[1];
          //Date
          const temDate = child1.querySelector(".tem-date");
          if (
            data.dates.start.localDate == undefined &&
            data.dates.start.localTime == undefined
          ) {
            temDate.innerHTML = "N/A";
          } else {
            if (data.dates.start.localTime == undefined) {
              temDate.innerHTML = `${data.dates.start.localDate}`;
            } else if (data.dates.start.localDate == undefined) {
              temDate.innerHTML = `${data.dates.start.localTime}`;
            } else {
              temDate.innerHTML = `${data.dates.start.localDate}</br> 
                                 ${data.dates.start.localTime}`;
            }
          }

          // console.log(temDate);
          //Icon
          const temIcon = child1.querySelector(".tem-icon");
          if (
            data.images[0].url != undefined &&
            data.images[0].url != "Undefined"
          ) {
            temIcon.innerHTML = `<img src = ${data.images[0].url} class="addedimage"/>`;
          } else {
            temIcon.innerHTML = "N/A";
          }

          // console.log(temIcon);
          //Event
          const temEvent = child1.querySelector(".tem-event");
          if (data.name != undefined && data.name != "Undefined") {
            temEvent.innerHTML = `<a href="#table2" class="toTable2">${data.name}</a>`;
          } else {
            temEvent.innerHTML = "N/A";
          }

          // console.log(temEvent.querySelector("a"));
          temEvent
            .querySelector("a")
            .addEventListener("click", eventDetails.bind(null, data.id));

          //Genre
          const temGenre = child1.querySelector(".tem-genre");
          if (
            data.classifications[0].segment.name != undefined &&
            data.classifications[0].segment.name != "Undefined"
          ) {
            temGenre.textContent = data.classifications[0].segment.name;
          } else {
            temGenre.textContent = "N/A";
          }

          //venue
          const temVenue = child1.querySelector(".tem-venue");
          if (
            data._embedded.venues[0].name != undefined &&
            data._embedded.venues[0].name != "Undefined"
          ) {
            temVenue.textContent = data._embedded.venues[0].name;
          } else {
            temVenue.textContent = "N/A";
          }

          tableBody.append(addedData);
          // console.log(tableBody);
        }
        showTable1();
        table1.scrollIntoView();

        data_sort = tableBody.querySelectorAll("tr");
      }
    } catch (error) {
      // alert(error.message);
      console.log(error.message);
    }
  }
}

function clearHandler() {
  hideTable1();
  hideTable2();
  hideTable3();
  hideTable3Header();
  noResult.classList.add("none");
  allInput[0].value = "";
  allInput[1].value = "";
  allInput[2].value = "Default";
  allInput[3].checked = false;
  allInput[4].value = "";
  allInput[4].classList.remove("disable_section");
  allInput[4].disabled = false;
  const showInput = document.getElementById("div_locationInput");
  showInput.classList.remove("none");
}

// const geohashLoc = Geo_IPLocation();
// console.log(geohashLoc);
async function Geo_IPLocation() {
  if (autoGetLocation.checked === true) {
    const response = await axios.get(IPInfoAPI);
    //checked here
    const location = await response.data["loc"].split(",").map(function (item) {
      return parseFloat(item);
    });
    const lat = location[0];
    const lng = location[1];
    const geohash = Geohash.encode(lat, lng, 5);
    return geohash;
  } else {
    const inputOfLoc = document.getElementById("locationInput").value;
    // const inputOfLoc = "University of Southern California";
    const GeoApiParams = { address: inputOfLoc, key: GeocodingAPIKey };
    const response = await axios.get(preGeocodingAPI, { params: GeoApiParams });
    // console.log(response);
    if (response.data.status === "ZERO_RESULTS") return null;
    else {
      const lat = response.data.results[0].geometry.location.lat;
      const lng = response.data.results[0].geometry.location.lng;
      const geohash = Geohash.encode(lat, lng, 5);
      return geohash;
    }
  }
}

function clearElements(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

autoGetLocation.addEventListener("change", autoDetectLocationHandler);

clearButton.addEventListener("click", clearHandler);

searchButton.addEventListener("click", submitHandler);
