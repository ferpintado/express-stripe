const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
var port = process.env.PORT || 8080;

const app = require("express")();
const stripe = require("stripe")(keySecret);

app.set("view engine", "pug");
app.use(require("body-parser").urlencoded({extended: false}));

app.get("/", (req, res) =>
  res.render("index.pug", {keyPublishable}));

app.post("/charge", (req, res) => {
  let amount = req.body.amount;
  let description = req.body.description;
  
  stripe.customers.create({
    email: req.body.stripeEmail,
    card: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: description,
      currency: "cad",
      customer: customer.id
    }))
  .catch(err => res.json(err))
  .then(charge => res.json(charge));
});

app.listen(port);