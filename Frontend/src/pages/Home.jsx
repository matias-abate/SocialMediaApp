// src/pages/Home.jsx
import { useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/services/apiClient";
import GlassTweetCard from "@/components/GlassTweetCard";
import TweetComposer from "@/components/TweetComposer";
import PostSkeleton from "@/components/PostSkeleton";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const PAGE_SIZE = 10;

export default function Home() {
  const qc = useQueryClient();
  const [content, setContent] = useState("");

  // 1) useInfiniteQuery para fetch paginado
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) =>
      api
        .get("/posts", {
          params: { page: pageParam, size: PAGE_SIZE },
        })
        .then((res) => res.data),
    getNextPageParam: (lastPage) =>
      lastPage.length === PAGE_SIZE
        ? Math.ceil(lastPage.length / PAGE_SIZE) + 1
        : undefined,
  });

  // 2) Mutation para crear un post, incluye author_id extraído del token
  const createPost = useMutation({
    mutationFn: ({ content, author_id }) =>
      api.post("/posts", { content, author_id }).then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries(["posts"]);
      setContent("");
    },
  });

  // 3) Sentinel para infinite scroll
  const { ref: sentinelRef } = useIntersectionObserver({
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

  // Función que extrae el sub (user id) del JWT
  function getAuthorIdFromToken() {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;
    } catch {
      return null;
    }
  }

  return (
    <div className="w-full max-w-[640px] mx-auto px-4 sm:px-6 space-y-8">
      {/* Composer */}
      <TweetComposer
        value={content}
        onChange={setContent}
        onSubmit={(text) => {
          const author_id = getAuthorIdFromToken();
          if (!author_id) {
            // por si acaso: forzar logout o mostrar error
            return;
          }
          createPost.mutate({ content: text, author_id });
        }}
        loading={createPost.isLoading}
      />

      {/* Feed */}
      {status === "loading" && <PostSkeleton count={3} />}
      {status === "error" && (
        <p className="text-center text-red-500">{error.message}</p>
      )}

      {status === "success" &&
        data.pages.map((page, pi) => (
          <div key={pi} className="space-y-6">
            {page.map((post) => (
              <GlassTweetCard key={post.id} post={post} />
            ))}
          </div>
        ))}

      {/* Sentinel para infinite scroll */}
      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && <PostSkeleton count={1} />}
      {!hasNextPage && status === "success" && (
        <p className="text-center text-gray-500">Fin del timeline</p>
      )}
    </div>
  );
}
