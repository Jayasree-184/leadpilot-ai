import express from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  analyzeLead,
  reanalyzeLead,
  importLeads,
  exportLeads
} from '../controllers/leadController.js';

const router = express.Router();

// Specific non-param routes first
router.get('/export', exportLeads);
router.post('/import', importLeads);

// Collection routes
router.get('/', getLeads);
router.post('/', createLead);

// Single resource routes
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

// AI Qualification routes
router.post('/:id/analyze', analyzeLead);
router.post('/:id/reanalyze', reanalyzeLead);

export default router;
