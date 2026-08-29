import Lead from '../models/Lead.js';
import { qualifyLeadWithAI } from '../services/aiService.js';

/**
 * GET /api/leads
 * Fetch leads with live search, multi-filters, sorting, and pagination
 */
export const getLeads = async (req, res, next) => {
  try {
    const {
      search = '',
      industry = '',
      location = '',
      category = '',
      scoreMin,
      scoreMax,
      sort = 'score:desc',
      page = 1,
      limit = 100
    } = req.query;

    const query = {};

    // 1. Text Search across multiple fields
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { companyName: searchRegex },
        { industry: searchRegex },
        { location: searchRegex },
        { contactName: searchRegex },
        { contactRole: searchRegex },
        { website: searchRegex }
      ];
    }

    // 2. Industry Filter
    if (industry && industry !== 'ALL' && industry !== 'All') {
      query.industry = new RegExp(`^${industry.trim()}$`, 'i');
    }

    // 3. Location Filter
    if (location && location !== 'ALL' && location !== 'All') {
      query.location = new RegExp(location.trim(), 'i');
    }

    // 4. Category Filter (HOT / WARM / COLD)
    if (category && category !== 'ALL' && category !== 'All') {
      query.category = category.toUpperCase();
    }

    // 5. Score Range Filter
    if (scoreMin !== undefined || scoreMax !== undefined) {
      query.score = {};
      if (scoreMin !== undefined && scoreMin !== '') {
        query.score.$gte = Number(scoreMin);
      }
      if (scoreMax !== undefined && scoreMax !== '') {
        query.score.$lte = Number(scoreMax);
      }
    }

    // 6. Sorting
    let sortOption = { score: -1, createdAt: -1 };
    if (sort) {
      const [field, order] = sort.split(':');
      const sortDir = order === 'asc' ? 1 : -1;
      sortOption = { [field]: sortDir };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [leads, totalCount] = await Promise.all([
      Lead.find(query).sort(sortOption).skip(skip).limit(limitNum).lean(),
      Lead.countDocuments(query)
    ]);

    // KPI Aggregations across all leads in the database
    const allLeads = await Lead.find({}, 'score category industry').lean();
    const totalAll = allLeads.length;
    const hotCount = allLeads.filter(l => l.category === 'HOT').length;
    const warmCount = allLeads.filter(l => l.category === 'WARM').length;
    const coldCount = allLeads.filter(l => l.category === 'COLD').length;
    const scoredLeads = allLeads.filter(l => typeof l.score === 'number' && !isNaN(l.score));
    const averageScore = scoredLeads.length > 0
      ? Math.round(scoredLeads.reduce((acc, curr) => acc + curr.score, 0) / scoredLeads.length)
      : 0;

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum) || 1
      },
      kpis: {
        totalLeads: totalAll,
        hotLeads: hotCount,
        warmLeads: warmCount,
        coldLeads: coldCount,
        averageScore
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/leads/:id
 * Retrieve a specific lead by ID
 */
export const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/leads
 * Create a new lead with optional automatic AI analysis
 */
export const createLead = async (req, res, next) => {
  try {
    const {
      companyName,
      industry,
      employees,
      revenue,
      location,
      website,
      contactName,
      contactRole,
      email,
      phone,
      linkedin,
      technologies,
      autoAnalyze = true
    } = req.body;

    if (!companyName || !industry) {
      return res.status(400).json({
        success: false,
        message: 'Company name and Industry are required fields.'
      });
    }

    const techArray = Array.isArray(technologies)
      ? technologies
      : (typeof technologies === 'string' && technologies.trim() !== ''
          ? technologies.split(',').map(t => t.trim())
          : []);

    const newLead = new Lead({
      companyName: companyName.trim(),
      industry: industry.trim(),
      employees: Number(employees) || 0,
      revenue: revenue || '$0',
      location: location || 'Unspecified',
      website: website || '',
      contactName: contactName || '',
      contactRole: contactRole || '',
      email: email || '',
      phone: phone || '',
      linkedin: linkedin || '',
      technologies: techArray
    });

    if (autoAnalyze) {
      const qualification = await qualifyLeadWithAI(newLead);
      Object.assign(newLead, qualification);
      newLead.analyzedAt = new Date();
    }

    const savedLead = await newLead.save();

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: savedLead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/leads/:id
 * Update lead information
 */
export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (typeof updateData.technologies === 'string') {
      updateData.technologies = updateData.technologies.split(',').map(t => t.trim()).filter(Boolean);
    }

    const updatedLead = await Lead.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedLead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/leads/:id
 * Delete a lead by ID
 */
export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/leads/:id/analyze
 * AI Lead Qualification with Caching
 */
export const analyzeLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // If already analyzed and cached, return cached result immediately
    if (lead.analyzedAt && lead.score !== null && lead.score !== undefined) {
      return res.status(200).json({
        success: true,
        cached: true,
        message: 'Loaded cached AI qualification',
        data: lead
      });
    }

    // Call AI qualification
    const qualification = await qualifyLeadWithAI(lead);
    Object.assign(lead, qualification);
    lead.analyzedAt = new Date();

    const savedLead = await lead.save();

    res.status(200).json({
      success: true,
      cached: false,
      message: 'AI qualification completed',
      data: savedLead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/leads/:id/reanalyze
 * Force live re-qualification of lead (bypasses cache)
 */
export const reanalyzeLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const qualification = await qualifyLeadWithAI(lead);
    Object.assign(lead, qualification);
    lead.analyzedAt = new Date();

    const savedLead = await lead.save();

    res.status(200).json({
      success: true,
      message: 'Lead re-analyzed successfully',
      data: savedLead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper to process items with limited concurrency
 */
async function mapConcurrent(items, limit, asyncCallback) {
  const results = new Array(items.length);
  let currentIndex = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      try {
        results[idx] = await asyncCallback(items[idx], idx);
      } catch (err) {
        console.error(`[Concurrent Error on index ${idx}]:`, err);
        results[idx] = items[idx];
      }
    }
  });

  await Promise.all(workers);
  return results;
}

/**
 * Helper to escape regex special characters
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * POST /api/leads/import
 * Bulk import leads with duplicate prevention and concurrent qualification (Concurrency limit: 4)
 */
export const importLeads = async (req, res, next) => {
  try {
    const { leads: rawLeads = [], autoQualify = true } = req.body;

    if (!Array.isArray(rawLeads) || rawLeads.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No lead records provided for import.'
      });
    }

    const candidateLeads = [];
    const invalidRecords = [];

    // 1. Fast synchronous validation pass
    for (let i = 0; i < rawLeads.length; i++) {
      const item = rawLeads[i];
      const rawCompanyName = item?.companyName || item?.['Company Name'] || item?.Company || item?.company;
      const rawIndustry = item?.industry || item?.['Industry'] || item?.Industry;

      if (!item || !rawCompanyName || !rawIndustry) {
        invalidRecords.push({
          row: i + 1,
          data: item,
          reason: 'Missing companyName or industry'
        });
        continue;
      }

      const techArray = Array.isArray(item.technologies)
        ? item.technologies
        : (typeof item.technologies === 'string'
            ? item.technologies.split(',').map(t => t.trim()).filter(Boolean)
            : []);

      const leadObj = {
        companyName: String(rawCompanyName).trim(),
        industry: String(rawIndustry).trim(),
        employees: Number(item.employees || item['Employees']) || 0,
        revenue: String(item.revenue || item['Revenue'] || '$0').trim(),
        location: String(item.location || item['Location'] || 'Unspecified').trim(),
        website: String(item.website || item['Website'] || '').trim(),
        contactName: String(item.contactName || item['Contact Name'] || '').trim(),
        contactRole: String(item.contactRole || item['Contact Role'] || '').trim(),
        email: String(item.email || item['Email'] || '').trim(),
        phone: String(item.phone || item['Phone'] || '').trim(),
        linkedin: String(item.linkedin || item['LinkedIn'] || '').trim(),
        technologies: techArray,
        score: item.score ?? null,
        category: item.category ?? null,
        confidence: item.confidence ?? null,
        scoreBreakdown: item.scoreBreakdown || undefined,
        reasons: item.reasons || undefined,
        decisionMaker: item.decisionMaker || '',
        recommendedAction: item.recommendedAction || '',
        outreachAngle: item.outreachAngle || '',
        generatedSubject: item.generatedSubject || '',
        generatedMessage: item.generatedMessage || '',
        analyzedAt: item.analyzedAt ? new Date(item.analyzedAt) : null
      };

      candidateLeads.push(leadObj);
    }

    // 2. Efficient batch duplicate detection against existing DB records
    const uniqueCompanyNames = [...new Set(candidateLeads.map(l => l.companyName.toLowerCase()))];
    const existingCompanySet = new Set();

    if (uniqueCompanyNames.length > 0) {
      const regexQueries = uniqueCompanyNames.map(name => new RegExp(`^${escapeRegex(name)}$`, 'i'));
      const existingLeads = await Lead.find(
        { companyName: { $in: regexQueries } },
        'companyName'
      ).lean();

      existingLeads.forEach(l => {
        if (l.companyName) {
          existingCompanySet.add(l.companyName.trim().toLowerCase());
        }
      });
    }

    // 3. Filter out existing and in-batch duplicate companies
    const validLeadsToInsert = [];
    const duplicates = [];
    const seenInBatch = new Set();

    for (const leadObj of candidateLeads) {
      const normalizedName = leadObj.companyName.toLowerCase();

      if (existingCompanySet.has(normalizedName) || seenInBatch.has(normalizedName)) {
        duplicates.push(leadObj.companyName);
      } else {
        seenInBatch.add(normalizedName);
        validLeadsToInsert.push(leadObj);
      }
    }

    // 4. Concurrent AI qualification only for new, non-duplicate leads
    if (autoQualify && validLeadsToInsert.length > 0) {
      const CONCURRENCY_LIMIT = 4;
      await mapConcurrent(validLeadsToInsert, CONCURRENCY_LIMIT, async (leadObj) => {
        // Skip qualification if already analyzed
        if (leadObj.score !== null && leadObj.score !== undefined && leadObj.analyzedAt) {
          return leadObj;
        }

        const qual = await qualifyLeadWithAI(leadObj);
        Object.assign(leadObj, qual);
        leadObj.analyzedAt = new Date();
        return leadObj;
      });
    }

    // 5. Bulk insert new unique leads
    let inserted = [];
    if (validLeadsToInsert.length > 0) {
      inserted = await Lead.insertMany(validLeadsToInsert);
    }

    res.status(200).json({
      success: true,
      message: `Successfully imported ${inserted.length} leads.`,
      data: {
        importedCount: inserted.length,
        skippedCount: duplicates.length,
        invalidCount: invalidRecords.length,
        duplicates,
        invalidRecords
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/leads/export
 * Export leads as CSV matching current filter conditions
 */
export const exportLeads = async (req, res, next) => {
  try {
    const {
      search = '',
      industry = '',
      location = '',
      category = '',
      scoreMin,
      scoreMax
    } = req.query;

    const query = {};

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { companyName: searchRegex },
        { industry: searchRegex },
        { location: searchRegex },
        { contactName: searchRegex }
      ];
    }

    if (industry && industry !== 'ALL' && industry !== 'All') {
      query.industry = new RegExp(`^${industry.trim()}$`, 'i');
    }

    if (location && location !== 'ALL' && location !== 'All') {
      query.location = new RegExp(location.trim(), 'i');
    }

    if (category && category !== 'ALL' && category !== 'All') {
      query.category = category.toUpperCase();
    }

    if (scoreMin !== undefined || scoreMax !== undefined) {
      query.score = {};
      if (scoreMin !== undefined && scoreMin !== '') query.score.$gte = Number(scoreMin);
      if (scoreMax !== undefined && scoreMax !== '') query.score.$lte = Number(scoreMax);
    }

    const leads = await Lead.find(query).sort({ score: -1, createdAt: -1 }).lean();

    // CSV Header row
    const headers = [
      'Company Name',
      'Industry',
      'Location',
      'Employees',
      'Revenue',
      'AI Score',
      'Category',
      'Decision Maker',
      'Recommended Action',
      'Outreach Angle',
      'Contact Name',
      'Contact Role',
      'Email',
      'Phone',
      'Technologies'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [headers.join(',')];

    for (const l of leads) {
      const row = [
        escapeCsv(l.companyName),
        escapeCsv(l.industry),
        escapeCsv(l.location),
        l.employees || 0,
        escapeCsv(l.revenue),
        l.score ?? '',
        escapeCsv(l.category),
        escapeCsv(l.decisionMaker),
        escapeCsv(l.recommendedAction),
        escapeCsv(l.outreachAngle),
        escapeCsv(l.contactName),
        escapeCsv(l.contactRole),
        escapeCsv(l.email),
        escapeCsv(l.phone),
        escapeCsv(Array.isArray(l.technologies) ? l.technologies.join('; ') : l.technologies)
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leadpilot_leads.csv"');
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
