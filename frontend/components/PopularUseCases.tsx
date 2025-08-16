"use client"
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const useCases = [
  { icon: '🔗', title: 'Generate webhook to send Solana on workflow trigger' },
  { icon: '📨', title: 'Send email after successful Solana transfer' },
  { icon: '🪙', title: 'Notify via Telegram when wallet balance drops' },
  { icon: '📁', title: 'Create Google Drive folders for new clients' },
  { icon: '🧾', title: 'Upload invoices to Drive and notify accounting' },
  { icon: '🧠', title: 'Summarize form submissions with AI and send to Notion' },
  { icon: '📦', title: 'Create shipping label when payment is received' },
  { icon: '✅', title: 'Auto-update task in ClickUp when GitHub PR is merged' },
  { icon: '🧑‍💻', title: 'Post a hiring alert on Discord when job form is filled' },
  { icon: '⚠️', title: 'Send SMS when server CPU exceeds 90%' },
  { icon: '💬', title: 'Log chat messages to Airtable for analytics' },
  { icon: '🔔', title: 'Trigger push notifications for new blog comments' },    
  { icon: '💼', title: 'Send Slack alerts when new leads arrive' },
  { icon: '📧', title: 'Save Gmail attachments to Drive' },
  { icon: '🛒', title: 'Get notified when orders are placed' },
  { icon: '📅', title: 'Auto-create Calendar events from forms' },
];

const duplicateUseCases = [
    ...useCases,
    ...useCases,
];

export function PopularUseCases() {
    return (
        <section className="p-10 bg-orange-500 rounded-xl sm:w-full ">
        <h2 className="text-3xl font-bold text-center mb-10 text-white">Popular Use Cases</h2>


        <div className="relative w-full overflow-hidden">
            <motion.div 
                className="flex space-x-4 min-w-full"
                animate={{x: ["0%", "-50%"]}}
                transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                }}
                >
            {duplicateUseCases.map((useCase, index) => (
            <div
                key={index}
                className="min-w-[250px] bg-white p-6 rounded-2xl shadow-md flex-shrink-2 flex flex-col items-center justify-center text-center"
            >
                <div className="text-5xl mb-3">{useCase.icon}</div>
                <p className="text-base font-medium">{useCase.title}</p>

            </div>
            ))}
        </motion.div>
        </div>
        </section>
    );
}