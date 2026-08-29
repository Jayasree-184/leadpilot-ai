/**
 * Client-Side CSV Exporter
 */
export function downloadLeadsAsCsv(leads, filename = 'leadpilot_leads_export.csv') {
  if (!leads || leads.length === 0) return;

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

  const escapeField = (field) => {
    if (field === null || field === undefined) return '""';
    const str = String(field).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = [headers.join(',')];

  leads.forEach(lead => {
    const row = [
      escapeField(lead.companyName),
      escapeField(lead.industry),
      escapeField(lead.location),
      lead.employees || 0,
      escapeField(lead.revenue),
      lead.score ?? '',
      escapeField(lead.category),
      escapeField(lead.decisionMaker),
      escapeField(lead.recommendedAction),
      escapeField(lead.outreachAngle),
      escapeField(lead.contactName),
      escapeField(lead.contactRole),
      escapeField(lead.email),
      escapeField(lead.phone),
      escapeField(Array.isArray(lead.technologies) ? lead.technologies.join('; ') : lead.technologies)
    ];
    rows.push(row.join(','));
  });

  const csvBlob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const downloadUrl = URL.createObjectURL(csvBlob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
