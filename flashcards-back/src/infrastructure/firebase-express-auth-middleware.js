const createFirebaseExpressAuthMiddleware = firebaseAuth => async (
  req,
  res,
  next
) => {
  const idToken = req.headers["authorization"];
  try {
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    console.log("decodedToken", decodedToken);
    next();
  } catch (err) {
    return res.status(403).json({ error: err.message });
  }
};

module.exports = {
  createFirebaseExpressAuthMiddleware
};
