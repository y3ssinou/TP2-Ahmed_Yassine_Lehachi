"use strict";

const express = require("express");
const rendezvousController = require("../controllers/rendezvousController");

const router = express.Router();

router.post("/rendezvous", rendezvousController.createRendezVous);
router.get("/rendezvous/:id", rendezvousController.getRendezVousById);
router.get("/rendezvous/medecins/:id", rendezvousController.getRendezVousByMedecin);
router.get("/rendezvous/patients/:id", rendezvousController.getRendezVousByPatient);
router.delete("/rendezvous/:id", rendezvousController.deleteRendezVous);

module.exports = router;