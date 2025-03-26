"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({

},{
	timestamps: true
});


module.exports = mongoose.model("patient", patientSchema);

