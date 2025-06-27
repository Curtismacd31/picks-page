const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const app = express();
const DATA_PATH = path.join(__dirname, "data", "data.json");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: true
}));

// Load or initialize data.json
function loadData() {
  if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify({ users: [], picks: {}, tickets: {} }, null, 2));
  return JSON.parse(fs.readFileSync(DATA_PATH));
}
function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// Routes
app.get("/", (req, res) => res.redirect("/login"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("dashboard", { user: req.session.user });
});

// Auth
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const data = loadData();
  const user = data.users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) return res.send("Invalid login");
  req.session.user = { username: user.username, displayName: user.displayName };
  res.redirect("/dashboard");
});

app.post("/api/auth/register", (req, res) => {
  const { username, password, displayName } = req.body;
  const data = loadData();
  if (data.users.find(u => u.username === username)) return res.send("Username already exists");
  const hashed = bcrypt.hashSync(password, 10);
  data.users.push({ username, password: hashed, displayName });
  saveData(data);
  res.redirect("/login");
});

// Picks
app.post("/api/picks/save", (req, res) => {
  const { username, trackName, date, races } = req.body;
  const data = loadData();
  const key = `${username}|${date}|${trackName}`;
  data.picks[key] = races;
  saveData(data);
  res.json({ success: true });
});

app.get("/api/picks/:username/:trackName/:date", (req, res) => {
  const data = loadData();
  const key = `${req.params.username}|${req.params.date}|${req.params.trackName}`;
  res.json(data.picks[key] || []);
});

// Tickets
app.post("/api/tickets/save", (req, res) => {
  const { username, trackName, date, tickets } = req.body;
  const data = loadData();
  const key = `${username}|${date}|${trackName}`;
  data.tickets[key] = tickets;
  saveData(data);
  res.json({ success: true });
});

app.get("/api/tickets/:username/:trackName/:date", (req, res) => {
  const data = loadData();
  const key = `${req.params.username}|${req.params.date}|${req.params.trackName}`;
  res.json(data.tickets[key] || []);
});

//LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});


app.listen(3000, () => console.log("Server running on http://localhost:3000"));
