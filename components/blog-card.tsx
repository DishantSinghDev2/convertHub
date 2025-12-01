"use client"

import Link from "next/link"
import type { BlogPost } from "@/lib/blog-data"
import { Calendar, Clock } from "lucide-react"

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all">
        <div className="flex items-start justify-between mb-3">
          <span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full capitalize">
            {post.category}
          </span>
          {post.featured && (
            <span className="px-2 py-1 text-xs font-semibold bg-accent/10 text-accent rounded">Featured</span>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>

        <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {post.publishedAt.toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime} min read
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
