// src/components/PostCard.jsx
import React from "react";

export default function PostCard({ post }) {
  return (
    <article className="flex flex-col justify-between bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
      {/* 1) Meta: fecha y etiqueta */}
      <div className="flex items-center gap-x-4 text-xs">
        <time
          dateTime={post.created_at}
          className="text-gray-500 dark:text-gray-400"
        >
          {new Date(post.created_at).toLocaleDateString()}
        </time>
        <span className="relative z-10 rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1.5 font-medium text-gray-600 dark:text-gray-300">
          @{post.author_username}
        </span>
      </div>

      {/* 2) Contenido principal */}
      <div className="group relative mt-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-600 transition">
          <span className="absolute inset-0" />
          {post.content.length > 60
            ? post.content.slice(0, 60) + "…"
            : post.content}
        </h3>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {post.content}
        </p>
      </div>

      {/* 3) Autor */}
      <div className="mt-6 flex items-center gap-x-4">
        <img
          src={post.author_avatar_url}
          alt={post.author_username}
          className="h-10 w-10 rounded-full bg-gray-50 dark:bg-gray-700"
        />
        <div className="text-sm">
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {post.author_username}
          </p>
          <p className="text-gray-500 dark:text-gray-400">Usuario</p>
        </div>
      </div>
    </article>
  );
}
