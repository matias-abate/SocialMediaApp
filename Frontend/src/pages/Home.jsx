// src/pages/Home.jsx
import { useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/services/apiClient";
import TweetComposer from "@/components/TweetComposer";
import PostSkeleton from "@/components/PostSkeleton";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import GlassTweetCard from "@/components/GlassTweetCard";

const PAGE_SIZE = 10;

export default function Home() {
  const qc = useQueryClient();
  const [content, setContent] = useState("");

  /* ——— fetch paginado ——— */
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
      api.get(`/posts/?page=${pageParam}&size=${PAGE_SIZE}`).then((r) => r.data),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined,
  });

  /* ——— creación de post ——— */
  const createPost = useMutation({
    mutationFn: (payload) => api.post("/posts/", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      setContent("");
    },
  });

  /* ——— infinite scroll ——— */
  const { ref: sentinelRef } = useIntersectionObserver({
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

  return (
    <div className="w-full max-w-[640px] mx-auto px-4 sm:px-6 space-y-8">
      {/* Composer */}
      <TweetComposer
        value={content}
        onChange={setContent}
        onSubmit={(t) => createPost.mutate({ content: t })}
        loading={createPost.isLoading}
      />

      {/* Feed */}
      {status === "loading" && <PostSkeleton count={3} />}
      {status === "error" && (
        <p className="text-center text-red-500">{error.message}</p>
      )}
      {data?.pages.map((page) =>
        page.map((post) => <GlassTweetCard key={post.id} post={post} />)
      )}

      {/* sentinel para infinite scroll */}
      <div ref={sentinelRef} className="h-10" />
      {isFetchingNextPage && <PostSkeleton count={1} />}
      {!hasNextPage && status === "success" && (
        <p className="text-center text-gray-500">Fin del timeline</p>
      )}
    </div>
  );
}
