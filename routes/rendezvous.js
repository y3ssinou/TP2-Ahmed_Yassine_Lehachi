"use strict";

const express = require("express");
const rendezvousController = require("../controllers/rendezvouscontroller");

const router = express.Router();

router.post("/rendezvous", rendezvousController.creeRendezVous);
router.get("/rendezvous/:id", rendezvousController.getRendezVousavecId);
router.get("/rendezvous/medecins/:id", rendezvousController.getRendezVousavecMedecin);
router.get("/rendezvous/patients/:id", rendezvousController.getRendezVousavecPatient);
router.delete("/rendezvous/:id", rendezvousController.suppRendezVous);

module.exports = router;