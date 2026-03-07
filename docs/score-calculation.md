# Yakkai Wellness Assessment – Score Calculation

## Overview

The wellness assessment has **12 questions** divided into two sections:

- **Physical Health** — Q1 to Q6 (max 24 points)
- **Emotional / Energy** — Q7 to Q12 (max 24 points)

**Total maximum score: 48 points**

---

## Section 1 — Physical Health (Q1–Q6)

| Q# | Question | Rarely / Best | Sometimes | Often | Always / Worst |
|----|----------|:---:|:---:|:---:|:---:|
| Q1 | Back pain from sitting long hours | 4 | 3 | 2 | 1 |
| Q2 | Neck or shoulder discomfort | 4 | 3 | 2 | 1 |
| Q3 | Hours sitting without a movement break | < 1 hr = **4** | 1–2 hrs = 3 | 2–3 hrs = 2 | > 3 hrs = **1** |
| Q4 | Hours of sleep per night | < 4 hrs = **1** | 4–6 hrs = 2 | 6–8 hrs = **4** | > 8 hrs = 3 |
| Q5 | Wrist / hand pain from typing | 4 | 3 | 2 | 1 |
| Q6 | Screen breaks during workday | Every hr = **4** | 2–3 hrs = 3 | Once a day = 2 | Almost never = **1** |

---

## Section 2 — Emotional & Energy (Q7–Q12)

| Q# | Question | Worst | Low | Moderate | Best |
|----|----------|:---:|:---:|:---:|:---:|
| Q7  | Morning energy level | Very low = **1** | 2 | 3 | High = **4** |
| Q8  | Afternoon energy (2–5 PM) | Fatigued = **1** | 2 | 3 | Still energetic = **4** |
| Q9  | Response to tight deadlines | Overwhelmed = **1** | 2 | 3 | Calm & confident = **4** |
| Q10 | Feeling at end of workday | Exhausted = **1** | 2 | 3 | Energized = **4** |
| Q11 | Mindfulness / relaxation practice | Rarely = **1** | 2 | 3 | Daily = **4** |
| Q12 | Mental clarity and focus at work | Cloudy = **1** | 2 | 3 | Very sharp = **4** |

---

## Score Formula

### Individual Score

$$\text{Total Score} = \sum_{i=1}^{12} \text{value}(\text{answer}_i) \quad (\text{max} = 48)$$

$$\text{Percentage} = \left\lfloor \frac{\text{Total Score}}{48} \times 100 \right\rfloor$$

### Wellness Category (Individual)

| Percentage Range | Category | Colour | Recommendation |
|:---:|---|:---:|---|
| ≥ 80% | 🌿 **Excellent** | Green | Maintenance yoga program |
| 60–79% | ✨ **Good** | Blue | Posture & stress-relief yoga |
| 40–59% | ⚡ **Needs Attention** | Amber | Structured 1-week trial program |
| < 40% | 🔴 **Critical – Act Now** | Red | Immediate guided wellness program |

---

## HR / Team Score (HRDashboard)

HR sees aggregated data from all employees who completed assessments.

### Average Team Wellness Score

$$\text{Avg Score (\%)} = \frac{\displaystyle\sum_{i=1}^{n} \left\lfloor \frac{\text{score}_i}{\text{max}_i} \times 100 \right\rfloor}{n}$$

Where `n` = total number of completed assessments.

### HR Dashboard Stats

| Stat Card | How It's Calculated |
|-----------|---------------------|
| Campaigns Created | Count of HR campaigns created |
| Employees Invited | Sum of all employees across all campaigns |
| Assessments Done | Count of completed submissions in localStorage |
| **Avg Wellness Score %** | Sum of all individual % ÷ total completions |

### Team Category Labels (same thresholds)

| % | Label | Colour |
|:---:|---|:---:|
| ≥ 80% | Excellent | 🟢 Green |
| ≥ 60% | Good | 🔵 Blue |
| ≥ 40% | Needs Attention | 🟠 Amber |
| < 40% | Critical | 🔴 Red |

---

## Data Flow

```
Employee opens unique link → /assessment/employee/:linkId
        ↓
Answers 12 questions (each valued 1–4)
        ↓
Score = sum of 12 answers  (range: 12–48)
Percentage = (score / 48) × 100
        ↓
Result saved to localStorage (key: wellness_results)
        ↓
HR Dashboard reads localStorage
        ↓
Team Avg = sum of all % scores ÷ count
```

---

## Source Files

| File | Purpose |
|------|---------|
| `frontend/src/pages/assessment/EmployeeAssessment.jsx` | Questions, per-employee scoring, ScoreGauge UI |
| `frontend/src/pages/assessment/PhysicalHealthAssessment.jsx` | Public (individual) wellness check |
| `frontend/src/pages/assessment/HRDashboard.jsx` | Team average, campaign management |
