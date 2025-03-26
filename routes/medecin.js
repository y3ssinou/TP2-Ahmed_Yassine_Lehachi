"use strict";

const express = require("express");

const medecinController = require("../controllers/medecinController");

const router = express.Router();

router.get("/medecins", medecinController.getMedecins);

module.exports = router;