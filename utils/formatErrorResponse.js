// Pris des notes des cours

/**
 * Génère une réponse d'erreur formatée pour une API REST selon OpenAPI
 *
 * @param {number} statusCode - Code HTTP de l'erreur (ex: 404, 500).
 * @param {string} errorType - Type d'erreur (ex: "Not Found", "Internal Server Error").
 * @param {string} message - Message détaillé expliquant l'erreur.
 * @param {string} path - L'URL concernée par l'erreur.
 * @returns {object} - Objet JSON formaté pour la réponse d'erreur.
 */
const formatErrorResponse = (statusCode, errorType, message, path) => {
    return {
      status: statusCode,
      error: errorType,
      message: message,
      path: path,
      timestamp: new Date().toISOString() // Génère un timestamp ISO 8601
    };
  };

  /**
 * Génère une réponse JSON formatée pour une API REST (succès) selon OpenAPI
 *
 * @param {number} statusCode - Code HTTP (200, 201, etc.).
 * @param {string} message - Message de confirmation.
 * @param {any} data - Les données à retourner.
 * @param {string} path - URL où la requête a été effectuée.
 * @returns {object} - Objet JSON formaté.
 */
const formatSuccessResponse = (statusCode, message, data, path) => {
    return {
      status: statusCode,
      message: message,
      data: data || null, // Si pas de données, mettre `null`
      path: path,
      timestamp: new Date().toISOString()
    };
  };
  
  module.exports = {
    formatErrorResponse,
    formatSuccessResponse
  };
  