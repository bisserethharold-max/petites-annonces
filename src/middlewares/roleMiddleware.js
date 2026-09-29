const roleMiddleware = (...rolesAutorises) => {
  return (req, res, next) => {
    if (!req.user || !rolesAutorises.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé pour ce rôle' });
    }
    next();
  };
};

export default roleMiddleware;