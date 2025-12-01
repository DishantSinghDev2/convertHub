"use client"

import { getBlogPostBySlug, getRelatedPosts } from "@/lib/blog-data"
import Link from "next/link"
import BlogCard from "@/components/blog-card"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, Tag, ArrowRight, Share2 } from "lucide-react"
import { useParams } from "next/navigation"

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Post Not Found</h1>
          <p className="text-muted-foreground">The blog post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    )
  }

  const relatedPosts = getRelatedPosts(slug)

  return (
    <div className="w-full">
      {/* Header */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-4">
            ← Back to Blog
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full capitalize">
                {post.category}
              </span>
              {post.featured && (
                <span className="px-2 py-1 text-xs font-semibold bg-accent/10 text-accent rounded">Featured</span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold gradient-text">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.publishedAt.toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <article className="prose prose-invert max-w-none space-y-6">
          <div
            className="text-foreground space-y-4"
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/^# /gm, '<h1 className="text-3xl font-bold mt-8 mb-4">')
                .replace(/^## /gm, '<h2 className="text-2xl font-bold mt-6 mb-3">')
                .replace(/^### /gm, '<h3 className="text-xl font-bold mt-4 mb-2">')
                .replace(/\n\n/g, '</p><p className="text-muted-foreground">')
                .replace(/```/g, '<pre className="bg-muted p-4 rounded-lg overflow-x-auto"><code>')
                .replace(/- /g, '<li className="ml-6">• ')
                .split("\n")
                .join("<br />"),
            }}
          />
        </article>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap items-start gap-2">
              <Tag className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded hover:bg-primary/10 hover:text-primary transition-colors text-sm"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Share */}
        <div className="mt-8 pt-8 border-t border-border flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Share this post:</span>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-border bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 p-8 md:p-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Convert Your Files?</h2>
          <p className="text-foreground/80 mb-8 max-w-2xl mx-auto">
            Put what you learned into practice. Start converting your files with ConvertHub today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/converters/image" className="gap-2">
                Start Converting <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/blog">More Articles</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
