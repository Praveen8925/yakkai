import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

// ─── Question Bank (same as individual) ──────────────────────────────────────
const physicalQuestions = [
    {
        id: 'q1', text: 'How often do you experience back pain due to sitting for long hours?',
        options: [{ label: 'Rarely', value: 4 }, { label: 'Sometimes', value: 3 }, { label: 'Often', value: 2 }, { label: 'Always', value: 1 }]
    },
    {
        id: 'q2', text: 'Do you experience neck or shoulder discomfort during or after work?',
        options: [{ label: 'Rarely', value: 4 }, { label: 'Sometimes', value: 3 }, { label: 'Often', value: 2 }, { label: 'Always', value: 1 }]
    },
    {
        id: 'q3', text: 'How many hours do you typically sit without taking a movement break?',
        options: [{ label: 'Less than 1 hour', value: 4 }, { label: '1–2 hours', value: 3 }, { label: '2–3 hours', value: 2 }, { label: 'More than 3 hours', value: 1 }]
    },
    {
        id: 'q4', text: 'How many hours of sleep do you get on an average night?',
        options: [{ label: 'Less than 4 hours', value: 1 }, { label: '4–6 hours', value: 2 }, { label: '6–8 hours', value: 4 }, { label: 'More than 8 hours', value: 3 }]
    },
    {
        id: 'q5', text: 'Do you experience wrist or hand pain from typing / using a mouse?',
        options: [{ label: 'Rarely', value: 4 }, { label: 'Sometimes', value: 3 }, { label: 'Often', value: 2 }, { label: 'Always', value: 1 }]
    },
    {
        id: 'q6', text: 'How frequently do you take screen breaks during your workday?',
        options: [{ label: 'Every hour', value: 4 }, { label: 'Every 2–3 hours', value: 3 }, { label: 'Once a day', value: 2 }, { label: 'Almost never', value: 1 }]
    },
];

const emotionalQuestions = [
    {
        id: 'q7', text: 'How would you rate your energy level in the morning?',
        options: [{ label: 'Very low', value: 1 }, { label: 'Low', value: 2 }, { label: 'Moderate', value: 3 }, { label: 'High', value: 4 }]
    },
    {
        id: 'q8', text: 'How do you feel in the afternoon (2–5 PM)?',
        options: [{ label: 'Very low / fatigued', value: 1 }, { label: 'Low energy', value: 2 }, { label: 'Moderate', value: 3 }, { label: 'Still energetic', value: 4 }]
    },
    {
        id: 'q9', text: 'How do you typically respond to tight deadlines or high-pressure situations?',
        options: [{ label: 'Overwhelmed', value: 1 }, { label: 'Stressed but manageable', value: 2 }, { label: 'Comfortable', value: 3 }, { label: 'Calm and confident', value: 4 }]
    },
    {
        id: 'q10', text: 'How do you usually feel at the end of your workday?',
        options: [{ label: 'Completely exhausted', value: 1 }, { label: 'Stressed', value: 2 }, { label: 'Relaxed', value: 3 }, { label: 'Energized', value: 4 }]
    },
    {
        id: 'q11', text: 'How often do you practice any mindfulness, meditation, or relaxation technique?',
        options: [{ label: 'Rarely', value: 1 }, { label: 'Occasionally', value: 2 }, { label: 'Often', value: 3 }, { label: 'Daily', value: 4 }]
    },
    {
        id: 'q12', text: 'How would you describe your mental clarity and focus at work?',
        options: [{ label: 'Often cloudy / distracted', value: 1 }, { label: 'Sometimes unclear', value: 2 }, { label: 'Mostly clear', value: 3 }, { label: 'Very sharp and focused', value: 4 }]
    },
];

function getWellnessCategory(score, max) {
    const pct = (score / max) * 100;
    if (pct >= 80) return { label: 'Excellent', color: '#16a34a', bg: 'bg-green-50', border: 'border-green-400', desc: 'Great shape! Your healthy habits are making a real difference. Consider a maintenance yoga program.', icon: '🌿' };
    if (pct >= 60) return { label: 'Good', color: '#2563eb', bg: 'bg-blue-50', border: 'border-blue-400', desc: 'Solid foundation! A targeted corporate yoga program focusing on posture and stress relief would be beneficial.', icon: '✨' };
    if (pct >= 40) return { label: 'Needs Attention', color: '#d97706', bg: 'bg-amber-50', border: 'border-amber-400', desc: 'Several areas call for improvement. A structured 1-week trial program is recommended immediately.', icon: '⚡' };
    return { label: 'Critical – Act Now', color: '#dc2626', bg: 'bg-red-50', border: 'border-red-400', desc: 'Your wellness needs immediate attention. Please speak to your HR or start a guided wellness program urgently.', icon: '🔴' };
}

