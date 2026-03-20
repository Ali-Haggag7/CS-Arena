export const TECH_ECOSYSTEM: Record<string, any> = {
    web: {
        title: "Web Development",
        subdomains: {
            frontend: { title: "Frontend", techs: ["React", "Next.js", "Vue.js", "Angular", "Svelte", "HTML/CSS", "Tailwind CSS", "Other"] },
            backend: { title: "Backend", techs: ["Node.js", "Express", "Django", "Laravel", "Spring Boot", ".NET", "Ruby on Rails", "Other"] },
            fullstack: { title: "Full Stack", techs: ["MERN Stack", "MEAN Stack", "T3 Stack", "LAMP Stack", "Next.js (Fullstack)", "Other"] },
        }
    },
    ai: {
        title: "AI & Machine Learning",
        subdomains: {
            ml: { title: "Machine Learning", techs: ["TensorFlow", "PyTorch", "Scikit-learn", "XGBoost", "Other"] },
            cv: { title: "Computer Vision", techs: ["OpenCV", "YOLO", "MediaPipe", "Other"] },
            nlp: { title: "NLP & LLMs", techs: ["Hugging Face", "LangChain", "OpenAI API", "NLTK", "Spacy", "Other"] },
            data: { title: "Data Analysis", techs: ["Pandas", "NumPy", "Matplotlib", "Jupyter", "Other"] }
        }
    },
    cyber: {
        title: "Cybersecurity",
        subdomains: {
            offensive: { title: "Offensive (Red Team)", techs: ["Kali Linux", "Metasploit", "Burp Suite", "Nmap", "Other"] },
            defensive: { title: "Defensive (Blue Team)", techs: ["Splunk", "Wireshark", "Snort", "SIEM", "Other"] },
            crypto: { title: "Cryptography", techs: ["AES", "RSA", "Blockchain", "Custom Algo", "Other"] }
        }
    },
    mobile: {
        title: "Mobile Development",
        subdomains: {
            cross: { title: "Cross-Platform", techs: ["Flutter", "React Native", "Expo", "MAUI", "Other"] },
            native_android: { title: "Native Android", techs: ["Kotlin", "Java", "Android Studio", "Other"] },
            native_ios: { title: "Native iOS", techs: ["Swift", "Objective-C", "Xcode", "Other"] }
        }
    },
    default: {
        title: "General",
        subdomains: {
            general: { title: "General Programming", techs: ["Python", "Java", "C++", "C#", "Go", "Rust", "JavaScript", "Other"] }
        }
    }
};

export const getDomainKey = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes("web")) return "web";
    if (lower.includes("ai") || lower.includes("artificial") || lower.includes("machine") || lower.includes("data")) return "ai";
    if (lower.includes("cyber") || lower.includes("security")) return "cyber";
    if (lower.includes("mobile") || lower.includes("app")) return "mobile";
    return "default";
};