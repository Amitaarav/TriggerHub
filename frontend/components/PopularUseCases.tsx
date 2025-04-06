'use client';

import { motion } from 'framer-motion';

const useCases = [
    { icon: '💼', title: 'Send Slack alerts when new leads arrive' },
    { icon: '📧', title: 'Save Gmail attachments to Drive' },
    { icon: '🛒', title: 'Get notified when orders are placed' },
    { icon: '📅', title: 'Auto-create Calendar events from forms' },
    ];

export function PopularUseCases() {
    return (
        <section className="p-10 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-10">Popular Use Cases</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
            <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="group bg-white p-6 rounded-2xl shadow-lg relative overflow-hidden transition-all duration-300"
            >
                <motion.div
                whileHover={{
                    scale: 1.2,
                    zIndex: 50,
                    x: 0,
                    y: -10,
                }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex flex-col items-center justify-center text-center cursor-pointer p-4"
                >
                <div className="text-5xl mb-4">{useCase.icon}</div>
                <p className="text-base font-medium">{useCase.title}</p>
                </motion.div>
            </motion.div>
            ))}
        </div>
        </section>
    );
}