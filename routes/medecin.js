"use strict";

const express = require("express");
const medecinController = require("../controllers/medecinController");

const router = express.Router();

router.get("/medecins", medecinController.getMedecins);
router.post("/medecins", medecinController.createMedecin);
router.get("/medecins/:id", medecinController.getMedecinById);
router.put("/medecins/:id", medecinController.updateMedecin);
router.delete("/medecins/:id", medecinController.deleteMedecin);

module.exports = router;