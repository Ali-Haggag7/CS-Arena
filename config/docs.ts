export const docsConfig = {
    sections: [
        {
            titleKey: "getting_started",
            icon: "book",
            items: [
                { titleKey: "introduction", slug: "getting-started/introduction" },
                { titleKey: "quick_start", slug: "getting-started/quick-start" },
            ],
        },
        {
            titleKey: "user_guide",
            icon: "layout",
            items: [
                { titleKey: "submitting_project", slug: "user-guide/projects" },
                { titleKey: "find_developers", slug: "user-guide/find-developers" },
            ],
        },
        {
            titleKey: "contributing",
            icon: "terminal",
            items: [
                { titleKey: "local_setup", slug: "contributing/setup" },
                { titleKey: "guidelines", slug: "contributing/guidelines" },
            ],
        },
    ],
};