"use strict";

const express = require("express");
const medecinController = require("../controllers/medecinController");

const router = express.Router();

router.get("/medecins", medecinController.getMedecins);
router.post("/medecins", medecinController.creeMedecin);
router.get("/medecins/:id", medecinController.getMedecinavecId);
router.put("/medecins/:id", medecinController.modifierMedecin);
router.delete("/medecins/:id", medecinController.suppMedecin);

module.exports = router;