"use strict";

const express = require("express");
const patientController = require("../controllers/patientController");

const router = express.Router();

router.get("/patients", patientController.getPatients);
router.post("/patients", patientController.creePatient);
router.get("/patients/:id", patientController.getPatientavecId);
router.put("/patients/:id", patientController.modifierPatient);
router.delete("/patients/:id", patientController.suppPatient);
router.post("/patients/:id/historique", patientController.ajoutHistorique);
router.delete("/patients/:id/historique/:id_historique", patientController.suppHistorique);

module.exports = router;