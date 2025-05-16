    "use client";
    import { FooterSection } from "@/types/footerSection";
    import { motion } from "framer-motion";

    export const Footer = ({ data }: { data: FooterSection[] }) => {
    return (
        <footer className="bg-orange-500 text-black px-6 py-10 m-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {data.map((section, index) => (
            <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
            >
                <h4 className="text-2xl font-bold mb-3 border-b border-gray-600 pb-1 text-white">
                {section.title}
                </h4>
                <ul className="space-y-2 text-white">
                {section.links.map((link) => (
                    <li key={link.name}>
                    <a
                        href={link.url}
                        className="hover:text-white transition-colors duration-200"
                    >
                        {link.name}
                    </a>
                    </li>
                ))}
                </ul>
            </motion.div>
            ))}
        </div>

        <div className="mt-10 text-center text-gray-900 text-sm font-sans font-thins">
            &copy; {new Date().getFullYear()} TriggerHub Inc. All rights reserved and developed by Amit Kumar Gupta.
        </div>
        </footer>
    );
    };
