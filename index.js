const keyPublishable = process.env.PUBLISHABLE_KEY || "pk_test_uIyy0QTwMOFQQxnZjiGDRDie";
const keySecret = process.env.SECRET_KEY || "sk_test_GDBP0uv3YkjVGsc8J0UPj5bp";
var port = process.env.PORT || 8080;

const app = require("express")();
const stripe = require("stripe")(keySecret);
const bodyParser = require('body-parser');

app.set("view engine", "pug");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", (req, res) =>
  res.render("index.pug", {keyPublishable}));

app.post("/charge", (req, res) => {
  console.log(req.body);
  let amount = req.body.amount;
  let description = req.body.description;
  
  stripe.customers.create({
    email: req.body.email,
    source: req.body.source
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: description,
      currency: "cad",
      customer: customer.id
    }))
  .catch(err => res.send(err))
  .then(charge => res.send(charge));
});

app.listen(port);