import os
import re
import json

from expanded_q_level1 import LEVEL_1_EXPLANATIONS
from expanded_q_level2 import LEVEL_2_EXPLANATIONS
from expanded_q_level3 import LEVEL_3_EXPLANATIONS
from expanded_q_level4 import LEVEL_4_EXPLANATIONS
from expanded_q_level5 import LEVEL_5_EXPLANATIONS

# Combine all 200 expanded explanations
EXPLANATIONS = {
    **LEVEL_1_EXPLANATIONS,
    **LEVEL_2_EXPLANATIONS,
    **LEVEL_3_EXPLANATIONS,
    **LEVEL_4_EXPLANATIONS,
    **LEVEL_5_EXPLANATIONS,
}

RAW_PATH = os.path.join(os.path.dirname(__file__), 'raw_questions.txt')
OUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'quizQuestions.ts')

with open(RAW_PATH, 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()

questions = []
current_section = 'Level 1: Introductory'

i = 0
while i < len(lines):
    line = lines[i].strip()
    
    # Section headers
    if 'Level 1: Introductory' in line:
        current_section = 'Level 1: Introductory'
        i += 1
        continue
    elif 'Level 2: Beginner' in line:
        current_section = 'Level 2: Beginner'
        i += 1
        continue
    elif 'Level 3: Intermediate' in line:
        current_section = 'Level 3: Intermediate'
        i += 1
        continue
    elif 'Level 4: Advanced' in line:
        current_section = 'Level 4: Advanced'
        i += 1
        continue
    elif 'Level 5: Master' in line:
        current_section = 'Level 5: Master'
        i += 1
        continue
    
    # Question line: e.g. "1. What is ..."
    q_match = re.match(r'^(\d+)\.\s+(.*)$', line)
    if q_match:
        qid = int(q_match.group(1))
        q_text = q_match.group(2).strip()
        i += 1
        
        # Collect multi-line question text if any before options
        while i < len(lines) and not re.match(r'^[A-D]\)', lines[i].strip()) and not re.match(r'^\d+\.', lines[i].strip()) and not lines[i].startswith('##'):
            if lines[i].strip():
                q_text += ' ' + lines[i].strip()
            i += 1
        
        options = {}
        # Parse options A, B, C, D
        for opt_letter in ['A', 'B', 'C', 'D']:
            while i < len(lines) and not lines[i].strip().startswith(f'{opt_letter})'):
                i += 1
            if i < len(lines):
                opt_line = lines[i].strip()
                opt_match = re.match(rf'^{opt_letter}\)\s*(.*)$', opt_line)
                if opt_match:
                    opt_content = opt_match.group(1).strip()
                    i += 1
                    # Continuation lines for option
                    while i < len(lines) and not re.match(r'^[A-D]\)', lines[i].strip()) and not lines[i].strip().startswith('Answer:') and not re.match(r'^\d+\.', lines[i].strip()):
                        if lines[i].strip():
                            opt_content += ' ' + lines[i].strip()
                        i += 1
                    options[opt_letter] = opt_content
        
        # Parse Answer: X
        while i < len(lines) and not lines[i].strip().startswith('Answer:'):
            i += 1
        
        ans_line = lines[i].strip() if i < len(lines) else ''
        ans_match = re.match(r'^Answer:\s*([A-D])', ans_line)
        if not ans_match:
            raise ValueError(f"Could not parse answer for question {qid}: '{ans_line}'")
        answer = ans_match.group(1)
        i += 1
        
        explanation = EXPLANATIONS.get(qid, "")
        if not explanation:
            raise ValueError(f"Missing explanation for question {qid}!")
        
        questions.append({
            "id": qid,
            "type": "multiple-choice",
            "section": current_section,
            "question": q_text,
            "options": options,
            "answer": answer,
            "explanation": explanation
        })
    else:
        i += 1

print(f"Parsed {len(questions)} questions.")

# Validation
assert len(questions) == 200, f"Expected 200 questions, got {len(questions)}"
for idx, q in enumerate(questions):
    assert q['id'] == idx + 1, f"Question ID mismatch at index {idx}: expected {idx + 1}, got {q['id']}"
    assert len(q['options']) == 4, f"Question {q['id']} does not have 4 options: {q['options']}"
    for k in ['A', 'B', 'C', 'D']:
        assert q['options'].get(k), f"Question {q['id']} option {k} is empty"
    assert q['answer'] in ['A', 'B', 'C', 'D'], f"Question {q['id']} invalid answer {q['answer']}"
    assert len(q['explanation']) > 100, f"Question {q['id']} explanation too short: {q['explanation']}"

# Write TypeScript file
ts_content = f"""import type {{ QuizQuestion }} from '../types/quiz';

export const quizQuestions: QuizQuestion[] = {json.dumps(questions, indent=2, ensure_ascii=False)};
"""

with open(OUT_PATH, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Successfully generated {OUT_PATH} with {len(questions)} questions!")
