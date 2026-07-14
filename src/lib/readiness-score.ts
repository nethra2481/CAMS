export type CategoryCounts = {
  projects: number;
  hackathons: number;
  internships: number;
  certifications: number;
  openSource: number;
  ctfs: number;
  research: number;
}

export function calculateReadinessScore(counts: CategoryCounts) {
  // Define weights for each category for the placement readiness score (out of 100)
  const weights = {
    projects: 15,
    hackathons: 15,
    internships: 25, // Internships are highly valued
    certifications: 10,
    openSource: 15,
    ctfs: 10,
    research: 10
  };

  let score = 0;
  const improvements: string[] = [];

  // Tiered scoring implementation
  
  // Projects (Max 15): 5 pts per project, cap at 3
  score += Math.min(counts.projects * 5, weights.projects);
  if (counts.projects < 3) {
    improvements.push(`Build ${3 - counts.projects} more personal project(s) to maximize your score.`);
  }

  // Hackathons (Max 15): 7.5 pts per hackathon, cap at 2
  score += Math.min(counts.hackathons * 7.5, weights.hackathons);
  if (counts.hackathons < 2) {
    improvements.push("Participate in more Hackathons to build teamwork and prototyping skills.");
  }

  // Internships (Max 25): 12.5 pts per internship, cap at 2
  score += Math.min(counts.internships * 12.5, weights.internships);
  if (counts.internships < 2) {
    improvements.push("Apply for Internships to gain highly valued industry experience.");
  }

  // Certifications (Max 10): 5 pts per cert, cap at 2
  score += Math.min(counts.certifications * 5, weights.certifications);
  if (counts.certifications < 2) {
    improvements.push("Earn industry-recognized Certifications to validate your knowledge.");
  }

  // Open Source (Max 15): 5 pts per contribution, cap at 3
  score += Math.min(counts.openSource * 5, weights.openSource);
  if (counts.openSource < 1) {
    improvements.push("Contribute to Open Source projects to showcase collaborative coding.");
  }

  // CTFs (Max 10): 5 pts per CTF, cap at 2
  score += Math.min(counts.ctfs * 5, weights.ctfs);
  if (counts.ctfs < 2) {
    improvements.push("Compete in CTFs to sharpen your applied cyber security skills.");
  }

  // Research (Max 10): 10 pts for 1 paper
  score += Math.min(counts.research * 10, weights.research);
  if (counts.research < 1) {
    improvements.push("Publish a Research paper or write technical articles to demonstrate deep expertise.");
  }

  // Cap score to exactly 100 just in case
  score = Math.min(Math.round(score), 100);

  return {
    score,
    improvements: improvements.slice(0, 4) // Only show the top 4 most critical improvements so we don't overwhelm the user
  };
}
