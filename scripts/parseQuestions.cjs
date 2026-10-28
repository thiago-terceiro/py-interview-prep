const fs = require('fs');
const path = require('path');

const rawPath = path.join(__dirname, 'raw_questions.txt');
const rawText = fs.readFileSync(rawPath, 'utf8');

const lines = rawText.split(/\r?\n/);

const questions = [];

let currentSection = 'Classical ML, Feature Engineering & Fraud/Anomaly Detection';

let i = 0;

while (i < lines.length) {
  const line = lines[i];

  if (line.includes('Section A:')) {
    currentSection = 'Classical ML, Feature Engineering & Fraud/Anomaly Detection';
    i++;
    continue;
  } else if (line.includes('Section B:')) {
    currentSection = 'Ultra-Low-Latency Inference, ONNX & Real-Time Data Stores';
    i++;
    continue;
  } else if (line.includes('Section C:')) {
    currentSection = 'MLOps, Drift Detection, CI/CD & Observability';
    i++;
    continue;
  } else if (line.includes('Section D:')) {
    currentSection = 'Agentic Workflows, LangGraph, State Machines & LLMs';
    i++;
    continue;
  } else if (line.includes('Section E:')) {
    currentSection = 'Distributed Systems, Security, RBAC & Cryptographic Auditing';
    i++;
    continue;
  } else if (line.includes('Section F:')) {
    currentSection = 'High-Performance React/Next.js Streaming UI & Accessibility';
    i++;
    continue;
  } else if (line.includes('Part 2: Open-Ended')) {
    currentSection = 'Open-Ended System Design & Scenario';
    i++;
    continue;
  }

  // Check if line starts with "<number>. "
  const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
  if (numMatch) {
    const id = parseInt(numMatch[1], 10);
    let questionText = numMatch[2].trim();
    i++;

    // Could question text continue on next lines before options/criteria?
    while (i < lines.length && !lines[i].match(/^\s*\*\s+[A-D]\)/) && !lines[i].includes('Acceptable Answer Criteria:') && !lines[i].match(/^(\d+)\.\s+/)) {
      if (lines[i].trim() !== '') {
        questionText += ' ' + lines[i].trim();
      }
      i++;
    }

    if (id <= 70) {
      // MCQ
      const options = { A: '', B: '', C: '', D: '' };
      let answer = 'A';
      let why = '';

      while (i < lines.length && !lines[i].match(/^(\d+)\.\s+/) && !lines[i].includes('Section ') && !lines[i].includes('Part 2:')) {
        const optLine = lines[i];
        const optMatch = optLine.match(/^\s*\*\s+([A-D])\)\s+(.*)$/);
        if (optMatch) {
          const letter = optMatch[1];
          let optText = optMatch[2].trim();
          i++;
          // check continuation of option
          while (i < lines.length && !lines[i].match(/^\s*\*\s+([A-D]\)|Answer:)/) && !lines[i].match(/^(\d+)\.\s+/) && !lines[i].includes('Section ') && !lines[i].includes('Part 2:')) {
            if (lines[i].trim()) {
              optText += ' ' + lines[i].trim();
            }
            i++;
          }
          options[letter] = optText;
          continue;
        }

        const ansMatch = optLine.match(/^\s*\*\s+Answer:\s*([A-D])\s*\|\s*Why:\s*(.*)$/i);
        if (ansMatch) {
          answer = ansMatch[1].toUpperCase();
          let whyText = ansMatch[2].trim();
          i++;
          while (i < lines.length && !lines[i].match(/^(\d+)\.\s+/) && !lines[i].includes('Section ') && !lines[i].includes('Part 2:')) {
            if (lines[i].trim()) {
              whyText += ' ' + lines[i].trim();
            }
            i++;
          }
          why = whyText;
          break;
        }

        i++;
      }

      questions.push({
        id,
        type: 'multiple-choice',
        section: currentSection,
        question: questionText,
        options,
        answer,
        explanation: why
      });
    } else {
      // Open-ended
      const criteria = [];
      while (i < lines.length && !lines[i].match(/^(\d+)\.\s+/)) {
        const critLine = lines[i];
        if (critLine.includes('Acceptable Answer Criteria:')) {
          i++;
          continue;
        }

        // bullet criterion
        const bulletMatch = critLine.match(/^\s*\*\s+(.*)$/);
        if (bulletMatch) {
          let critText = bulletMatch[1].trim();
          i++;
          // continuation lines that are indented
          while (i < lines.length && !lines[i].match(/^\s*\*\s+/) && !lines[i].match(/^(\d+)\.\s+/)) {
            if (lines[i].trim()) {
              critText += ' ' + lines[i].trim();
            }
            i++;
          }
          criteria.push(critText);
          continue;
        }

        i++;
      }

      questions.push({
        id,
        type: 'open-ended',
        section: currentSection,
        question: questionText,
        acceptableCriteria: criteria
      });
    }
  } else {
    i++;
  }
}

console.log(`Parsed ${questions.length} questions.`);
console.log(`MCQ count: ${questions.filter(q => q.type === 'multiple-choice').length}`);
console.log(`Open-ended count: ${questions.filter(q => q.type === 'open-ended').length}`);

// Check for any missing options or answers
for (const q of questions) {
  if (q.type === 'multiple-choice') {
    if (!q.options.A || !q.options.B || !q.options.C || !q.options.D) {
      console.error(`Question ${q.id} missing option!`, q.options);
    }
    if (!q.answer) {
      console.error(`Question ${q.id} missing answer!`);
    }
    if (!q.explanation) {
      console.error(`Question ${q.id} missing explanation!`);
    }
  } else {
    if (!q.acceptableCriteria || q.acceptableCriteria.length === 0) {
      console.error(`Question ${q.id} missing criteria!`);
    }
  }
}

// Generate the TypeScript file
const outPath = path.join(__dirname, '..', 'src', 'data', 'quizQuestions.ts');
const fileContent = `import { QuizQuestion } from '../types/quiz';

export const quizQuestions: QuizQuestion[] = ${JSON.stringify(questions, null, 2)};
`;

fs.writeFileSync(outPath, fileContent, 'utf8');
console.log(`Wrote quizQuestions.ts successfully (${(fileContent.length / 1024).toFixed(1)} KB)`);