function QuestionCard({ question, answer, onAnswer, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-4"
        >
            <p className="text-gray-800 font-semibold mb-4 leading-relaxed">
                <span className="inline-block bg-green-100 text-green-700 rounded-full w-7 h-7 text-sm font-bold text-center leading-7 mr-2">
                    {index + 1}
                </span>
                {question.text}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {question.options.map((opt) => {
                    const selected = answer === opt.value;
                    return (
                        <button key={opt.value} onClick={() => onAnswer(question.id, opt.value)}
                            className={`text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200
                                ${selected ? 'border-green-500 bg-green-50 text-green-800 shadow-sm' : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-green-300 hover:bg-green-50/50'}`}>
                            {selected && <span className="mr-2">✓</span>}
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
}

function ScoreGauge({ score, max }) {
    const pct = Math.round((score / max) * 100);
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (pct / 100) * circumference;
    const cat = getWellnessCategory(score, max);
    return (
        <div className="flex flex-col items-center">
            <svg width="140" height="140" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                <motion.circle cx="60" cy="60" r="54" fill="none" stroke={cat.color} strokeWidth="12"
                    strokeLinecap="round" strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    style={{ transformOrigin: '60px 60px', transform: 'rotate(-90deg)' }} />
                <text x="60" y="55" textAnchor="middle" fontSize="22" fontWeight="bold" fill={cat.color}>{pct}</text>
                <text x="60" y="72" textAnchor="middle" fontSize="11" fill="#6b7280">/ 100</text>
            </svg>
            <span className="mt-2 text-lg font-bold" style={{ color: cat.color }}>{cat.icon} {cat.label}</span>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const EmployeeAssessment = () => {
    const { linkId } = useParams();
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState({});
    const [info, setInfo] = useState({ name: '', mobile: '', city: '', designation: '' });
    const [errors, setErrors] = useState({});
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [campaign, setCampaign] = useState(null);
    const [employeeEmail, setEmployeeEmail] = useState(null);

    useEffect(() => {
        // 1. Quick local check first
        const localResults = JSON.parse(localStorage.getItem('wellness_results') || '[]');
        if (localResults.find(r => r.linkId === linkId)) {
            setAlreadySubmitted(true);
            return;
        }

        // 2. Check DB via API
        api.get(`/assessment/check/${linkId}`).then(res => {
            if (res.data.submitted) { setAlreadySubmitted(true); return; }
        }).catch(() => {});

        // 3. Find campaign — try API first, fall back to localStorage
        api.get('/assessment/campaigns').then(res => {
            const campaigns = res.data.data || [];
            for (const c of campaigns) {
                const emp = c.employees.find(e => e.linkId === linkId);
                if (emp) { setCampaign(c); setEmployeeEmail(emp.email); break; }
            }
        }).catch(() => {
            // Fallback: localStorage
            const campaigns = JSON.parse(localStorage.getItem('hr_campaigns') || '[]');
            for (const c of campaigns) {
                const emp = c.employees.find(e => e.linkId === linkId);
                if (emp) { setCampaign(c); setEmployeeEmail(emp.email); break; }
            }
        });
    }, [linkId]);

    const handleAnswer = (id, value) => setAnswers(prev => ({ ...prev, [id]: value }));

    const allPhysicalAnswered = physicalQuestions.every(q => answers[q.id] !== undefined);
    const allEmotionalAnswered = emotionalQuestions.every(q => answers[q.id] !== undefined);

    const validateInfo = () => {
        const errs = {};
        if (!info.name.trim() || info.name.trim().length < 2) errs.name = 'Please enter your full name.';
        if (!info.mobile.match(/^[6-9]\d{9}$/)) errs.mobile = 'Please enter a valid 10-digit mobile number.';
        if (!info.city.trim() || info.city.trim().length < 2) errs.city = 'Please enter your city.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateInfo()) return;
        setIsSubmitting(true);
        setSubmitError('');

        const allQ = [...physicalQuestions, ...emotionalQuestions];
        const totalScore     = allQ.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
        const totalMax       = allQ.length * 4;
        const physicalScore  = physicalQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
        const emotionalScore = emotionalQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);

        const payload = {
            type:           'employee',
            name:           info.name,
            email:          employeeEmail || 'unknown',
            mobile:         info.mobile,
            city:           info.city,
            designation:    info.designation,
            linkId,
            campaignId:     campaign?.id    || null,
            campaignName:   campaign?.name  || null,
            physicalScore,
            physicalMax:    physicalQuestions.length * 4,
            emotionalScore,
            emotionalMax:   emotionalQuestions.length * 4,
            totalScore,
            totalMax,
            answers,
        };

        try {
            await api.post('/assessment/submit', payload);
        } catch (err) {
            if (err.response?.data?.error === 'already_submitted') {
                setAlreadySubmitted(true);
                return;
            }
            // Non-fatal: save offline and continue
            setSubmitError('Could not reach server — your score is saved locally.');
        } finally {
            setIsSubmitting(false);
        }

        // Always cache locally so duplicate check works offline too
        const existing = JSON.parse(localStorage.getItem('wellness_results') || '[]');
        existing.push({ ...payload, score: totalScore, max: totalMax, date: new Date().toISOString() });
        localStorage.setItem('wellness_results', JSON.stringify(existing));
        setStep(4);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalScore = [...physicalQuestions, ...emotionalQuestions].reduce((s, q) => s + (answers[q.id] || 0), 0);
    const maxScore = ([...physicalQuestions, ...emotionalQuestions].length) * 4;
    const cat = getWellnessCategory(totalScore, maxScore);
    const physicalScore = physicalQuestions.reduce((s, q) => s + (answers[q.id] || 0), 0);
    const emotionalScore = emotionalQuestions.reduce((s, q) => s + (answers[q.id] || 0), 0);

    // Already submitted state
    if (alreadySubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)' }}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md mx-4">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Already Submitted</h2>
                    <p className="text-gray-500 mb-6">You've already completed this wellness assessment. Thank you for participating!</p>
                    <Link to="/programs/corporate-yoga" className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                        Explore Yoga Programs
                    </Link>
                </motion.div>
            </div>
        );
    }

    // Invalid link state
    if (!campaign && linkId && step < 4) {
        // Allow access even if campaign not found (could be from old data)
    }

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%)' }}>
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm">🧘</div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm leading-none">Yakkai Neri</p>
                            <p className="text-xs text-gray-400">Wellness Assessment</p>
                        </div>
                    </div>
                    {campaign && (
                        <div className="text-right">
                            <p className="text-xs font-semibold text-gray-700">{campaign.name}</p>
                            {employeeEmail && <p className="text-xs text-gray-400">{employeeEmail}</p>}
                        </div>
                    )}
                    {step < 4 && (
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Step {step} / 3</span>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            {step < 4 && (
                <div className="max-w-3xl mx-auto px-4 mt-4">
                    <div className="flex gap-2">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-green-500' : 'bg-gray-200'}`} />
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Physical Health</span><span>Emotional Wellbeing</span><span>Your Info</span>
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto px-4 py-8">
                {campaign && step < 4 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 mb-6 flex items-center gap-3">
                        <span className="text-green-600 text-xl">🏢</span>
                        <div>
                            <p className="text-green-800 font-semibold text-sm">{campaign.name}</p>
                            <p className="text-green-600 text-xs">Sent by {campaign.createdBy} · {campaign.department && `${campaign.department} Team`}</p>
                        </div>
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {/* ── STEP 1: Physical Health ── */}
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
                            <div className="text-center mb-8">
                                <span className="text-4xl">🧘</span>
                                <h2 className="text-2xl font-bold text-gray-800 mt-2">Physical Health</h2>
                                <p className="text-gray-500 mt-1 text-sm">6 questions about your physical workplace habits — takes just 2 minutes</p>
                            </div>
                            {physicalQuestions.map((q, i) => (
                                <QuestionCard key={q.id} question={q} answer={answers[q.id]} onAnswer={handleAnswer} index={i} />
                            ))}
                            <div className="flex justify-end mt-6">
                                <button onClick={() => { if (allPhysicalAnswered) { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); } }} disabled={!allPhysicalAnswered}
                                    className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-md
                                        ${allPhysicalAnswered ? 'bg-green-500 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}>
                                    Next →
                                </button>
                            </div>
                            {!allPhysicalAnswered && <p className="text-center text-sm text-amber-600 mt-2">Answer all questions to continue.</p>}
                        </motion.div>
                    )}

                    {/* ── STEP 2: Emotional Wellbeing ── */}
                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
                            <div className="text-center mb-8">
                                <span className="text-4xl">💚</span>
                                <h2 className="text-2xl font-bold text-gray-800 mt-2">Emotional Wellbeing</h2>
                                <p className="text-gray-500 mt-1 text-sm">6 questions about your energy, stress, and mental clarity</p>
                            </div>
                            {emotionalQuestions.map((q, i) => (
                                <QuestionCard key={q.id} question={q} answer={answers[q.id]} onAnswer={handleAnswer} index={i} />
                            ))}
                            <div className="flex justify-between mt-6">
                                <button onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-6 py-3 rounded-xl font-semibold text-gray-600 border-2 border-gray-200 hover:border-gray-400 transition">← Back</button>
                                <button onClick={() => { if (allEmotionalAnswered) { setStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }); } }} disabled={!allEmotionalAnswered}
                                    className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-md
                                        ${allEmotionalAnswered ? 'bg-green-500 hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}>
                                    Next →
                                </button>
                            </div>
                            {!allEmotionalAnswered && <p className="text-center text-sm text-amber-600 mt-2">Answer all questions to continue.</p>}
                        </motion.div>
                    )}

                    {/* ── STEP 3: Personal Info ── */}
                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
                            <div className="text-center mb-8">
                                <span className="text-4xl">👤</span>
                                <h2 className="text-2xl font-bold text-gray-800 mt-2">Your Details</h2>
                                <p className="text-gray-500 mt-1">Just a few details to personalise your report</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 space-y-5">
                                {employeeEmail && (
                                    <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
                                        <span className="text-green-600">📧</span>
                                        <div>
                                            <p className="text-xs text-green-600">Email pre-filled from your invitation</p>
                                            <p className="text-sm font-semibold text-green-800">{employeeEmail}</p>
                                        </div>
                                    </div>
                                )}
                                {[
                                    { name: 'name', label: 'Full Name *', type: 'text', placeholder: 'Enter your full name', autoComplete: 'name' },
                                    { name: 'mobile', label: 'Mobile Number *', type: 'tel', placeholder: '10-digit mobile number', autoComplete: 'tel' },
                                    { name: 'city', label: 'City *', type: 'text', placeholder: 'e.g., Coimbatore', autoComplete: 'address-level2' },
                                    { name: 'designation', label: 'Designation (Optional)', type: 'text', placeholder: 'e.g., Software Engineer', autoComplete: 'organization-title' },
                                ].map(field => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{field.label}</label>
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={info[field.name]}
                                            onChange={e => { setInfo(p => ({ ...p, [e.target.name]: e.target.value })); setErrors(p => ({ ...p, [e.target.name]: '' })); }}
                                            placeholder={field.placeholder}
                                            autoComplete={field.autoComplete}
                                            className={`w-full px-4 py-3 rounded-xl border-2 text-gray-800 placeholder-gray-400 focus:outline-none transition-colors
                                                ${errors[field.name] ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-400 bg-gray-50'}`}
                                        />
                                        {errors[field.name] && <p className="text-red-500 text-xs mt-1.5">{errors[field.name]}</p>}
                                    </div>
                                ))}
                            </div>
                            {submitError && (
                                <p className="text-amber-600 text-sm text-center mt-3">{submitError}</p>
                            )}
                            <div className="flex justify-between mt-6">
                                <button onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-6 py-3 rounded-xl font-semibold text-gray-600 border-2 border-gray-200 hover:border-gray-400 transition">← Back</button>
                                <button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-3 rounded-xl font-semibold text-white bg-green-500 hover:bg-green-600 hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
                                    {isSubmitting ? 'Saving...' : 'View My Score 🎯'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 4: Results ── */}
                    {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Your Wellness Report</h2>
                                <p className="text-gray-500 text-sm mt-1">Hi {info.name}, here's your personalised report</p>
                            </div>

                            <div className={`bg-white rounded-3xl shadow-xl border-2 ${cat.border} p-8 mb-6`}>
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <ScoreGauge score={totalScore} max={maxScore} />
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="text-3xl font-bold text-gray-800 mb-1">
                                            {totalScore} <span className="text-gray-400 text-xl font-normal">/ {maxScore}</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3" style={{ color: cat.color }}>{cat.icon} {cat.label}</h3>
                                        <p className="text-gray-600 leading-relaxed">{cat.desc}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {[
                                    { label: 'Physical Health', score: physicalScore, max: physicalQuestions.length * 4, icon: '🧘', color: '#16a34a' },
                                    { label: 'Emotional Wellbeing', score: emotionalScore, max: emotionalQuestions.length * 4, icon: '💚', color: '#2563eb' },
                                ].map(sub => {
                                    const pct = Math.round((sub.score / sub.max) * 100);
                                    return (
                                        <div key={sub.label} className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
                                            <div className="text-2xl mb-2">{sub.icon}</div>
                                            <div className="text-sm text-gray-500 mb-1">{sub.label}</div>
                                            <div className="text-2xl font-bold mb-2" style={{ color: sub.color }}>{sub.score}/{sub.max}</div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <motion.div className="h-2 rounded-full" style={{ backgroundColor: sub.color }}
                                                    initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.5 }} />
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{pct}%</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 text-center">
                                <p className="text-green-800 font-semibold">📩 Your HR / Team Lead will be notified of your results.</p>
                                <p className="text-green-600 text-sm mt-1">Your individual answers are kept confidential. Only your summary score is shared.</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/contact" className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold text-center transition shadow-md hover:shadow-lg">
                                    Talk to a Wellness Expert
                                </Link>
                                <Link to="/programs/corporate-yoga" className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-3 rounded-xl font-semibold text-center transition">
                                    Explore Programs
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EmployeeAssessment;
