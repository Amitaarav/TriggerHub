    "use client";

    import { FooterData } from "./FooterData";
    import { FooterSection } from "@/types/footerSection";
    import { motion } from "framer-motion";

    export const Footer = ({ data }: { data: FooterSection[] }) => {
    return (
        <footer className="bg-gray-900 text-gray-200 px-6 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {data.map((section, index) => (
            <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
            >
                <h4 className="text-xl font-semibold mb-3 border-b border-gray-600 pb-1">
                {section.title}
                </h4>
                <ul className="space-y-2">
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

        <div className="mt-10 text-center text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} TriggerHub Inc. All rights reserved.
        </div>
        </footer>
    );
    };
