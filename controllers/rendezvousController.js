"use strict";

const RendezVous = require("../models/rendezvous");
const mongoose = require("mongoose");
const {formatErrorResponse, formatSuccessResponse} = require('../utils/formatErrorResponse')

exports.creeRendezVous = async (req, res, next) => {
    try 
    {
        const { patientId, medecinId, 
            debut, notes } = req.body;
        
        if (!patientId || !debut 
            || !notes || !medecinId) {
            return res.status(400).json(formatErrorResponse(
                400,
                "Bad Request",
                "Patient et le médecin n'existe pas",
                req.originalUrl
              ));
        }
        
        const nDebut = new Date(debut)
        const fin = new Date(nDebut.getTime() + 30 * 60 * 1000);         
        
        const conflitsRendezvous = await RendezVous.find({
            medecinId,
            $or: [{ debut:{$lt: fin, $gte: debut}},{ fin:{$gt: debut, $lte: fin}},
                { $and: [{ debut: { $lte: debut } },{ fin: { $gte: fin } }]}
            ]
        });
        
        if (conflitsRendezvous.length > 0) {
            return res.status(409).json(formatErrorResponse(
                409,
                "Conflict",
                "Conflit avec les rendez-vous",
                req.originalUrl
              ));
            
        }
        
        const rendezVous = new RendezVous({
            patientId,
            medecinId,
            debut,
            fin,
            notes
        });
        
        const nouveauRendezVous = await rendezVous.save();

        res.location(`/rendezvous/${nouveauRendezVous._id}`);
        res.status(201).json(formatSuccessResponse(
          201,
          "Rendez-vous créé avec succès",
          nouveauRendezVous,
          req.originalUrl
        ));

    } 
    catch (err) {
        next(err);
    }
};

exports.getRendezVousavecId = async (req, res, next) => {
    try 
    {
        const idRendezVous = req.params.id;

        const rendezVous = await RendezVous.findById(idRendezVous);
        
        if (!rendezVous) {
            return res.status(404).json(formatErrorResponse(
                404,
                "Not Found",
                "Le rendez-vous n'existe pas",
                req.originalUrl
              ));
        }
        
        res.status(200).json(formatSuccessResponse(
            200,
            "Rendez-vous créé avec succès",
            rendezVous,
            req.originalUrl
          ));
    } 
    catch (err) 
    {
        next(err);
    }
};

exports.getRendezVousavecMedecin = async (req, res, next) => {
    try 
    {
        const filtre = { medecinId: req.params.id };
        
        const { date } = req.query;

        if (date) {

            const dateMaintenant = new Date(date);

            const prochaineDate = new Date(dateMaintenant);

            prochaineDate.setDate(dateMaintenant.getDate() + 1);
            
            filtre.debut = {
                $gte: dateMaintenant,
                $lt: prochaineDate
            };
        }

        const rdv = await RendezVous.find(filtre);
        
        if (!rdv?.length) 
            return res.status(404).json(
            formatErrorResponse(
                404,
                "Not Found",
                "Pas de rendez-vous pour le médecin",
                req.originalUrl
            )
        );

        return res.status(200).json(
            formatSuccessResponse(
                200,
                "Récupération de la liste des rendez-vous pour le médecin réussi avec succès",
                rdv,
                req.originalUrl
            )
        );

    } 
    catch (err) 
    { next(err); 
        
    }
};

exports.getRendezVousavecPatient = async (req, res, next) => {
    try 
    {
        const { id } = req.params;
        const { date } = req.query;
        
        let query = { patientId: id };
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            
            query.debut = { $gte: startDate, $lte: endDate };
        }
        
        const rendezVous = await RendezVous.find(query)
            .populate("medecinId")
            .sort({ debut: 1 });
        
        res.status(200).json(rendezVous);
    } 
    catch (err) {
        next(err);
    }
};

exports.suppRendezVous = async (req, res, next) => {
    try 
    {
        const idRendezVous = req.params.id;

        const rendezVous = await RendezVous.findByIdAndDelete(idRendezVous);

        if (!rendezVous) {
            return res.status(404).json(formatErrorResponse(
                404,
                "Not Found",
                "Le rendez-vous n'existe pas",
                req.originalUrl
              ));
        }
        res.status(204).send();
    } 
    catch (err) {
        next(err);
    }
};