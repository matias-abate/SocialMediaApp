export default function PostSkeleton({ count = 1 }) {
    return Array.from({ length: count }, (_, i) => (
      <div key={i} className="p-4 animate-pulse space-y-2 border-b border-white/10">
        <div className="h-4 w-1/2 bg-white/20 rounded" />
        <div className="h-4 w-full bg-white/10 rounded" />
        <div className="h-4 w-5/6 bg-white/10 rounded" />
      </div>
    ));
  }
  