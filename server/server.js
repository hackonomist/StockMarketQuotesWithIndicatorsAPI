var express = require('express');
var bodyParser = require('body-parser');
var earningJobs = require('./services/earnings.jobs');
var quotes = require('./services/quotes');
var cors = require('cors');

quotes.getHistoricalQuotes('AAPL', '2015-12-01', '2016-12-31');

console.log("hey");
var { StockEarning } = require('./models/stockEarning');
var { StockQuote } = require('./models/stockQuote');
var quotes = require('./services/quotes');

var app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.get('/quotes', (req, res) => {
  StockQuote.find().then((stockQuote) => {
    res.send(stockQuote);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/earnings', (req, res) => {
  var stockEarning = new StockEarning({
    symbol: req.body.symbol
  });

  stockEarning.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/earnings', (req, res) => {
  StockEarning.find().then((earnings) => {
    res.send(earnings);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/earnings/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  StockEarning.findById(id).then((earning) => {
    if(!earning) {
      return res.status(404).send();
    }

    res.send({earning});
  }).catch((e) => {
    res.status(400).send();
  });
})

app.listen(port, () => {
  console.log(`Started up at port ${port}`)
});

module.exports = { app };