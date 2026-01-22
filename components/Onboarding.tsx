'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore, ONBOARDING_STEPS } from '@/lib/onboarding';
import {
    Clock,
    BookOpen,
    Gamepad2,
    Coins,
    FlaskConical,
    Rocket,
    ChevronRight,
    ChevronLeft,
    X,
} from 'lucide-react';

const STEP_ICONS: Record<string, React.ReactNode> = {
    welcome: <Clock className="w-16 h-16" />,
    stories: <BookOpen className="w-16 h-16" />,
    minigames: <Gamepad2 className="w-16 h-16" />,
    coins: <Coins className="w-16 h-16" />,
    lab: <FlaskConical className="w-16 h-16" />,
    ready: <Rocket className="w-16 h-16" />,
};

const STEP_COLORS: Record<string, string> = {
    welcome: 'from-amber-500 to-orange-600',
    stories: 'from-blue-500 to-indigo-600',
    minigames: 'from-green-500 to-emerald-600',
    coins: 'from-yellow-500 to-amber-600',
    lab: 'from-purple-500 to-violet-600',
    ready: 'from-red-500 to-rose-600',
};

const STEP_DETAILS: Record<string, string[]> = {
    welcome: [
        'Experience history like never before',
        'Interactive stories spanning millennia',
        'From Apollo 11 to Ancient Syracuse',
    ],
    stories: [
        'Each story has 40+ immersive acts',
        'Make choices that shape the narrative',
        'Learn real history through adventure',
    ],
    minigames: [
        'Dozens of unique puzzle types',
        'Test your skills and reflexes',
        'Earn higher scores for better rewards',
    ],
    coins: [
        'Complete acts to earn coins',
        'Unlock premium content',
        'Free acts available in every story',
    ],
    lab: [
        'Collect artifacts from your journeys',
        'Generate Temporal Energy passively',
        'Upgrade and prestige for bonuses',
    ],
    ready: [
        'Your first story awaits',
        'Start with Apollo 11 or dive into history',
        'Your choices. Your adventure.',
    ],
};

interface OnboardingProps {
    onComplete?: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const {
        currentStep,
        nextStep,
        prevStep,
        completeOnboarding,
        hasCompletedOnboarding,
    } = useOnboardingStore();

    if (hasCompletedOnboarding) return null;

    const step = ONBOARDING_STEPS[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

    const handleComplete = () => {
        completeOnboarding();
        onComplete?.();
    };

    const handleSkip = () => {
        completeOnboarding();
        onComplete?.();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col"
        >
            {/* Skip button */}
            <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white z-10"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="text-center max-w-md"
                    >
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: 'spring' }}
                            className={`w-32 h-32 rounded-full bg-gradient-to-br ${STEP_COLORS[step.id]} flex items-center justify-center mx-auto mb-8 text-white shadow-lg`}
                        >
                            {STEP_ICONS[step.id]}
                        </motion.div>

                        {/* Title */}
                        <h1 className="text-3xl font-serif font-bold text-white mb-4">
                            {step.title}
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-slate-400 mb-8">{step.description}</p>

                        {/* Details */}
                        <ul className="space-y-3 text-left">
                            {STEP_DETAILS[step.id].map((detail, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="flex items-center gap-3 text-slate-300"
                                >
                                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${STEP_COLORS[step.id]}`} />
                                    {detail}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
                {ONBOARDING_STEPS.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => useOnboardingStore.getState().setCurrentStep(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                            index === currentStep
                                ? 'w-6 bg-amber-500'
                                : index < currentStep
                                    ? 'bg-amber-500/50'
                                    : 'bg-slate-600'
                        }`}
                    />
                ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-4 px-6 pb-8 max-w-md mx-auto w-full">
                {!isFirstStep && (
                    <button
                        onClick={prevStep}
                        className="flex-1 py-4 px-6 rounded-xl bg-slate-800 text-white font-medium flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                    </button>
                )}

                {isLastStep ? (
                    <button
                        onClick={handleComplete}
                        className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold flex items-center justify-center gap-2 hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg"
                    >
                        Start Adventure
                        <Rocket className="w-5 h-5" />
                    </button>
                ) : (
                    <button
                        onClick={nextStep}
                        className="flex-1 py-4 px-6 rounded-xl bg-amber-600 text-white font-medium flex items-center justify-center gap-2 hover:bg-amber-500 transition-colors"
                    >
                        Next
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default Onboarding;
