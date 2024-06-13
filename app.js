const express = require("express");
const app = express();
const fs = require("fs");
const PORT = 3000;
app.use(express.static("public"));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
