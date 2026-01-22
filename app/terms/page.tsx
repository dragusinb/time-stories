import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms of Service - TimeStories',
    description: 'Terms of Service for TimeStories app',
};

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-slate-950 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <h1 className="text-3xl font-serif font-bold text-white mb-8">
                    Terms of Service
                </h1>

                <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300">
                    <p className="text-sm text-slate-400">
                        Last updated: January 2026
                    </p>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By downloading, installing, or using TimeStories, you agree to be bound by these
                            Terms of Service. If you do not agree to these terms, please do not use the app.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Description of Service</h2>
                        <p>
                            TimeStories is an interactive storytelling application featuring historical adventures,
                            minigames, and educational content. The app includes both free and premium content
                            available through in-app purchases.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">3. User Accounts</h2>
                        <p>
                            Some features may require creating an account. You are responsible for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Maintaining the confidentiality of your account</li>
                            <li>All activities that occur under your account</li>
                            <li>Notifying us of any unauthorized use</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">4. In-App Purchases</h2>
                        <h3 className="text-lg font-semibold text-slate-200 mt-4 mb-2">4.1 Virtual Currency</h3>
                        <p>
                            TimeStories uses virtual currency ("Coins") that can be purchased with real money
                            or earned through gameplay. Coins have no real-world value and cannot be exchanged
                            for cash.
                        </p>

                        <h3 className="text-lg font-semibold text-slate-200 mt-4 mb-2">4.2 Purchases</h3>
                        <p>
                            All purchases are processed through the Apple App Store or Google Play Store.
                            Purchases are final and non-refundable, except as required by applicable law
                            or the respective store's refund policy.
                        </p>

                        <h3 className="text-lg font-semibold text-slate-200 mt-4 mb-2">4.3 Subscriptions</h3>
                        <p>
                            If offered, subscriptions automatically renew unless cancelled at least 24 hours
                            before the end of the current period. You can manage subscriptions in your
                            device's account settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Intellectual Property</h2>
                        <p>
                            All content in TimeStories, including but not limited to stories, artwork, music,
                            and software, is owned by us or our licensors and is protected by copyright and
                            other intellectual property laws.
                        </p>
                        <p className="mt-4">
                            You may not copy, modify, distribute, sell, or lease any part of our services
                            or included content without our written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">6. User Conduct</h2>
                        <p>You agree not to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Use the app for any unlawful purpose</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Interfere with or disrupt the app's functionality</li>
                            <li>Use cheats, exploits, or unauthorized third-party software</li>
                            <li>Reverse engineer or decompile the app</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">7. Disclaimer of Warranties</h2>
                        <p>
                            TimeStories is provided "as is" without warranties of any kind. We do not guarantee
                            that the app will be uninterrupted, error-free, or free of harmful components.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">8. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by law, we shall not be liable for any indirect,
                            incidental, special, consequential, or punitive damages arising from your use
                            of the app.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">9. Termination</h2>
                        <p>
                            We may terminate or suspend your access to the app at any time, without prior
                            notice, for conduct that we believe violates these terms or is harmful to
                            other users, us, or third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">10. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. Continued use of the
                            app after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">11. Governing Law</h2>
                        <p>
                            These terms shall be governed by and construed in accordance with applicable laws,
                            without regard to conflict of law principles.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">12. Contact Information</h2>
                        <p>
                            For questions about these Terms of Service, please contact us at:
                        </p>
                        <p className="mt-2">
                            <strong>Email:</strong> support@timestories.app
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-700">
                    <Link
                        href="/privacy"
                        className="text-amber-500 hover:text-amber-400"
                    >
                        View Privacy Policy
                    </Link>
                </div>
            </div>
        </main>
    );
}
