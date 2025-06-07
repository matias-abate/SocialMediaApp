// src/components/cards/TweetCard.jsx
import {
    ChatBubbleOvalLeftIcon,
    ArrowsRightLeftIcon,
    HeartIcon,
    ShareIcon,
  } from '@heroicons/react/24/outline';
  import { formatDistanceToNow } from 'date-fns';
  
  export default function TweetCard({ post }) {
    return (
      <article className="flex gap-4 px-4 py-3 border-b border-border/20">
        <img src={post.author.avatar} className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <header className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{post.author.name}</span>
            <span className="text-muted">@{post.author.username}</span>
            <span className="text-muted">&middot;</span>
            <time className="text-muted">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </time>
          </header>
  
          <p className="whitespace-pre-line mt-1">{post.content}</p>
  
          {/* acciones */}
          <footer className="mt-2 flex justify-between max-w-md text-muted text-sm">
            <Action icon={ChatBubbleOvalLeftIcon} count={post.comments} />
            <Action icon={ArrowsRightLeftIcon} count={post.reposts} />
            <Action icon={HeartIcon} count={post.likes} activeColor="text-pink-600" />
            <Action icon={ShareIcon} />
          </footer>
        </div>
      </article>
    );
  }
  
  function Action({ icon: Icon, count, activeColor = 'text-blue-500' }) {
    return (
      <button className="flex items-center gap-1 group">
        <Icon className={`h-5 w-5 group-hover:${activeColor}`} />
        {count ? <span>{count}</span> : null}
      </button>
    );
  }
  