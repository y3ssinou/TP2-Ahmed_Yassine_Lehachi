"use strict";

const RendezVous = require("../models/rendezvous");
const mongoose = require("mongoose");
const {formatErrorResponse, formatSuccessResponse} = require('../utils/formatErrorResponse')

exports.createRendezVous = async (req, res, next) => {
    try 
    {
        const { patientId, medecinId, 
            debut, notes } = req.body;
        
        const [patient, medecin] = await Promise.all(
            [
            mongoose.model("patient").findById(patientId),
            mongoose.model("medecin").findById(medecinId)
        ]
        );
        
        if (!patient || !medecin) {
            return res.status(400).json(formatErrorResponse(
                400,
                "Bad Request",
                "Patient et le médecin n'existe pas",
                req.originalUrl
              ));
        }
        
        const fin = new Date(debut);

        fin.setHours(fin.getHours() + 0.5);        
        
        const conflitsRendezvous = await RendezVous.find({
            medecinId,
            $or: [
                { 
                    debut: { $lt: fin, $gte: debut } 
                },
                { 
                    fin: { $gt: debut, $lte: fin } 
                },
                { $and: 
                    [
                        { debut: { $lte: debut } },
                        { fin: { $gte: fin } }
                    ]
                }
            ]
        });
        
        if (conflitsRendezvous.length > 0) {
            return res.status(409).json(formatErrorResponse(
                409,
                "Bad Request",
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

exports.getRendezVousById = async (req, res, next) => {
    try 
    {
        const idRendezVous = req.params.id;

        const rendezVous = await RendezVous.findById(idRendezVous).populate("patientId").populate("medecinId");
        
        if (!rendezVous) {
            return res.status(404).json(formatErrorResponse(
                404,
                "Not Found",
                "Le rendez-vous n'existe pas",
                req.originalUrl
              ));
        }
        
        res.status(200).json(rendezVous);
    } 
    catch (err) 
    {
        next(err);
    }
};

exports.getRendezVousByMedecin = async (req, res, next) => {
    try 
    {
        const { id } = req.params;
        const { date } = req.query;
        
        let filtre = { medecinId: id };
        
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            
            filtre.debut = { $gte: startDate, $lte: endDate };
        }
        
        const rendezVous = await RendezVous.find(filtre).populate("patientId").sort({ debut: 1 });
        
        res.status(200).json(rendezVous);
    } 
    catch (err) {
        next(err);
    }
};

exports.getRendezVousByPatient = async (req, res, next) => {
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

exports.deleteRendezVous = async (req, res, next) => {
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