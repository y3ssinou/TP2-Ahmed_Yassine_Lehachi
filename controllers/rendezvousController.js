"use strict";

const RendezVous = require("../models/rendezvous");
const mongoose = require("mongoose");
const {formatErrorResponse, formatSuccessResponse} = require('../utils/formatErrorResponse')

/**
 * Crée un nouveau rendez-vous avec les données reçues.
 * Renvoie le nouveau rendez-vous et la location créé, en réponse JSON avec un statut de type 201.
 * 
 * @param {import('express').Request} req - Objet de requête contenant les données du rendez-vous dans `req.body`.
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour envoyer le rendez-vous créé.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Renvoie une erreur 400 si les données requises (patientId, medecinId, debut, notes) sont manquantes.
 *                 Renvoie une erreur 409 en cas de conflit de rendez-vous.
 *                 Renvoie toute autre erreur à `next`.
 */
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
        
        const leDebut = new Date(debut)
        // Utilisation des secondes à la place des minutes, car les minutes ne marchaient pas
        const fin = new Date(leDebut.getTime() + 30 * 60 * 1000);         
        
        const conflitsRendezvous = await RendezVous.find({
            medecinId,
            // lt -> lower then, gt -> greater then
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


/**
 * Renvoie le rendez-vous avec son ID en réponse JSON avec un statut de type 200.
 * 
 * @param {import('express').Request} req - Objet de requête contenant l'ID du rendez-vous dans `req.params.id`.
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour envoyer le rendez-vous trouvé.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Renvoie une erreur 404 si le rendez-vous n'existe pas, ou passe toute autre erreur à `next`.
 */
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

/**
 * Renvoie la liste les rendez-vous d'un médecin en fonction de son ID en réponse JSON avec un statut de type 200.
 * Il filtre les rendez-vous par date si la requête contient le paramètre `date`.
 * 
 * @param {import('express').Request} req - Objet de requête contenant l'ID du médecin dans `req.params.id` et une date optionnelle dans `req.query`.
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour envoyer la liste des rendez-vous.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Renvoie une erreur 404 si aucun rendez-vous n'est trouvé pour le médecin.
 */
exports.getRendezVousavecMedecin = async (req, res, next) => {
    try 
    {
        const critereRecherche = { medecinId: req.params.id };
        
        const { date } = req.query;

        if (date) {

            const dateMaintenant = new Date(date);

            const prochaineDate = new Date(dateMaintenant);

            prochaineDate.setDate(dateMaintenant.getDate() + 1);
            
            critereRecherche.debut = {
                $gte: dateMaintenant,
                $lt: prochaineDate
            };
        }

        const rdvDuMedecin = await RendezVous.find(critereRecherche);
        
        if (!rdvDuMedecin?.length) 
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
                rdvDuMedecin,
                req.originalUrl
            )
        );

    } 
    catch (err) 
    { next(err); 
        
    }
};

/**
 * Renvoie la liste les rendez-vous d'un patient en fonction de son ID en réponse JSON avec un statut de type 200.
 * Il filtre les rendez-vous par date si la requête contient le paramètre `date`.
 * 
 * @param {import('express').Request} req - Objet de requête contenant l'ID du patient dans `req.params.id` et une date optionnelle dans `req.query`.
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour envoyer la liste des rendez-vous.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Renvoie une erreur 404 si aucun rendez-vous n'est trouvé pour le patient.
 */
exports.getRendezVousavecPatient = async (req, res, next) => {
    try 
    {
        const critereRecherche = { patientId: req.params.id };
        
        const { date } = req.query;

        if (date) {

            const dateMaintenant = new Date(date);

            const prochaineDate = new Date(dateMaintenant);

            prochaineDate.setDate(dateMaintenant.getDate() + 1);
            
            critereRecherche.debut = {
                $gte: dateMaintenant,
                $lt: prochaineDate
            };
        }

        const rdvDuPatient = await RendezVous.find(critereRecherche);
        
        if (!rdvDuPatient?.length) 
            return res.status(404).json(
            formatErrorResponse(
                404,
                "Not Found",
                "Pas de rendez-vous pour le patient",
                req.originalUrl
            )
        );
        
        return res.status(200).json(
            formatSuccessResponse(
                200,
                "Récupération de la liste des rendez-vous pour le patient réussi avec succès",
                rdvDuPatient,
                req.originalUrl
            )
        );
    } 
    catch (err) {
        next(err);
    }
};

/**
 * Supprime un rendez-vous en fonction de son ID et renvoie le rendez-vous en réponse JSON avec un statut de type 204.
 * 
 * @param {import('express').Request} req - Objet de requête contenant l'ID du rendez-vous à supprimer dans `req.params.id`.
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour envoyer la liste des rendez-vous.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Renvoie une erreur 404 si le rendez-vous n'existe pas, ou passe toute autre erreur à `next`.
 */
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

        return res.status(204).json(
            formatSuccessResponse(
                204,
                "Suppression du rendez-vous réussi avec succès",
                rendezVous,
                req.originalUrl
            )
        );
    } 
    catch (err) {
        next(err);
    }
};