const express = require('express');
const router = express.Router();
const coursController = require('../Controller/cours.controller');

const multer = require('multer');

// stockage fichier
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// créer cours
router.post('/cours', upload.single('pdf'), coursController.creerCours);

module.exports = router;