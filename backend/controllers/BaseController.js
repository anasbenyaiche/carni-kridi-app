class BaseController {
  handleSuccess(res, data, statusCode = 200) {
    return res.status(statusCode).json(data);
  }

  handleError(res, error, statusCode = 500) {
    console.error(`Error: ${error.message}`, error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: Object.values(error.errors).map(e => e.message)
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ error: `${field} already exists` });
    }

    return res.status(statusCode).json({ 
      error: error.message || 'Internal server error' 
    });
  }

  handleNotFound(res, message = 'Resource not found') {
    return res.status(404).json({ error: message });
  }

  handleBadRequest(res, message = 'Bad request') {
    return res.status(400).json({ error: message });
  }

  handleUnauthorized(res, message = 'Unauthorized') {
    return res.status(401).json({ error: message });
  }

  handleForbidden(res, message = 'Forbidden') {
    return res.status(403).json({ error: message });
  }

  extractPaginationParams(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    return { page, limit };
  }

  extractSearchParams(query) {
    return {
      search: query.search || '',
      sort: query.sort || {},
      filter: query.filter || {}
    };
  }
}

module.exports = BaseController;