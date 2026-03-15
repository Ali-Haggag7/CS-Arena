"use client";

import { motion } from "framer-motion";
import ProjectCard, { ProjectTypeCard } from "@/components/project/ProjectCard";
import { Layers } from "lucide-react";
import Link from "next/link";

const ProjectsGrid = ({ posts }: { posts: ProjectTypeCard[] }) => {
    if (!posts?.length) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-24 px-6 text-center">
                <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                    <Layers className="size-8 text-primary/50" />
                </div>
                <p className="text-[18px] font-bold text-black dark:text-white mb-2">
                    No projects here yet
                </p>
                <p className="text-[14px] text-black/40 dark:text-white/30 max-w-xs leading-relaxed mb-8">
                    Be the first to showcase your CS project to the world.
                </p>
                <Link
                    href="/project/create"
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full text-[14px] font-semibold hover:bg-primary-600 hover:shadow-glow transition-all duration-300"
                >
                    Submit Your Project
                </Link>
            </div>
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