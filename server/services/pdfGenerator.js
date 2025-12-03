import fs from "fs";
import path from "path";

class PDFGenerator {
  constructor() {
    this.outputDir =
      process.env.NODE_ENV === "production"
        ? "/tmp"
        : path.join(__dirname, "../temp");

    this.ensureOutputDir();
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      try {
        fs.mkdirSync(this.outputDir, { recursive: true });
      } catch {
        this.outputDir = "/tmp";
      }
    }
  }

  /**
   * Public API: generate a PDF from structured resume data.
   * `data` is a JSON object:
   * {
   *   name, phone, email, links[],
   *   summary,
   *   education[], internships[], projects[],
   *   certifications[], skills[], extra[]
   * }
   */
  async generatePDF(data, filename = "resume") {
    const htmlContent = this.createHTML(data);
    return this._generatePDFFromHTML(htmlContent, filename);
  }

  /**
   * Internal helper to render given HTML content into a PDF buffer.
   */
  async _generatePDFFromHTML(htmlContent, filename = "resume") {
    const endpoint =
      process.env.PDF_SERVICE_URL || process.env.BROWSERLESS_PDF_URL;

    if (!endpoint) {
      throw new Error(
        "PDF service URL not configured. Set PDF_SERVICE_URL or BROWSERLESS_PDF_URL in your environment."
      );
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Optional API key header if your provider needs it
          ...(process.env.PDF_SERVICE_API_KEY && {
            "x-api-key": process.env.PDF_SERVICE_API_KEY,
          }),
        },
        body: JSON.stringify({
          // Most hosted Chrome/PDF services (e.g. Browserless) accept raw HTML
          html: htmlContent,
          // Options are accepted by many providers; adjust to your service as needed.
          options: {
            printBackground: true,
            format: "A4",
            margin: {
              top: "0.5in",
              right: "0.5in",
              bottom: "0.5in",
              left: "0.5in",
            },
          },
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
          `Remote PDF service error: ${response.status} ${response.statusText} ${text}`
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (err) {
      console.error("PDF generation error (remote service):", err);
      throw new Error("Failed to generate PDF");
    }
  }

  // ------------------------------------------------------------
  // FORMAT-1 HTML TEMPLATE (ATS-friendly, A4, clean single page)
  // ------------------------------------------------------------
  createHTML(data) {
    const safe = (value) => (value == null ? "" : String(value));
    const list = (arr) => (Array.isArray(arr) ? arr : []);
    const normalizeUrl = (value) => {
      if (!value) return "";
      const trimmed = String(value).trim();
      if (!trimmed) return "";
      return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    };
    const linkLabel = (value) => {
      const friendlyNames = {
        github: "GitHub",
        codechef: "CodeChef",
        geeksforgeeks: "GeeksforGeeks",
        hackerrank: "HackerRank",
        codeforces: "Codeforces",
        leetcode: "LeetCode",
        linkedin: "LinkedIn",
        vercel: "Vercel",
        netlify: "Netlify",
        devfolio: "Devfolio",
        behance: "Behance",
        dribbble: "Dribbble",
        medium: "Medium",
      };
      try {
        const normalized = normalizeUrl(value);
        if (!normalized) return "";
        const hostname = new URL(normalized).hostname.replace(/^www\./i, "");
        const parts = hostname.split(".").filter(Boolean);
        const base =
          parts.length >= 2 ? parts[parts.length - 2] : parts[0] || hostname;
        const friendly = friendlyNames[base.toLowerCase()];
        if (friendly) return friendly;
        return base.charAt(0).toUpperCase() + base.slice(1);
      } catch {
        return value;
      }
    };
    const formatPhone = (value) => {
      if (!value) return "";
      const digitsOnly = String(value).replace(/[^\d+]/g, "");
      return `<a href="tel:${digitsOnly}">${safe(value)}</a>`;
    };
    const formatLink = (value) => {
      const href = normalizeUrl(value);
      if (!href) return "";
      return `<a href="${href}">${linkLabel(value)}</a>`;
    };

    const name = safe(data.name);
    const phone = safe(data.phone);
    const email = safe(data.email);
    const links = list(data.links).map(safe).filter(Boolean);

    const summary = safe(data.summary);
    const education = list(data.education);
    const internships = list(data.internships);
    // Limit projects to top 3 to help keep resume within a single page
    const projects = list(data.projects).slice(0, 3);
    const certifications = list(data.certifications);
    const skills = list(data.skills);
    const extra = list(data.extra);

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Resume</title>
<style>
  body {
    font-family: Arial, sans-serif;
    font-size: 12px;
    color: #000;
    margin: 0;
    padding: 35px;
    line-height: 1.35;
  }

  h1 {
    font-size: 20px;
    margin: 0;
    font-weight: 700;
    text-transform: uppercase;
  }

  .contact {
    margin-top: 3px;
    font-size: 11px;
    color: #333;
  }

  .section {
    margin-top: 18px;
  }

  .section-title {
    font-weight: bold;
    font-size: 13px;
    border-bottom: 1px solid #000;
    padding-bottom: 3px;
    margin-bottom: 8px;
  }

  .item {
    margin-bottom: 10px;
  }

  .item-title {
    font-weight: bold;
    font-size: 12px;
  }

  .item-subtitle {
    font-style: italic;
    font-size: 11px;
    color: #444;
  }

  .item-date {
    font-size: 11px;
    color: #666;
  }

  .item-points {
    margin-top: 4px;
    margin-left: 15px;
  }

  .item-points li {
    margin-bottom: 3px;
  }

  .skills-table td {
    font-size: 11px;
    padding: 2px 4px;
    vertical-align: top;
  }
</style>
</head>

<body>

  <h1>${name}</h1>
  <div class="contact">
    ${[
      phone && formatPhone(phone),
      email && `<a href="mailto:${safe(email)}">${safe(email)}</a>`,
      ...links.map((url) => formatLink(url)).filter(Boolean),
    ]
      .filter(Boolean)
      .join(" • ")}
  </div>

  <div class="section">
    <div class="section-title">PROFESSIONAL SUMMARY</div>
    <div>${summary}</div>
  </div>

  <div class="section">
    <div class="section-title">EDUCATION</div>
    ${education
      .map(
        (ed) => `
      <div class="item">
        <div class="item-title">${safe(ed.degree)}</div>
        <div class="item-subtitle">${safe(ed.institution)}</div>
        <div class="item-date">${safe(ed.years)}</div>
        ${
          ed.grade
            ? `<div class="item-date">Grade: ${safe(ed.grade)}</div>`
            : ""
        }
      </div>
    `
      )
      .join("")}
  </div>

  <div class="section">
    <div class="section-title">INTERNSHIPS</div>
    ${internships
      .map(
        (i) => `
      <div class="item">
        <div class="item-title">${safe(i.role)}</div>
        <div class="item-subtitle">${safe(i.company)}</div>
        <div class="item-date">${safe(i.duration)}</div>
        <ul class="item-points">
          ${list(i.points).map((p) => `<li>${safe(p)}</li>`).join("")}
        </ul>
      </div>
    `
      )
      .join("")}
  </div>

  <div class="section">
    <div class="section-title">PROJECTS</div>
    ${projects
      .map(
        (p) => `
      <div class="item">
        <div class="item-title">${safe(p.name)}</div>
        <div class="item-subtitle">${
          safe(p.links)
            .split("|")
            .map((chunk) => chunk.trim())
            .filter(Boolean)
            .map((chunk) => formatLink(chunk) || safe(chunk))
            .join(" • ")
        }</div>
        <ul class="item-points">
          ${list(p.points).map((pt) => `<li>${safe(pt)}</li>`).join("")}
        </ul>
      </div>
    `
      )
      .join("")}
  </div>

  <div class="section">
    <div class="section-title">CERTIFICATIONS</div>
    <ul class="item-points">
      ${certifications.map((c) => `<li>${safe(c)}</li>`).join("")}
    </ul>
  </div>

  <div class="section">
    <div class="section-title">SKILLS</div>
    <table class="skills-table">
      ${skills
        .map(
          (s) => `
        <tr>
          <td><strong>${safe(s.category)}</strong></td>
          <td>${list(s.items).map(safe).join(", ")}</td>
        </tr>
      `
        )
        .join("")}
    </table>
  </div>

  <div class="section">
    <div class="section-title">EXTRA-CURRICULAR ACTIVITIES</div>
    <ul class="item-points">
      ${extra.map((e) => `<li>${safe(e)}</li>`).join("")}
    </ul>
  </div>

</body>
</html>
    `;
  }

  savePDF(pdfBuffer, filename) {
    const filePath = path.join(this.outputDir, `${filename}.pdf`);
    fs.writeFileSync(filePath, pdfBuffer);
    return filePath;
  }

  cleanupFile(filePath) {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch {}
  }
}

export default PDFGenerator;
