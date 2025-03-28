"use strict";

const Patient = require("../models/patient");
const {formatErrorResponse, formatSuccessResponse} = require('../utils/formatErrorResponse')

exports.getPatients = async (req, res, next) => {
    try 
    {
        const patients = await Patient.find();

        res.status(200).json(formatSuccessResponse(
          200,
          "Patients récupérés avec succès",
          patients,
          req.originalUrl
        ));
    } 
    catch (err) {
        next(err);
    }
};

exports.getPatientavecId = async (req, res, next) => {
    try 
    {
        const patientId = req.params.id;

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json(formatErrorResponse(
                404,
                "Not Found",
                "Le patient n'existe pas",
                req.originalUrl
              ));
        }

        res.status(200).json(formatSuccessResponse(
            200,
            "Patient à été récupéré avec succès",
            patient,
            req.originalUrl
          ));
    } catch (err) {
        next(err);
    }
};

exports.creePatient = async (req, res, next) => {
    try 
    {
        const patient = new Patient(req.body);

        const nouveauPatient = await patient.save();

        res.location(`/patients/${nouveauPatient._id}`);
        
        res.status(201).json(formatSuccessResponse(
          201,
          "Patient à été créé avec succès",
          nouveauPatient,
          req.originalUrl
        ));
    } 
    catch (err) {
        next(err);
    }
};

exports.modifierPatient = async (req, res, next) => {
    try 
    {
      const patientId = req.params.id;

      const patient = await Patient.findById(patientId);
  
      if (!patient) {
        return res.status(404).json(formatErrorResponse(
          404,
          "Not Found",
          "Patient non trouvéé",
          req.originalUrl
        ));
      }
  
      const { nom, prenom, dateNaissance, telephone, courriel, adresse, codePostal } = req.body;
  
      if (nom != null) 
        patient.nom = nom;
      if (prenom != null) 
        patient.prenom = prenom;
      if (dateNaissance != null) 
        patient.dateNaissance = dateNaissance;
      if (telephone != null) 
        patient.telephone = telephone;
      if (courriel != null) 
        patient.courriel = courriel;
      if (adresse != null) 
        patient.adresse = adresse;
      if (codePostal != null) 
        patient.codePostal = codePostal;
  
      await patient.validate();
      const patientajour = await patient.save();
  
      res.status(200).json(formatSuccessResponse(
        200,
        "Patient mis à jour avec succès",
        patientajour,
        req.originalUrl
      ));
  
    } 
    catch (err) {
      next(err);
    }
  };

exports.suppPatient = async (req, res, next) => {
    try 
    {
        const patientId = req.params.id;

        const patient = await Patient.findByIdAndDelete(patientId);

        if (!patient) {
            return res.status(404).json(formatErrorResponse(
                404,
                "Not Found",
                "Le patient n'existe pas",
                req.originalUrl
              ));
        }
        res.status(204).send();
    } 
    catch (err) {
        next(err);
    }
};

exports.ajoutHistorique = async (req, res, next) => {
    try 
    {

        const { medecinId, information } = req.body;

        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({
                status: "error",
                message: "Le patient n'existe pas",
                path: req.originalUrl,
                timestamp: new Date().toISOString()
            });
        }

        patient.historique.push({
            medecinId,
            information,
            created_at: new Date()
        });

        await patient.save();

        res.status(201)
            .set("Location", `/patients/${patient._id}`)
            .json({
                status: "success",
                message: "Historique ajouté avec succès",
                data: patient,
                path: req.originalUrl,
                timestamp: new Date().toISOString()
            });
    } 
    catch (err) {
        console.error(err);
        next(err);
    }
};


exports.suppHistorique = async (req, res, next) => {
    try 
    {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { historique: { _id: req.params.id_historique } }
            },
            { new: true }
        );
        
        if (!patient) {
            return res.status(404).json(formatErrorResponse(
                404,
                "Not Found",
                "Le patient n'existe pas",
                req.originalUrl
              ));
        }
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};