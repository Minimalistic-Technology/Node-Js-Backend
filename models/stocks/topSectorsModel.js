const mongoose = require('mongoose');

const topSectorsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.models.TopSectors || mongoose.model('TopSectors', topSectorsSchema);
