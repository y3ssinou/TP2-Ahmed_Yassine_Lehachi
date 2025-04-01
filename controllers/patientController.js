"use strict";

const Patient = require("../models/patient");
const {formatErrorResponse, formatSuccessResponse} = require('../utils/formatErrorResponse')


/**
 * Récupère la liste de tous les patients.
 * Renvoie la liste des patients en réponse JSON avec un statut de type 200.
 * 
 * @param {import('express').Request} req - Objet de requête Express.
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour envoyer les patients récupérés.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Passe toute erreur à `next` en cas de problème avec la base de données.
 */
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

/**
 * Récupère un patient par son ID.
 * Renvoie la liste des patients selon leur ID en réponse JSON avec un statut de type 200.
 * 
 * @param {import('express').Request} req - Objet de requête contenant l'ID du patient dans `req.params.id`.
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour envoyer le patient récupéré.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Renvoie une erreur 404 si un patient n'existe pas.
 */
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

/**
 * Crée un nouveau patient avec les données reçues.
 * Renvoie le nouveau patient créé en réponse JSON avec un statut de type 201.
 * 
 * @param {import('express').Request} req - Objet de requête contenant les données du patient dans `req.body`.
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour envoyer le patient créé.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Passe toute erreur à `next` en cas de problème lors de la création du médecin.
 */
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

/**
 * Modifie un patient existant par son ID.
 * Renvoie le patient mis à jour en réponse JSON avec un statut de type 200.
 * 
 * @param {import('express').Request} req - Objet de requête contenant l'ID du patient dans `req.params.id` et les données mises à jour dans `req.body`.
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour envoyer le patient mis à jour.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Renvoie une erreur 404 si le patient n'existe pas.
 */
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

/**
 * Supprime un patient existant par son ID.
 * Renvoie une réponse vide avec un statut 204 si la suppression à été effectué.
 * 
 * @param {import('express').Request} req - Objet de requête contenant l'ID du patient dans `req.params.id`.
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour envoyer un statut 204 si la suppression est réussie.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Renvoie une erreur 404 si le patient n'existe pas.
 */
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

/**
 * Ajoute une entrée à l'historique médical d'un patient.
 * Renvoie le patient et la date à laquel l'historique est créé, en réponse JSON avec un statut de type 201.
 * 
 * @param {import('express').Request} req - Objet de requête contenant l'ID du patient dans `req.params.id` et les détails de l'historique dans `req.body`.
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour envoyer la mise à jour du patient.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Renvoie une erreur 404 si le patient n'existe pas.
 */
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


/**
 * Supprime une entrée de l'historique médical d'un patient.
 * Renvoie une réponse vide avec un statut 204 si la suppression de l'historique à été effectué.
 * 
 * @param {import('express').Request} req - Objet de requête contenant l'ID du patient dans `req.params.id` et l'ID de l'entrée d'historique dans `req.params.id_historique`.
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour envoyer un statut 204 si la suppression est réussie.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Renvoie une erreur 404 si le patient n'existe pas.
 */
exports.suppHistorique = async (req, res, next) => {
    try 
    {
      // Source de .findByIdAndUpdate() parce que je sais qu'on ne la pas utilisé pour les update en classe
      // https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()
      
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            {$pull: { historique: { _id: req.params.id_historique } }},
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
    } 
    catch (err) {
        next(err);
    }
};