const PolicySections = ({
    sections,
}: {
    sections: { title: string; content: string }[];
}) => (
    <div className="space-y-10">
        {sections.map(({ title, content }) => (
            <section key={title} aria-labelledby={title} className="glass-card p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    <h2 id={title} className="text-[18px] font-bold text-black dark:text-white">
                        {title}
                    </h2>
                </div>
                <p className="text-[15px] text-black/60 dark:text-white/50 leading-relaxed">
                    {content}
                </p>
            </section>
        ))}
    </div>
);

export default PolicySections;