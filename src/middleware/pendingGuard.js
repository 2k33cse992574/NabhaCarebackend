module.exports = (req, res, next) => {
  if (['doctor', 'pharmacist'].includes(req.user.role) && !req.user.verified) {
    return res.status(403).json({ message: "Account pending approval by admin" });
  }
  next();
};