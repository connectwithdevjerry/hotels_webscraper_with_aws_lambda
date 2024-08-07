const chromium = require("chrome-aws-lambda");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
// var locateChrome = require("locate-chrome");
const {
  PutItemCommand,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");
const proxyChain = require("proxy-chain");

process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = "1";
let options = {
  region: "us-west-2",
};

const client = new DynamoDBClient(options);
const dynamodbTableName = "hotels";
const hotel = "/hotel";
const scrape = "/scrape";

exports.handler = async function (event) {
  let response;
  if (event.httpMethod === "POST" && event.path === hotel) {
    response = await createHotel(JSON.parse(event.body));
  } else if (event.httpMethod === "DELETE" && event.path === hotel) {
    response = await deleteHotel(JSON.parse(event.body).hotel_id);
  } else if (event.httpMethod === "POST" && event.path === scrape) {
    response = await scrapeAndGetHotelData(JSON.parse(event.body));
    // response = await scrapeAndGetHotelData(event.body);
  } else {
    response = {
      statusCode: 400,
      errorMsg: "endpoint not handled!",
      httpMethod: event,
      path: event.path,
    };
  }
  return response;
};

// const scrapeAndGetHotelData = async (body) => {
//   let { hotel_id, arrival_date, departure_Date } = body;

//   const response = { statusCode: 200 };
//   let data;

//   if (hotel_id === 1767) {
//     data = await cancun(arrival_date, departure_Date);
//   } else if (hotel_id === 21) {
//     data = await wymara_resort(arrival_date, departure_Date);
//   } else if (hotel_id === 78) {
//     data = await nizuc(arrival_date, departure_Date);
//   } else if (hotel_id === 17) {
//     data = await grace_bay_club(arrival_date, departure_Date);
//   } else {
//     response.statusCode = 404;
//     data = {
//       errMsg: "wrong input",
//     };
//   }

//   response.body = JSON.stringify(data);
//   return response;
// };

// const deleteHotel = async (hotel_id) => {
//   const response = { statusCode: 200 };
//   try {
//     const params = {
//       TableName: dynamodbTableName,
//       Key: marshall({ hotel_id: Number(hotel_id) }),
//     };
//     let deleteResult = await client.send(new DeleteItemCommand(params));
//     // console.log({ deleteResult });
//     response.body = JSON.stringify({
//       message: "successfully deleted hotel.",
//       deleteResult,
//     });
//   } catch (e) {
//     console.error(e);
//     response.statusCode = 500;
//     response.body = JSON.stringify({
//       message: "Failed to deleted hotel",
//       errorMsg: e.message,
//       errorStack: e.stack,
//     });
//   }
//   return response;
// };

// const createHotel = async (body) => {
//   let { hotel_name, hotel_id, hotel_url } = body;
//   const para = {
//     hotel_id,
//     hotel_name,
//     hotel_url,
//   };
//   const response = { statusCode: 200 };
//   try {
//     const params = {
//       TableName: dynamodbTableName,
//       Item: marshall(para || {}),
//     };
//     const createResult = await client.send(new PutItemCommand(params));
//     // console.log({ createResult });
//     response.body = JSON.stringify({
//       message: "successfully created hotel.",
//       createResult,
//     });
//   } catch (e) {
//     console.error(e);
//     response.statusCode = 500;
//     response.body = JSON.stringify({
//       message: "Failed to create hotel",
//       errorMsg: e.message,
//       errorStack: e.stack,
//     });
//   }
//   return response;
// };

// // hotels
// const grace_bay_club = async (
//   arrival_date = "2024-01-13",
//   departure_Date = "2024-01-20"
// ) => {
//   let result = await (async (arrival_date, departure_Date) => {
//     const oldProxyUrl =
//       "http://webmaster_ultimatejetvacations_com-country-us:fr8xz368j0@gate.nodemaven.com:8080";
//     const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);
//     // console.log({ newProxyUrl });
//     // Launch the browser and open a new blank page
//     let args = chromium.args;
//     console.log({ args });
//     const browser = await chromium.puppeteer.launch({
//       args: [`--proxy-server=${newProxyUrl}`],
//       defaultViewport: chromium.defaultViewport,
//       executablePath: await chromium.executablePath,
//       headless: false,
//       ignoreHTTPSErrors: true,
//     });
//     const page = await browser.newPage();
//     await page.setViewport({ width: 1366, height: 1024 });
//     await page.setDefaultNavigationTimeout(120000);

//     // let [day0, mth0, yr0] = arrival_date.split("-");
//     // let [day1, mth1, yr1] = departure_Date.split("-");
//     // let arrive = `${yr0}-${mth0}-${day0}`;
//     // let depart = `${yr1}-${mth1}-${day1}`;

//     let website_url = `https://be.synxis.com/?_ga-ft=1bNOi3.0.0.0.0.3ZPUE9-5h0-4io-BlJ-Akmnwggi.0.1&_gl=1*1bmc59b*_ga*MjA5OTcxNjkxOC4xNzAwNjI0MzA5*_ga_FDTY66CS39*MTcwMDYyODk2Mi4yLjEuMTcwMDYyOTI0Ny42MC4wLjA.&adult=1&arrive=${arrival_date}&chain=24447&child=0&config=leading1&currency=USD&depart=${departure_Date}&hotel=6905&level=hotel&locale=en-US&roomcategory=JR%2C1BR%2C2BR%2C3BR%2C4BR%2C5BR&rooms=1&src=30&theme=leading1`;

//     // Navigate the page to a URL
//     await page.goto(website_url);

//     const allRooms = await page.evaluate(() =>
//       Array.from(
//         document.querySelectorAll(
//           ".thumb-cards_groupedCards.app_col-sm-12.app_col-md-12.app_col-lg-12 > div > div > div.app_col-sm-12.app_col-md-8.app_col-lg-8"
//         ),
//         (e) => ({
//           room_name: e.querySelector("div.thumb-cards_cardHeader > h3")
//             ?.innerText,
//           rates: Array.from(
//             e?.querySelectorAll(
//               ".thumb-cards_rate.thumb-cards_show .thumb-cards_priceMessages .thumb-cards_price"
//             ),
//             (ev) => ev?.innerText
//           ),
//           sleeps: e.querySelector(
//             ".guests-and-roomsize_roomProperties .guests-and-roomsize_item.guests-and-roomsize_guests"
//           )?.innerText,
//           bed: e.querySelector(
//             ".guests-and-roomsize_item.guests-and-roomsize_bed"
//           )?.innerText,
//           size: e
//             .querySelector(".guests-and-roomsize_item.guests-and-roomsize_size")
//             ?.innerText.replace("\nsquare feet", ""),
//         })
//       )
//     );

//     if (allRooms.length > 0) {
//       console.log({ status: "sucess", res: allRooms });
//     } else {
//       console.log({ status: "error", res: "Could not fetch page" });
//     }

//     // Type into search box
//     let title = await page.title();

//     // console.log(title);

//     await browser.close();
//     // await process.exit();
//     return { rooms: allRooms, title };
//   })(arrival_date, departure_Date);

//   // console.log(result);
//   return result;
// };

// const sugar_beach = async (
//   arrival_date = "2024-01-13",
//   departure_Date = "2024-01-20"
// ) => {
//   let result = await (async (arrival_date, departure_Date) => {
//     // const executablePath =
//     //   (await new Promise((resolve) => locateChrome((arg) => resolve(arg)))) ||
//     //   "";
//     const oldProxyUrl =
//       "http://webmaster_ultimatejetvacations_com-country-us:fr8xz368j0@gate.nodemaven.com:8080";
//     const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);
//     // console.log({ newProxyUrl });
//     // Launch the browser and open a new blank page
//     let browser = await chromium.puppeteer.launch({
//       args: [`--proxy-server=${newProxyUrl}`],
//       defaultViewport: chromium.defaultViewport,
//       executablePath: await chromium.executablePath,
//       // executablePath: executablePath,
//       headless: false,
//       ignoreHTTPSErrors: true,
//     });
//     const page = await browser.newPage();
//     await page.setViewport({ width: 1366, height: 1024 });
//     await page.setDefaultNavigationTimeout(120000);

//     let website_url = `https://reservations.viceroyhotelsandresorts.com/?_ga=2.63980905.754880256.1697504574-1226995346.1697504574&adult=1&arrive=${arrival_date}&chain=1003&child=1&childages=17&currency=USD&depart=${departure_Date}&hotel=22215&level=hotel&locale=en-US&rooms=1`;

//     // Navigate the page to a URL4
//     await page.goto(website_url);

//     let roomVal = await page.evaluate(() => {
//       let el = document.querySelector(
//         "#mainContent > div > div.app_col-sm-12.app_col-md-12.app_col-lg-12 > section"
//       );
//       return el ? el.innerText : "";
//     });

//     console.log({ roomVal });

//     const allRooms = await page.evaluate(() =>
//       Array.from(document.querySelectorAll(".thumb-cards_room"), (e) => ({
//         room_name: e.querySelector("h3.app_subheading2")?.innerText,
//         rates: e.querySelector(".thumb-cards_right .thumb-cards_price")
//           ?.innerText,
//         sleeps: e.querySelector(
//           ".guests-and-roomsize_item.guests-and-roomsize_guests"
//         )?.innerText,
//         bed: e.querySelector(
//           ".guests-and-roomsize_item.guests-and-roomsize_bed"
//         )?.innerText,
//         size: e
//           .querySelector(".guests-and-roomsize_item.guests-and-roomsize_size")
//           ?.innerText.replace("\nsquare feet", ""),
//       }))
//     );

//     console.log({ allRooms });

//     // Type into search box
//     let title = await page.title();

//     // console.log(title);

//     await browser.close();
//     // await process.exit();
//     return roomVal.trim().length > 0
//       ? { res: roomVal }
//       : { rooms: allRooms, title };
//   })(arrival_date, departure_Date);

//   // console.log({ result });
//   return result;
// };

// const nizuc = async (
//   arrival_date = "2024-01-12",
//   departure_Date = "2024-01-20"
// ) => {
//   let result = await (async (arrival_date, departure_Date) => {
//     const oldProxyUrl =
//       "http://webmaster_ultimatejetvacations_com-country-us:fr8xz368j0@gate.nodemaven.com:8080";
//     const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);
//     // console.log({ newProxyUrl });

//     // Launch the browser and open a new blank page
//     let browser = await chromium.puppeteer.launch({
//       args: [`--proxy-server=${newProxyUrl}`],
//       defaultViewport: chromium.defaultViewport,
//       executablePath: await chromium.executablePath,
//       headless: false,
//       ignoreHTTPSErrors: true,
//     });

//     const page = await browser.newPage();
//     await page.setViewport({ width: 1366, height: 1024 });
//     await page.setDefaultNavigationTimeout(120000);

//     let website_url = `https://be.synxis.com/?adult=2&arrive=${arrival_date}&chain=10237&child=0&currency=USD&depart=${departure_Date}&hotel=58283&level=hotel&locale=en-US&rooms=1`;

//     // Navigate the page to a URL
//     await page.goto(website_url);

//     const allRooms = await page.evaluate(() =>
//       Array.from(
//         document.querySelectorAll(".app_col-sm-12.app_col-md-8.app_col-lg-8"),
//         (e) => ({
//           room_name: e.querySelector("h2.app_heading1")?.innerText,
//           rates: Array.from(
//             e.querySelectorAll(".thumb-cards_right .thumb-cards_price"),
//             (ev) => ev?.innerText
//           ),
//           sleeps_bed_size: e.querySelector(
//             ".thumb-cards_urgencyTriggerAndRoomInfo"
//           ).innerText,
//         })
//       )
//     );

//     if (allRooms.length > 0) {
//       console.log({ status: "sucess", res: allRooms });
//     } else {
//       console.log({ status: "error", res: "Could not fetch page" });
//     }

//     // Type into search box
//     let title = await page.title();

//     console.log(title);

//     await browser.close();
//     // await process.exit();
//     return { rooms: allRooms, title };
//   })(arrival_date, departure_Date);

//   // console.log(result);
//   return result;
// };

// const wymara_resort = async (
//   arrival_date = "2024-01-13",
//   departure_Date = "2024-01-20"
// ) => {
//   let result = await (async (arrival_date, departure_Date) => {
//     const oldProxyUrl =
//       "http://webmaster_ultimatejetvacations_com-country-us:fr8xz368j0@gate.nodemaven.com:8080";
//     const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);
//     // console.log({ newProxyUrl });
//     // Launch the browser and open a new blank page
//     // let args = chromium.args;
//     // console.log(args)
//     const browser = await chromium.puppeteer.launch({
//       args: [`--proxy-server=${newProxyUrl}`],
//       defaultViewport: chromium.defaultViewport,
//       executablePath: await chromium.executablePath,
//       headless: true,
//       ignoreHTTPSErrors: true,
//     });
//     const page = await browser.newPage();
//     await page.setViewport({ width: 1366, height: 1024 });
//     await page.setDefaultNavigationTimeout(120000);

//     let website_url = `https://be.synxis.com/?chain=24447&hotel=35896&arrive=${arrival_date}&depart=${departure_Date}`;

//     // Navigate the page to a URL
//     await page.goto(website_url);

//     const allRooms = await page.evaluate(() =>
//       Array.from(document.querySelectorAll(".thumb-cards_details"), (e) => ({
//         room_name: e.querySelector("h3.app_subheading2")?.innerText,
//         rates: Array.from(
//           e.querySelectorAll(".thumb-cards_right .thumb-cards_price"),
//           (ev) => ev?.innerText
//         ),
//         sleeps_bed_size: e.querySelector(
//           ".thumb-cards_urgencyTriggerAndRoomInfo"
//         ).innerText,
//         description: e.querySelector(".thumb-cards_roomShortDesc").innerText,
//       }))
//     );

//     if (allRooms.length > 0) {
//       console.log({ status: "sucess", res: allRooms });
//     } else {
//       console.log({ status: "error", res: "Could not fetch page" });
//     }

//     // Type into search box
//     let title = await page.title();

//     // console.log(title);

//     // await process.exit();
//     await browser.close();
//     return { rooms: allRooms, title };
//   })(arrival_date, departure_Date);

//   return result;
// };

// const cancun = async (
//   arrival_date = "2024-01-13",
//   departure_Date = "2024-01-20"
// ) => {
//   let result = await (async (arrival_date, departure_Date) => {
//     // Launch the browser and open a new blank page
//     const oldProxyUrl =
//       "http://webmaster_ultimatejetvacations_com-country-us:fr8xz368j0@gate.nodemaven.com:8080";
//     const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);
//     // console.log({ newProxyUrl });
//     let browser = await chromium.puppeteer.launch({
//       args: [`--proxy-server=${newProxyUrl}`],
//       defaultViewport: chromium.defaultViewport,
//       executablePath: await chromium.executablePath,
//       headless: true,
//       ignoreHTTPSErrors: true,
//     });

//     //configuration
//     const page = await browser.newPage();
//     await page.setViewport({ width: 0, height: 0 });
//     await page.setDefaultNavigationTimeout(120000);

//     let arrival = arrival_date;
//     let departure = departure_Date;
//     let [year, mth, day] = arrival.split("-");
//     let [yearD, mthD, dayD] = departure.split("-");
//     mth = mth[0] == "0" ? mth[1] : mth;
//     mthD = mthD[0] == "0" ? mthD[1] : mthD;
//     day = day[0] == "0" ? day[1] : day;
//     dayD = dayD[0] == "0" ? dayD[1] : dayD; // in cases of days with singular values

//     let website_url = `https://bookings-cancun.garzablancaresort.com/en/bookcore/availability/rooms/gblancacancun/`;

//     // Navigate the page to a URL
//     await page.goto(website_url);

//     await page.click(
//       "#roi-search-engine > form > div.roi-search-engine__item.roi-search-engine__item--dates > button"
//     ),
//       await page.waitForSelector("#roicalendar");

//     // arrival select
//     const arrivalSelect = await page.$$(
//       `td.roi-cal__day.js-calendar-day[data-day='${day}'][data-month='${
//         mth - 1
//       }'][data-year='${year}']:not([data-weekday='null'])`
//     );

//     if (arrivalSelect.length > 0) {
//       await arrivalSelect[0].click();
//     } else {
//       console.log("No matching element found");
//     }

//     // departure select
//     const departureSelect = await page.$$(
//       `td.roi-cal__day.js-calendar-day[data-day='${dayD}'][data-month='${
//         mthD - 1
//       }'][data-year='${yearD}']:not([data-weekday='null'])`
//     );

//     if (departureSelect.length > 0) {
//       await departureSelect[0].click();
//     } else {
//       console.log("No matching element found");
//     }

//     //click 'select dates'
//     await page.click(".roi-cal__close.js-calendar-close");
//     // await Promise.all([
//     //   page.waitForNavigation(),
//     //   page.click(".roi-search-engine__field.roi-search-engine__field--action"),
//     // ]);
//     await page.click(
//       ".roi-search-engine__field.roi-search-engine__field--action"
//     );

//     // await page.waitForNavigation();
//     await new Promise((resolve) => setTimeout(resolve, 50000));

//     // to check if we have or do not have a result
//     let roomVal = await page.evaluate(() => {
//       let el = document.querySelector(
//         "#hoteles_sin_disponiblidad > div.no_dispo_titulo_wrap"
//       );
//       return el ? el.innerText : "";
//     });

//     const all_rooms = await page.evaluate(() =>
//       Array.from(document?.querySelectorAll(".habitacion"), (e) => ({
//         room_name: e?.querySelector("h3.hab_titulo")?.innerText,
//         rates_1: Array.from(
//           e?.querySelectorAll(
//             // ".contenedor-precio.multiprecio.precio-total.roi-boards-total-price__amount"
//             ".roi-boards__block.roi-boards__block--average-price"
//           ),
//           (ev) => ev?.innerText
//         ).slice(1, 3),
//         rates_2: Array.from(
//           e?.querySelectorAll(
//             ".contenedor-precio.multiprecio.precio-total.roi-boards-total-price__amount"
//           ),
//           (ev) => ev?.innerText
//         ).slice(0, 2),
//         // sleeps_bed_size: e?.querySelector(".thumb-cards_urgencyTriggerAndRoomInfo")
//         //   .innerText,
//         description: e
//           ?.querySelector(
//             "div.hab_head > div.hab_head_info.col-lg-8.col-md-8.col-sm-8.col-xs-12"
//           )
//           ?.innerText.replace("\n", "")
//           .replace("See more", ""),
//       }))
//     );

//     // modify allRooms
//     const allRooms = [];

//     for (i = 0; i < all_rooms.length; i++) {
//       const { room_name, rates_1, rates_2, description } = all_rooms[i];
//       let errMsg = "not available";
//       let defaultCurrency = "US$";
//       allRooms.push({
//         room_name,
//         description,
//         rates: [
//           {
//             rate_code: "room_only",
//             rate_description: "AVERAGE PRICE/NIGHT",
//             price: rates_1.length > 0 ? rates_1[0].split(" ")[1] : errMsg,
//             currency:
//               rates_1.length > 0 ? rates_1[0].split(" ")[0] : defaultCurrency,
//           },
//           {
//             rate_code: "all_inclusive",
//             rate_description: "AVERAGE PRICE/NIGHT",
//             price: rates_1.length > 0 ? rates_1[1].split(" ")[1] : errMsg,
//             currency:
//               rates_1.length > 0 ? rates_1[1].split(" ")[0] : defaultCurrency,
//           },
//           {
//             rate_code: "all_inclusive",
//             rate_description: "TOTAL",
//             price: rates_2.length > 0 ? rates_2[1].split(" ")[1] : errMsg,
//             currency:
//               rates_2.length > 0 ? rates_2[1].split(" ")[0] : defaultCurrency,
//           },
//           {
//             rate_code: "room_only",
//             rate_description: "TOTAL",
//             price: rates_2.length > 0 ? rates_2[0].split(" ")[1] : errMsg,
//             currency:
//               rates_2.length > 0 ? rates_2[0].split(" ")[0] : defaultCurrency,
//           },
//         ],
//       });
//     }

//     if (allRooms.length > 0) {
//       console.log({ status: "sucess", res: allRooms });
//     } else {
//       console.log({
//         status: "error",
//         res: "Could not fetch page",
//         websiteErrorMsg: roomVal,
//       });
//     }

//     // Type into search box
//     let title = await page.title();

//     // console.log(title);

//     // await process.exit();
//     await browser.close();
//     let response = { rooms: allRooms, title };
//     return roomVal ? { res: roomVal } : response;
//   })(arrival_date, departure_Date);
//   // console.log(result);

//   return result;
// };

// // sugar_beach("2024-01-17", "2024-01-25"); // excluded by client
// // cancun("2024-01-17", "2024-01-25"); // works perfectly in both modes
// // wymara_resort("2024-01-17", "2024-01-25"); // works perfectly in both modes
// // nizuc("2024-01-17", "2024-01-25"); // works perfectly in both modes
// grace_bay_club("2024-01-22", "2024-01-27"); // works perfectly in both modes
