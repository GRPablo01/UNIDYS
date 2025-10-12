// middleware/auth.js
module.exports = (req, res, next) => {
    // Ici, tu mets un ID d'utilisateur existant dans ta DB pour tester
    req.user = { id: '689b850dbe95d1fe65ec19ef' }; 
    next();
  };
  