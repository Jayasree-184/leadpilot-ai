import mongoose from 'mongoose';

const ScoreBreakdownSchema = new mongoose.Schema({
  industryFit: { type: Number, default: 0, min: 0, max: 25 },
  companySize: { type: Number, default: 0, min: 0, max: 20 },
  revenuePotential: { type: Number, default: 0, min: 0, max: 20 },
  techFit: { type: Number, default: 0, min: 0, max: 15 },
  locationFit: { type: Number, default: 0, min: 0, max: 10 },
  otherSignals: { type: Number, default: 0, min: 0, max: 10 }
}, { _id: false });

const LeadSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    index: true
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true,
    index: true
  },
  employees: {
    type: Number,
    default: 0,
    min: 0
  },
  revenue: {
    type: String,
    trim: true,
    default: '$0'
  },
  location: {
    type: String,
    trim: true,
    default: 'Unspecified'
  },
  website: {
    type: String,
    trim: true,
    default: ''
  },
  contactName: {
    type: String,
    trim: true,
    default: ''
  },
  contactRole: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  linkedin: {
    type: String,
    trim: true,
    default: ''
  },
  technologies: {
    type: [String],
    default: []
  },
  score: {
    type: Number,
    default: null,
    min: 0,
    max: 100,
    index: true
  },
  category: {
    type: String,
    enum: ['HOT', 'WARM', 'COLD', null],
    default: null,
    index: true
  },
  confidence: {
    type: String,
    enum: ['HIGH', 'MEDIUM', 'LOW', null],
    default: null
  },
  scoreBreakdown: {
    type: ScoreBreakdownSchema,
    default: () => ({})
  },
  reasons: {
    type: [String],
    default: []
  },
  decisionMaker: {
    type: String,
    default: ''
  },
  recommendedAction: {
    type: String,
    default: ''
  },
  outreachAngle: {
    type: String,
    default: ''
  },
  generatedSubject: {
    type: String,
    default: ''
  },
  generatedMessage: {
    type: String,
    default: ''
  },
  analyzedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Text index for fast multi-field search
LeadSchema.index({
  companyName: 'text',
  industry: 'text',
  location: 'text',
  contactName: 'text'
});

export const Lead = mongoose.model('Lead', LeadSchema);
export default Lead;
