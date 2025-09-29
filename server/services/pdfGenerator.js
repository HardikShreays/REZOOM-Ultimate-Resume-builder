const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const fs = require('fs');
const path = require('path');

class PDFGenerator {
  constructor() {
    // Use /tmp directory for Vercel serverless environment
    this.outputDir = process.env.NODE_ENV === 'production' ? '/tmp' : path.join(__dirname, '../temp');
    this.ensureOutputDir();
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      try {
        fs.mkdirSync(this.outputDir, { recursive: true });
      } catch (error) {
        // If we can't create the directory, use /tmp as fallback
        this.outputDir = '/tmp';
        console.log('Using /tmp directory for PDF generation');
      }
    }
  }

  async generatePDFFromLaTeX(latexContent, filename = 'resume') {
    let browser;
    try {
      // Create HTML content with LaTeX rendering
      const htmlContent = this.createHTMLWithLaTeX(latexContent);

      // Generate PDF using Puppeteer with serverless-compatible chromium
      const isProduction = process.env.NODE_ENV === 'production';
      
      browser = await puppeteer.launch({
        headless: true,
        args: isProduction 
          ? [
              ...chromium.args,
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-accelerated-2d-canvas',
              '--no-first-run',
              '--no-zygote',
              '--single-process',
              '--disable-gpu'
            ]
          : [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-accelerated-2d-canvas',
              '--no-first-run',
              '--no-zygote',
              '--single-process',
              '--disable-gpu'
            ],
        executablePath: isProduction 
          ? await chromium.executablePath() 
          : undefined
      });

      const page = await browser.newPage();
      
      // Set page size to A4
      await page.setViewport({
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
        deviceScaleFactor: 1
      });

      // Set content directly instead of using file:// protocol
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
      });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        }
      });

      await browser.close();

      return pdfBuffer;

    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF');
    } finally {
      // Ensure browser is closed even if an error occurs
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error('Error closing browser:', closeError);
        }
      }
    }
  }

  createHTMLWithLaTeX(latexContent) {
    // For now, we'll create a simple HTML representation
    // In a production environment, you'd want to use a LaTeX-to-HTML converter
    // like MathJax or KaTeX for proper LaTeX rendering
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume Preview</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
            margin: 0;
            padding: 20px;
            background: white;
        }
        
        .latex-content {
            white-space: pre-wrap;
            font-family: 'Courier New', monospace;
            font-size: 10px;
            line-height: 1.2;
        }
        
        .resume-header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        
        .resume-header h1 {
            font-size: 18px;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
        }
        
        .resume-header p {
            font-size: 11px;
            margin: 5px 0;
        }
        
        .section {
            margin-bottom: 15px;
        }
        
        .section-title {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #333;
            margin-bottom: 8px;
            padding-bottom: 2px;
        }
        
        .experience-item, .education-item, .project-item {
            margin-bottom: 10px;
            padding-left: 10px;
        }
        
        .item-title {
            font-weight: bold;
            font-size: 11px;
        }
        
        .item-company, .item-institution {
            font-style: italic;
            font-size: 10px;
        }
        
        .item-date {
            font-size: 10px;
            color: #666;
        }
        
        .item-description {
            font-size: 10px;
            margin-top: 3px;
        }
        
        .skills-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }
        
        .skills-table td {
            padding: 2px 5px;
            border: none;
        }
        
        .skills-table td:first-child {
            font-weight: bold;
            width: 30%;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    ${this.convertLaTeXToHTML(latexContent)}
</body>
</html>
    `;
  }

  convertLaTeXToHTML(latexContent) {
    // Basic LaTeX to HTML conversion
    // This is a simplified version - for production, consider using a proper LaTeX parser
    
    let html = latexContent;
    
    // Remove LaTeX document structure
    html = html.replace(/\\documentclass\{.*?\}/g, '');
    html = html.replace(/\\usepackage\{.*?\}/g, '');
    html = html.replace(/\\newcommand\{.*?\}/g, '');
    html = html.replace(/\\name\{([^}]+)\}/g, '<div class="resume-header"><h1>$1</h1>');
    html = html.replace(/\\address\{([^}]+)\}/g, '<p>$1</p></div>');
    html = html.replace(/\\begin\{document\}/g, '');
    html = html.replace(/\\end\{document\}/g, '');
    
    // Convert sections
    html = html.replace(/\\begin\{rSection\}\{([^}]+)\}/g, '<div class="section"><div class="section-title">$1</div>');
    html = html.replace(/\\end\{rSection\}/g, '</div>');
    
    // Convert subsections
    html = html.replace(/\\begin\{rSubsection\}\{([^}]+)\}\{([^}]+)\}\{([^}]*)\}\{([^}]*)\}/g, 
        '<div class="experience-item"><div class="item-title">$1</div><div class="item-company">$3</div><div class="item-date">$2</div>');
    html = html.replace(/\\end\{rSubsection\}/g, '</div>');
    
    // Convert items
    html = html.replace(/\\item\s+(.+)/g, '<div class="item-description">• $1</div>');
    
    // Convert bold text
    html = html.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
    html = html.replace(/\\bf\s+([^{]+)/g, '<strong>$1</strong>');
    
    // Convert italic text
    html = html.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
    html = html.replace(/\\em\s+([^{]+)/g, '<em>$1</em>');
    
    // Convert tables
    html = html.replace(/\\begin\{tabular\}\s*\{[^}]*\}([\s\S]*?)\\end\{tabular\}/g, (match, content) => {
        // Normalize line breaks and remove trailing row terminators
        const normalized = content
          .replace(/\n+/g, '\n')
          .trim();
        
        // Split into rows by LaTeX row separator (two backslashes)
        const rows = normalized.split(/\\\\\s*/).map(r => r.trim()).filter(Boolean);
        if (rows.length === 0) {
          return '<table class="skills-table"></table>';
        }
        
        const trs = rows.map(row => {
          // Split columns by '&'
          const cols = row.split(/\s*&\s*/).map(c => c.trim());
          const tds = cols.map(c => `<td>${c}</td>`).join('');
          return `<tr>${tds}</tr>`;
        }).join('');
        
        return `<table class="skills-table">${trs}</table>`;
    });
    
    // Convert href links
    html = html.replace(/\\href\{([^}]+)\}\{([^}]+)\}/g, '<a href="$1">$2</a>');
    
    // Clean up line breaks
    html = html.replace(/\\\\/g, '<br>');
    html = html.replace(/\n\s*\n/g, '<br><br>');
    html = html.replace(/\n/g, ' ');
    
    // Clean up extra spaces
    html = html.replace(/\s+/g, ' ');
    
    return html;
  }

  async savePDF(pdfBuffer, filename) {
    const filePath = path.join(this.outputDir, `${filename}.pdf`);
    fs.writeFileSync(filePath, pdfBuffer);
    return filePath;
  }

  cleanupFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

module.exports = PDFGenerator;

