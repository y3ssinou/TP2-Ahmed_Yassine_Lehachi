"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medecinSchema = new Schema({

	nom : {
		type : String,
		required: true
	},
    
	prenom : {
		type : String,
		required: true
	},
    
	telephone : {
		type : String,
		required: true
	},
    
	courriel : {
		type : String,
		required: true
	},
	specialite: {
		type: String,
		required: true
	},
    
},{
	timestamps: true
});


module.exports = mongoose.model("medecin", medecinSchema);


