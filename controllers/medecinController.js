"use strict";

const Medecin = require("../models/medecin");
const {formatErrorResponse, formatSuccessResponse} = require('../utils/formatErrorResponse')

exports.getMedecins = async (req, res, next) => {
  try 
  {
      const specialite = req.query.specialite;
      let laSpecialite = {};

      if (specialite) 
      {
          laSpecialite = { specialite };
      }

      const medecin = await Medecin.find(laSpecialite);

      res.status(200).json(formatSuccessResponse(
          200,
          "Médecins récupérés avec succès",
          medecin,
          req.originalUrl
      ));
  } 
  catch (err) {
      next(err);
  }
};

exports.getMedecinById = async (req, res, next) => {
  try 
  {
    const medecinId = req.params.id;
    const medecin = await Medecin.findById(medecinId);

    if (!medecin) {
      return res.status(404).json(formatErrorResponse(
        404,
        "Not Found",
        "Le médecin avec cette ID n'existe pas",
        req.originalUrl
      ));
    }

    res.status(200).json(formatSuccessResponse(
      200,
      "Médecin à été récupéré avec succès",
      medecin,
      req.originalUrl
    ));
  } 
  catch (err) {
    next(err);
  }
};
  

exports.createMedecin = async (req, res, next) => {
  try 
  {
      const medecin = new Medecin(req.body);

      const nouveauMedecin = await medecin.save();

      res.location(`/medecins/${nouveauMedecin._id}`);
      res.status(201).json(formatSuccessResponse(
        201,
        "Medecin à été créé avec succès",
        nouveauMedecin,
        req.originalUrl
      ));
  }
    catch (err) {
      next(err);
  }
};

exports.deleteMedecin = async (req, res, next) => {
  try 
  {
      const medecinId = req.params.id;

      const medecin = await Medecin.findByIdAndRemove(medecinId);

      if (!medecin) {
        return res.status(404).json(formatErrorResponse(
          404,
          "Not Found",
          "Le Médecin n'existe pas",
          req.originalUrl
        ));
      }
      res.status(204).json(formatSuccessResponse(
          204,
          "Medecin à été supprimé avec succès",
          null,
          req.originalUrl
        ));
  } 
  catch (err) {
      next(err);
  }
};
  

exports.updateMedecin = async (req, res, next) => {
  try 
  {
    const medecinId = req.params.id;

    const medecin = await Medecin.findById(medecinId);

    if (!medecin) {
        return res.status(404).json(formatErrorResponse(
            404,
            "Not Found",
            "Le Médecin n'existe pas",
            req.originalUrl
          ));
    }

    Object.assign(medecin, req.body)

    const nouveauMedecin = await medecin.save();

    res.status(200).json(formatSuccessResponse(
      200,
      "Médecin à été modifié avec succès",
      nouveauMedecin,
      req.originalUrl
    ));
  } 
  catch (err) {
      next(err);
  }
};