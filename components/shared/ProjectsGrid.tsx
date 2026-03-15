"use client";

import { motion } from "framer-motion";
import ProjectCard, { ProjectTypeCard } from "@/components/project/ProjectCard";

const ProjectsGrid = ({ posts }: { posts: ProjectTypeCard[] }) => {
    if (!posts?.length) {
        return (
            <motion.p
                className="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                No projects found in the arena yet.
            </motion.p>
        );
    }

    return (
        <ul className="card_grid">
            {posts.map((post, index) => (
                <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.35,
                        delay: Math.min(index * 0.07, 0.4),
                        ease: "easeOut",
                    }}
                >
                    <ProjectCard post={post} />
                </motion.div>
            ))}
        </ul>
    );
};

export default ProjectsGrid;