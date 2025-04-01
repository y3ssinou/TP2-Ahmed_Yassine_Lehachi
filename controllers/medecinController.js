"use strict";

const Medecin = require("../models/medecin");
const {formatErrorResponse, formatSuccessResponse} = require('../utils/formatErrorResponse')

/**
 * Récupère la liste des médecins avec la possibilité de filtrer par les spécialités.
 * Renvoie la liste des médecins en réponse JSON avec un statut de type 200.
 * 
 * @param {import('express').Request} req - Objet de requête Express contenant un paramètre optionnel "specialite".
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour envoyer la liste des médecins.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Passe toute erreur à `next` en cas de problème avec la base de données.
 */
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

/**
 * Récupère un médecin spécifique selon son ID.
 * Renvoie le médecin en réponse JSON avec un statut de type 200.
 * 
 * @param {import('express').Request} req - Objet de requête Express contenant l'ID du médecin dans `req.params.id`.
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour envoyer le médecin récupéré.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Renvoie une erreur 404 si le médecin n'existe pas (avec l'id), ou passe toute autre erreur à `next` en cas de problème.
 */
exports.getMedecinavecId = async (req, res, next) => {
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
  
/**
 * Crée un nouveau médecin avec les données reçues.
 * Renvoie le nouveau Médecin créé en réponse JSON avec un statut de type 201.
 * 
 * @param {import('express').Request} req - Objet de requête Express contenant les données du médecin dans `req.body`.
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour envoyer le médecin créé.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Passe toute erreur à `next` en cas de problème lors de la création du médecin.
 */
exports.creeMedecin = async (req, res, next) => {
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

/**
 * Supprime un médecin selon son identifiant.
 * Renvoie une réponse vide avec un statut 204 si la suppression à été effectué.
 * 
 * @param {import('express').Request} req - Objet de requête Express contenant l'ID du médecin dans `req.params.id`.
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour indiquer le succès de la suppression.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Renvoie une erreur 404 si le médecin n'existe pas, ou passe toute autre erreur à `next` en cas de problème.
 */
exports.suppMedecin = async (req, res, next) => {
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
  
/**
 * Met à jour un médecin qui existe selon son ID.
 * Renvoie le médecin mis à jour en réponse JSON avec un statut de type 200.
 * 
 * @param {import('express').Request} req - Objet de requête Express contenant l'ID du médecin dans `req.params.id` et les nouvelles données dans `req.body`.
 * @param {import('express').Response} res - Objet de réponse Express utilisé pour envoyer le médecin mis à jour.
 * @param {import('express').NextFunction} next - Fonction middleware pour gérer les erreurs.
 * 
 * @returns {void} Cette fonction ne retourne rien directement, elle envoie une réponse JSON ou passe une erreur à `next`.
 * 
 * @throws {Error} Renvoie une erreur 404 si le médecin n'existe pas, ou passe toute autre erreur à `next` en cas de problème.
 */
exports.modifierMedecin = async (req, res, next) => {
  try {
    const medecinId = req.params.id;
    const medecin = await Medecin.findById(medecinId);
    
    if (!medecin) {
      return res.status(404).json(formatErrorResponse(
        404,
        "Not Found",
        "Médecin non trouvé",
        req.originalUrl
      ));
    }

    const { nom, prenom, telephone, courriel, specialite } = req.body;
    
    if (nom != null) 
      medecin.nom = nom;
    if (prenom != null) 
      medecin.prenom = prenom;
    if (telephone != null) 
      medecin.telephone = telephone;
    if (courriel != null) 
      medecin.courriel = courriel;
    if (specialite != null)
      medecin.specialite = specialite;

    await medecin.validate();
    const nouveauMedecin = await medecin.save();

    res.status(200).json(formatSuccessResponse(
      200,
      "Médecin mis à jour avec succès",
      nouveauMedecin,
      req.originalUrl
    ));

  } catch (err) {
    next(err);
  }
};