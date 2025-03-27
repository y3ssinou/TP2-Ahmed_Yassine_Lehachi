"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({

    nom: {
        type: String,
        required: true
    },

    prenom: {
        type: String,
        required: true
    },

    dateNaissance: {
        type: Date,
        required: true
    },

    telephone: {
        type: String,
        required: true
    },

    courriel: {
        type: String,
        required: true
    },

    adresse: {
        type: String,
        required: true
    },

    codePostal: {
        type: String,
        required: true
    },

    historique: [{
        information: {
            type: String,
            required: true
        },

        medecinId: {
            type: mongoose.Types.ObjectId,
            ref: "medecin",
            required: true
        },

        created_at: {
            type: Date,
            required: true
        }

    }]
	
}, {
    timestamps: true
});

module.exports = mongoose.model("patient", patientSchema);