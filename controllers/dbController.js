"use strict";

const Patient = require("../models/patient");
const Medecin = require("../models/medecin");
const RendezVous = require("../models/rendezvous");

const medecins = require("../seeds/medecins");
const patients = require("../seeds/patients");
const rendezVous = require("../seeds/rendezVous");

exports.seed = async (req, res, next) => {
    try {
        await Medecin.deleteMany();
        console.log("Médecins supprimés");
        const insertedMedecins = await Medecin.insertMany(medecins);
        
        await Patient.deleteMany();
        console.log("Patients supprimés");
        const insertedPatients = await Patient.insertMany(patients);
        
        await RendezVous.deleteMany();
        console.log("Rendez-vous supprimés");
        const insertedRendezVous = await RendezVous.insertMany(rendezVous);
        
        res.status(200).json({
            medecins: insertedMedecins,
            patients: insertedPatients,
            rendezVous: insertedRendezVous
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
