// src/components/GlassTweetCard.jsx
import { motion } from "framer-motion";
import {
  ChatBubbleLeftIcon,
  HeartIcon,
  ArrowPathIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

export default function GlassTweetCard({ post }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-surface backdrop-blur-xs rounded-2xl p-6 shadow-lg text-base text-white space-y-4"
    >
      <header className="flex justify-between items-center">
        <h3 className="font-bold">{post.author.username}</h3>
        <time className="text-sm text-gray-400">
          {new Date(post.created_at).toLocaleTimeString()}
        </time>
      </header>
      <p>{post.content}</p>
      <footer className="flex justify-between text-gray-300">
        {[ChatBubbleLeftIcon, ArrowPathIcon, HeartIcon, ShareIcon].map(
          (Icon, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-1 hover:text-primary transition"
            >
              <Icon className="h-5 w-5" />
              {/* Aquí podrías mostrar post.counts[i] si lo deseas */}
            </motion.button>
          )
        )}
      </footer>
    </motion.article>
  );
}