const got = require("got");
const fs = require("fs");
const http = require("http");

const fred = async (url, filename) => {
  const got = require("got");
  const fs = require("fs");

  const responsePromise = got(url);
  const bufferPromise = responsePromise.buffer();

  const [response, buffer, json] = await Promise.all([
    responsePromise,
    bufferPromise
  ]);

  buff = Buffer.from(buffer, "base64");
  console.log("Writing to file ", filename);
  fs.writeFileSync(filename, buff);

  // `response` is an instance of Got Response
  // `buffer` is an instance of Buffer
  // `json` is an object
};

// "ABY","AC3","ACC","ACCO","ACE1","ADA","AERGO","AKITA","ALF","ALPHA","ALU","AMB","AMIS","ANTC","APW","ARC","ARENA","ARK","ATOM","AVA","AVAX","BAKE","BAND","BANK","BCD","BCH","BCN","BEZOGE","BIFIF","BIST","BITUSD","BKX","BLC","BLK","BLOCK","BMT","BNB","BNT","BOSON","BRO","BSD","BSOCIAL","BSTK","BSV1","BTCRED","BTE","BTG","BTM","BTPL","BTS","BTTF","BURGER","BURST","CABS","CAKE","CAN1","CANYA","CASH","CBDC","CC","CDN","CEL","CEUR","CFD","CHIHUA","CHINU","CHR","CHZ","CJ","CJC","CKB","CKC","CL","CLAM"
//
// ,"CLOAK","CLU","CMC","CMT","CND","COCK","COMB","COMFI","COMP","CORGI","CRAIG","CRD","CRV","CSPR","CTC","CTX1","CUBE","CUBE1","DAI","DARK","DECRED","DEFT","DES","DEUR","DFND","DFYN","DISK","DODO","DOGACOIN","DOGE","EASY","EFT","ELA","ELECTRONEUM","ELF","ELTCOIN","EMB1","EMC2","ENG","EOS","ERO","ETC","ETH","ETP","EXIT","EXP","FCL,"FEAR","FFA","FIRO","FLASH","FLOT","FLUX","FLX","FNT","FRD","FTC","GAME","GAS","GBYTE","GDT","GGS","GLT","GNOSIS","GOTX","GRIN","GRS","GT","GUP","GXC","GYEN","HALLO","HAZE","HBAR","HBT","HCASH","HILL","HORIZONSTATE","HOT","HOTCROSS","HPB","HQX","HT","HUN","HXT","ICN","ICP","ICX","IMPULSE","IND","INJ","INXT","IOC","IOST","IOTA_LOGO","IPL","ITT","JANE","JINDOGE","KALLY","KAT","KAVA","KBR","KEI","KENCOIN","KGC","KMD","KUB","LABS","LOCC","LOWB","LSK","LTC","LUNE","LXC","MAN","MASS","MAY","MBT","MDH","MEDIA","MFS","MINEX","MLITE","MOAC","MOGUL","MOOV","MSRA","MTC","NAS","NAV","NBL","NEBL","NEO","NEXUS",

// "NGC","NMC","NMS","NMT","NRO","NRS","NSBT","NULS","NVC","NXT","OCEAN","OCTO","OGN","OKB","OMES","OMG","ONT","ORBS","ORLY","PARA","PAXG","PEERCOIN","PGN","PHB","PIE","PIVX","PLAY","PLE","PNL","POA","POLX","POT","PRL","QKC","QLC","QQQ","QTUM","RAD","RAIF","RBTC","RDD","REC","REMME","REN",

// "REQ,"RFL","RKC","RLC","RLY","RUSH","RVN","SAFEMOON","SANSHU","SCORE","SDAO","SGR","SHADE","SHIFT","SHIH","SHND","SIACON","SIBCOIN","SIFT",

