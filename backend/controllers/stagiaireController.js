const Stagiaire = require('../models/Stagiaire');
const Activite = require('../models/Activite');

// @desc    Get all stagiaires
// @route   GET /api/stagiaires
// @access  Private
exports.getStagiaires = async (req, res) => {
  try {
    const { statut, departement, search, page = 1, limit = 10 } = req.query;

    let query = {};
    if (statut) query.statut = statut;
    if (departement) query.departement = departement;
    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const stagiaires = await Stagiaire.find(query)
      .populate('encadreur', 'nom prenom email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Stagiaire.countDocuments(query);

    res.json({
      success: true,
      count: stagiaires.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      stagiaires
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single stagiaire
// @route   GET /api/stagiaires/:id
// @access  Private
exports.getStagiaire = async (req, res) => {
  try {
    const stagiaire = await Stagiaire.findById(req.params.id).populate('encadreur', 'nom prenom email');
    if (!stagiaire) {
      return res.status(404).json({ success: false, message: 'Stagiaire non trouve' });
    }
    res.json({ success: true, stagiaire });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create stagiaire
// @route   POST /api/stagiaires
// @access  Private (Admin/Encadreur)
exports.createStagiaire = async (req, res) => {
  try {
    const stagiaire = await Stagiaire.create(req.body);

    // Log activity
    await Activite.create({
      type: 'ajout',
      description: `Nouveau stagiaire ajoute: ${stagiaire.nom} ${stagiaire.prenom}`,
      stagiaire: stagiaire._id,
      utilisateur: req.user.id
    });

    res.status(201).json({ success: true, stagiaire });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update stagiaire
// @route   PUT /api/stagiaires/:id
// @access  Private (Admin/Encadreur)
exports.updateStagiaire = async (req, res) => {
  try {
    const stagiaire = await Stagiaire.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stagiaire) {
      return res.status(404).json({ success: false, message: 'Stagiaire non trouve' });
    }

    await Activite.create({
      type: 'modification',
      description: `Stagiaire modifie: ${stagiaire.nom} ${stagiaire.prenom}`,
      stagiaire: stagiaire._id,
      utilisateur: req.user.id
    });

    res.json({ success: true, stagiaire });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete stagiaire
// @route   DELETE /api/stagiaires/:id
// @access  Private (Admin)
exports.deleteStagiaire = async (req, res) => {
  try {
    const stagiaire = await Stagiaire.findById(req.params.id);
    if (!stagiaire) {
      return res.status(404).json({ success: false, message: 'Stagiaire non trouve' });
    }

    await Activite.create({
      type: 'suppression',
      description: `Stagiaire supprime: ${stagiaire.nom} ${stagiaire.prenom}`,
      stagiaire: stagiaire._id,
      utilisateur: req.user.id
    });

    await stagiaire.deleteOne();
    res.json({ success: true, message: 'Stagiaire supprime avec succes' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/stagiaires/stats/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStagiaires = await Stagiaire.countDocuments();
    const actifs = await Stagiaire.countDocuments({ statut: 'Actif' });
    const enAttente = await Stagiaire.countDocuments({ statut: 'En attente' });
    const termines = await Stagiaire.countDocuments({ statut: 'Termine' });

    const avgProgression = await Stagiaire.aggregate([
      { $group: { _id: null, avg: { $avg: '$progression' } } }
    ]);

    const parDepartement = await Stagiaire.aggregate([
      { $group: { _id: '$departement', count: { $sum: 1 } } }
    ]);

    const evolution = await Stagiaire.aggregate([
      {
        $group: {
          _id: { $month: '$dateDebut' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalStagiaires,
        actifs,
        enAttente,
        termines,
        avgProgression: avgProgression[0]?.avg || 0,
        parDepartement,
        evolution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};