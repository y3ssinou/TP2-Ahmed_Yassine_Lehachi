"use strict";

const express = require("express");
const patientController = require("../controllers/patientController");

const router = express.Router();

router.get("/patients", patientController.getPatients);
router.post("/patients", patientController.createPatient);
router.get("/patients/:id", patientController.getPatientById);
router.put("/patients/:id", patientController.updatePatient);
router.delete("/patients/:id", patientController.deletePatient);
router.post("/patients/:id/historique", patientController.addHistorique);
router.delete("/patients/:id/historique/:id_historique", patientController.deleteHistorique);

module.exports = router;