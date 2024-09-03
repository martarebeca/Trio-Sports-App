var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var activityRouter = require("./routes/activity");
var adminRouter = require("./routes/admin");
var sportsRouter = require("./routes/sports");
var commentsRouter = require("./routes/comments");  

var app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use('/images/activities', express.static(path.join(__dirname, 'images/activities')));

app.use("/api", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/activity", activityRouter);
app.use("/api/admin", adminRouter);
app.use("/api/sports", sportsRouter);
app.use("/api/comments", commentsRouter);  

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).json("error");
});

module.exports = app;
