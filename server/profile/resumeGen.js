function generateResumeContent(user, template = 'ats-friendly') {
  // Helper functions for date formatting
  const formatDate = (date) => {
    const dateObj = new Date(date);
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
    const year = dateObj.getFullYear();
    return `${month} ${year}`;
  };

  const formatDateRange = (startDate, endDate) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Present';
    return `${start} - ${end}`;
  };

  // Escape LaTeX special characters
  const escapeLaTeX = (text) => {
    if (!text) return '';
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/\$/g, '\\$')
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/#/g, '\\#')
      .replace(/\^/g, '\\textasciicircum{}')
      .replace(/_/g, '\\_')
      .replace(/~/g, '\\textasciitilde{}');
  };

  // Generate contact info for address
  const getContactInfo = () => {
    let contact = '';
    
    // Phone and location (first line)
    if (user.phoneNumber) {
      contact += `${escapeLaTeX(user.phoneNumber)}`;
    }
    
    // Email (second line)
    if (user.email) {
      contact += ` \\\\ ${escapeLaTeX(user.email)}`;
    }
    
    // Social links (third line)
    if (user.linkedinUrl || user.githubUrl || user.portfolioUrl) {
      contact += ' \\\\ ';
      const links = [];
      if (user.linkedinUrl) links.push(`\\href{${escapeLaTeX(user.linkedinUrl)}}{linkedin.com/in/${escapeLaTeX(user.linkedinUrl.split('/').pop())}}`);
      if (user.githubUrl) links.push(`\\href{${escapeLaTeX(user.githubUrl)}}{github.com/${escapeLaTeX(user.githubUrl.split('/').pop())}}`);
      if (user.portfolioUrl) links.push(`\\href{${escapeLaTeX(user.portfolioUrl)}}{${escapeLaTeX(user.portfolioUrl.replace(/^https?:\/\//, ''))}}`);
      contact += links.join(' \\\\ ');
    }
    
    return contact;
  };

  // Generate skills section
  const getSkillsSection = () => {
    if (!user.skills || user.skills.length === 0) return '';
    
    const technicalSkills = user.skills.filter(s => 
      ['Expert', 'Advanced', 'Intermediate'].includes(s.proficiency)
    ).map(s => escapeLaTeX(s.name)).join(', ');
    
    const softSkills = ['Communication', 'Problem Solving', 'Team Leadership', 'Project Management'];
    
    return `\\begin{rSection}{SKILLS}

\\begin{tabular}{ @{} >{\\bfseries}l @{\\hspace{6ex}} l }
Technical Skills & ${technicalSkills || 'Various programming languages and frameworks'}
\\\\
Soft Skills & ${softSkills.join(', ')}
\\\\
Tools & ${user.skills.filter(s => s.proficiency === 'Intermediate' || s.proficiency === 'Advanced').map(s => escapeLaTeX(s.name)).join(', ') || 'Various development tools'}
\\\\
\\end{tabular}\\\\
\\end{rSection}`;
  };

  // Generate experience section using rSubsection
  const getExperienceSection = () => {
    if (!user.experiences || user.experiences.length === 0) return '';
    
    return `\\begin{rSection}{EXPERIENCE}

${user.experiences.map(exp => `
\\begin{rSubsection}{${escapeLaTeX(exp.company)}}{${formatDateRange(exp.startDate, exp.endDate)}}{${escapeLaTeX(exp.role)}}{}
\\item ${escapeLaTeX(exp.description)}
${exp.technologies ? `\\item Technologies: ${escapeLaTeX(exp.technologies)}` : ''}
\\end{rSubsection}
`).join('\n')}
\\end{rSection}`;
  };

  // Generate education section
  const getEducationSection = () => {
    if (!user.educations || user.educations.length === 0) return '';
    
    return `\\begin{rSection}{Education}

${user.educations.map(edu => `
{\\bf ${escapeLaTeX(edu.degree)}}, ${escapeLaTeX(edu.institution)} \\hfill {${edu.startYear} - ${edu.endYear || 'Present'}}\\\\
${edu.description ? `Relevant Coursework: ${escapeLaTeX(edu.description)}.` : ''}
`).join('\n')}
\\end{rSection}`;
  };

  // Generate projects section
  const getProjectsSection = () => {
    if (!user.projects || user.projects.length === 0) return '';
    
    return `\\begin{rSection}{PROJECTS}
\\vspace{-1.25em}
${user.projects.map(project => `
\\item \\textbf{${escapeLaTeX(project.title)}.} {${escapeLaTeX(project.description)} ${project.githubUrl ? `\\href{${escapeLaTeX(project.githubUrl)}}{(GitHub)}` : ''} ${project.liveUrl ? `\\href{${escapeLaTeX(project.liveUrl)}}{(Live Demo)}` : ''}}
`).join('')}
\\end{rSection}`;
  };

  // Generate certifications section
  const getCertificationsSection = () => {
    if (!user.certifications || user.certifications.length === 0) return '';
    
    return `\\begin{rSection}{Certifications}
\\begin{itemize}
${user.certifications.map(cert => `
    \\item \\textbf{${escapeLaTeX(cert.title)}} - ${escapeLaTeX(cert.issuer)} (${formatDate(cert.issueDate)}${cert.expiryDate ? ` - ${formatDate(cert.expiryDate)}` : ''})
    ${cert.credentialId ? `\\item Credential ID: ${escapeLaTeX(cert.credentialId)}` : ''}
`).join('')}
\\end{itemize}
\\end{rSection}`;
  };

  // Generate objective based on user data
  const getObjective = () => {
    const experienceYears = user.experiences ? user.experiences.length : 0;
    const topSkills = user.skills ? user.skills
      .filter(s => s.proficiency === 'Expert' || s.proficiency === 'Advanced')
      .map(s => s.name)
      .slice(0, 3)
      .join(', ') : 'various technologies';
    
    return `{Software Engineer with ${experienceYears}+ years of experience in ${topSkills}, seeking full-time software engineering roles.}`;
  };

  // Generate the complete LaTeX document
  const latexContent = `\\documentclass{resume} % Use the custom resume.cls style

\\usepackage[left=0.4 in,top=0.4in,right=0.4 in,bottom=0.4in]{geometry} % Document margins
\\newcommand{\\tab}[1]{\\hspace{.2667\\textwidth}\\rlap{#1}} 
\\newcommand{\\itab}[1]{\\hspace{0em}\\rlap{#1}}
\\name{${escapeLaTeX(user.name)}} % Your name
% You can merge both of these into a single line, if you do not have a website.
\\address{${getContactInfo()}}

\\begin{document}

%----------------------------------------------------------------------------------------
%	OBJECTIVE
%----------------------------------------------------------------------------------------

\\begin{rSection}{OBJECTIVE}

${getObjective()}

\\end{rSection}

%----------------------------------------------------------------------------------------
%	EDUCATION SECTION
%----------------------------------------------------------------------------------------

${getEducationSection()}

%----------------------------------------------------------------------------------------
%	TECHNICAL STRENGTHS	
%----------------------------------------------------------------------------------------
${getSkillsSection()}

%----------------------------------------------------------------------------------------
%	WORK EXPERIENCE SECTION
%----------------------------------------------------------------------------------------

${getExperienceSection()}

%----------------------------------------------------------------------------------------
%	PROJECTS SECTION
%----------------------------------------------------------------------------------------

${getProjectsSection()}

%----------------------------------------------------------------------------------------
%	CERTIFICATIONS SECTION
%----------------------------------------------------------------------------------------

${getCertificationsSection()}

\\end{document}`;

  return latexContent;
}

module.exports = { generateResumeContent };