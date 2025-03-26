"use strict";

const express = require("express");

const patientController = require("../controllers/patientController");

const router = express.Router();

router.get("/patients", patientController.getPatients);



module.exports = router;