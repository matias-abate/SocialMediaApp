// src/pages/Home.jsx
import { useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/services/apiClient";
import TweetCard from "@/components/TweetCard";
import TweetComposer from "@/components/TweetComposer";
import PostSkeleton from "@/components/PostSkeleton";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const PAGE_SIZE = 10;

export default function Home() {
  const qc = useQueryClient();
  const [content, setContent] = useState("");

  /* ------------------------ GET: posts paginados ------------------------ */
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
        .get(`/posts/?page=${pageParam}&size=${PAGE_SIZE}`)
        .then((r) => r.data),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined,
  });

  /* ------------------------ POST: crear tweet --------------------------- */
  const createPost = useMutation({
    mutationFn: (payload) => api.post("/posts/", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      setContent("");
    },
  });

  /* ------------------ Infinite scroll: sentinel ref --------------------- */
  const { ref: sentinelRef } = useIntersectionObserver({
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

  /* ------------------------------- JSX --------------------------------- */
  return (
    <div className="flex flex-col divide-y divide-white/10 space-y-6">
      {/* composer */}
      <TweetComposer
        value={content}
        onChange={setContent}
        onSubmit={(text) => createPost.mutate({ content: text })}
        loading={createPost.isLoading}
      />

      {/* feed */}
      {status === "loading" && <PostSkeleton count={3} />}
      {status === "error" && (
        <p className="text-center text-red-500 py-6">{error.message}</p>
      )}

      {data?.pages.map((page) =>
        page.map((post) => <TweetCard key={post.id} post={post} />)
      )}

      {/* sentinel para infinite-scroll */}
      <div ref={sentinelRef} className="h-10" />
      {isFetchingNextPage && <PostSkeleton count={1} />}
      {!hasNextPage && status === "success" && (
        <p className="text-center text-gray-500 py-4">Fin del timeline</p>
      )}
    </div>
  );
}
