const PolicySections = ({
    sections,
}: {
    sections: { title: string; content: string }[];
}) => (
    <div className="space-y-12 text-16-medium text-black/70 dark:text-white/70 leading-loose">
        {sections.map(({ title, content }) => (
            <section key={title} aria-labelledby={title}>
                <h2
                    id={title}
                    className="text-24-black text-black dark:text-white mb-4 border-b-2 border-primary/20 pb-2 inline-block"
                >
                    {title}
                </h2>
                <p>{content}</p>
            </section>
        ))}
    </div>
);

export default PolicySections;