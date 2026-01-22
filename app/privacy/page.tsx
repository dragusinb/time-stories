import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy - TimeStories',
    description: 'Privacy Policy for TimeStories app',
};

export default function PrivacyPolicyPage() {
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
                    Privacy Policy
                </h1>

                <div className="prose prose-invert prose-slate max-w-none space-y-6 text-slate-300">
                    <p className="text-sm text-slate-400">
                        Last updated: January 2026
                    </p>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
                        <p>
                            Welcome to TimeStories. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy explains how we collect, use, and safeguard your information when you use our app.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Information We Collect</h2>
                        <h3 className="text-lg font-semibold text-slate-200 mt-4 mb-2">2.1 Information You Provide</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Account information (if you create an account)</li>
                            <li>Purchase history through app stores</li>
                            <li>Customer support communications</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-slate-200 mt-4 mb-2">2.2 Automatically Collected Information</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Device information (device type, operating system)</li>
                            <li>App usage data (features used, time spent)</li>
                            <li>Crash reports and performance data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">3. How We Use Your Information</h2>
                        <p>We use the collected information to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide and maintain our services</li>
                            <li>Process your purchases and transactions</li>
                            <li>Improve and personalize your experience</li>
                            <li>Send important updates about the app</li>
                            <li>Respond to your requests and support inquiries</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Data Storage and Security</h2>
                        <p>
                            Your game progress is stored locally on your device. If you use cloud sync features,
                            your data is securely stored using industry-standard encryption.
                            We implement appropriate security measures to protect your personal information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Third-Party Services</h2>
                        <p>Our app may use third-party services that collect information:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>RevenueCat:</strong> For managing in-app purchases and subscriptions</li>
                            <li><strong>Apple App Store / Google Play:</strong> For processing payments</li>
                        </ul>
                        <p className="mt-4">
                            These services have their own privacy policies governing the use of your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">6. Children's Privacy</h2>
                        <p>
                            TimeStories is designed for general audiences. We do not knowingly collect personal
                            information from children under 13. If you believe we have collected such information,
                            please contact us immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">7. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Access your personal data</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt out of certain data collection</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">8. Changes to This Policy</h2>
                        <p>
                            We may update this privacy policy from time to time. We will notify you of any changes
                            by posting the new policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mt-8 mb-4">9. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="mt-2">
                            <strong>Email:</strong> support@timestories.app
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-700">
                    <Link
                        href="/terms"
                        className="text-amber-500 hover:text-amber-400"
                    >
                        View Terms of Service
                    </Link>
                </div>
            </div>
        </main>
    );
}
