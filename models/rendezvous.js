"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const rendezVousSchema = new Schema({
	patientId: {
		type: mongoose.Types.ObjectId,
		ref: "patient",
		required: true
	},
	medecinId: {
		type: mongoose.Types.ObjectId,
		ref: "medecin",
		required: true
	},
	debut: {
		type: Date,
		required: true
	},
	fin: {
		type: Date,
		required: true
	},
	notes: {
		type: String,
		required: true
	}
    
},{
	timestamps: true
});

module.exports = mongoose.model("rendezVous", rendezVousSchema);