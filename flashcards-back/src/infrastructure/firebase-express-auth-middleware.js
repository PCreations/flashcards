const createFirebaseExpressAuthMiddleware = firebaseAuth => async (
  req,
  res,
  next
) => {
  const idToken = req.headers["authorization"].split("Bearer ")[1];
  try {
    await firebaseAuth.verifyIdToken(idToken);
    next();
  } catch (err) {
    return res.status(403).json({ error: err.message });
  }
};

module.exports = {
  createFirebaseExpressAuthMiddleware
};
