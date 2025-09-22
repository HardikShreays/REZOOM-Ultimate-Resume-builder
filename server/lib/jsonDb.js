const fs = require('fs');
const path = require('path');

class JsonDatabase {
  constructor() {
    this.dbPath = path.join(__dirname, '../data/db.json');
    this.init();
  }

  init() {
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Create db.json if it doesn't exist
    if (!fs.existsSync(this.dbPath)) {
      this.writeData({
        users: [],
        resumes: [],
        experiences: [],
        educations: [],
        skills: [],
        projects: [],
        certifications: []
      });
    }
  }

  readData() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading database:', error);
      return {
        users: [],
        resumes: [],
        experiences: [],
        educations: [],
        skills: [],
        projects: [],
        certifications: []
      };
    }
  }

  writeData(data) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing database:', error);
    }
  }

  // User methods
  createUser(userData) {
    const data = this.readData();
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    data.users.push(newUser);
    this.writeData(data);
    return newUser;
  }

  findUserByEmail(email) {
    const data = this.readData();
    return data.users.find(user => user.email === email);
  }

  findUserById(id) {
    const data = this.readData();
    return data.users.find(user => user.id === id);
  }

  // Resume methods
  createResume(resumeData) {
    const data = this.readData();
    const newResume = {
      id: Date.now(),
      ...resumeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.resumes.push(newResume);
    this.writeData(data);
    return newResume;
  }

  getUserResumes(userId) {
    const data = this.readData();
    return data.resumes.filter(resume => resume.userId === userId);
  }

  deleteResume(id, userId) {
    const data = this.readData();
    const index = data.resumes.findIndex(resume => resume.id === id && resume.userId === userId);
    if (index !== -1) {
      data.resumes.splice(index, 1);
      this.writeData(data);
      return true;
    }
    return false;
  }
}

module.exports = new JsonDatabase();