// "SKY,"SLS","SMART2","SNX","SOLO","SPT","SQP","SRA","START","STEEM","STRAX","TATO1","TCAP","TES","TFUEL","TKINU","TMC","TOKENSTARS","TOM","TPG","TRIP","TRR","TRX","TWT","UBI","UBQ","UFO",
//
//
// "UFR,"UGT","UPCO2","USDAP","USDN","USHIBA","UTN","VEN","VIA","VSX","VTC","WAN","WAVES","WAXP","WEBPNET"-RESIZEIMAGE,"WELL","WIN","WMT","WTC","WXT","XAI","XAS","XDN","XEM","XFT","XGB","XLB","XLM","XMF","XMR","XRP","XTZ","XVG","XWC","YFII","YFX","ZCG","ZCOR","ZEC","ZECD","ZEL",
// "ZEP,"ZIL","ZJLT","ZOOT,"ZUSD","ZWAP","ZYD","

try {
  const data = fs.readFileSync("../src/coinlist.json", "utf8");

  // parse JSON string to JSON object
  const coins = JSON.parse(data);
  let count = 0;
  let excel = true;
  // print all databases
  Object.keys(coins.Data).forEach(async coinDataIndex => {
    count++;
    console.log(`TOKEN: ${coins.Data[coinDataIndex]["Symbol"]}`);
    console.log(`${coins.Data[coinDataIndex]["ImageUrl"]}`);

    let cIndex = coinDataIndex;
    // if (coins.Data[coinDataIndex]["Symbol"] == "ARDR") excel = true;

    let url = `http://www.cryptocompare.com${coins.Data[coinDataIndex]["ImageUrl"]}`;
    console.log("Url to fetch:", url);

    if (coins.Data[cIndex] && coins.Data[cIndex]["ImageUrl"]) {
      let index = coins.Data[cIndex]["ImageUrl"].lastIndexOf("/") + 1;
      if (index > 0) {
        let filename = `${coins.Data[cIndex]["ImageUrl"].substring(index)}`;
        await fred(url, `./img/${filename}`);
      }
    }

    // if (count > 10) {
    //   return;
    // }
  });
} catch (err) {
  console.log(`Error reading file from disk: ${err}`);
}

// var request = require("request").defaults({ encoding: null });
//
// if (count == 1) {
//   try {
//     const response = await got(url);
//     console.log("Got response from ", url);
//     let filename = `${coins.Data[coinDataIndex]["ImageUrl"].substring(
//       coins.Data[coinDataIndex]["ImageUrl"].lastIndexOf("/") + 1
//     )}`;
//
//     var buffer = Buffer.from(response.body, "base64");
//     console.log("Writing to file ", filename);
//     console.log("Writing to file ", response.body);
//     fs.writeFileSync(filename, buffer);
//   } catch (error) {
//     console.log(error.response.body);
//     //=> 'Internal server error ...'
//   }
// }

// if (count > -1) {
//   await request.get(url, function(err, res, body) {
//     //process exif here
//     let data = Buffer.from(body, "base64");
//     console.log("Data length:", data.length);
//     let filename = `${coins.Data[coinDataIndex]["ImageUrl"].substring(
//       coins.Data[coinDataIndex]["ImageUrl"].lastIndexOf("/") + 1
//     )}`;
//     // response body
//
//     console.log("Writing to file ", filename);
//     fs.writeFileSync(filename, data);
//   });
// }

// if (excel) {
//   http.get(url, response => {
//     let chunks_of_data = [];
//
//     response.on("data", fragments => {
//       console.log(".");
//       chunks_of_data.push(fragments);
//     });
//
//     response.on("end", () => {
//       let chunks = [].concat.apply([], chunks_of_data);
//       let data = Buffer.from(chunks, "base64");
//       console.log("Data length:", data.length);
//       let filename = `${coins.Data[coinDataIndex]["ImageUrl"].substring(
//         coins.Data[coinDataIndex]["ImageUrl"].lastIndexOf("/") + 1
//       )}`;
//       // response body
//
//       console.log("Writing to file ", filename);
//       fs.writeFileSync(filename, data);
//     });
//
//     response.on("error", error => {
//       console.log(error);
//     });
//   });
// }

// if (count > 1) {
//   throw "Done";
// }
