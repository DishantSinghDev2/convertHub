/**
 * Blog and educational content database
 * In production, this would connect to a database
 */

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: "tutorial" | "guide" | "tips" | "formats" | "best-practices"
  tags: string[]
  author: string
  publishedAt: Date
  updatedAt: Date
  readTime: number // in minutes
  featured: boolean
  image?: string
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Complete Guide to Image Formats: PNG vs JPG vs WebP",
    slug: "image-formats-guide",
    excerpt:
      "Understanding the differences between popular image formats and choosing the right one for your use case.",
    category: "guides",
    tags: ["images", "formats", "web", "optimization"],
    author: "ConvertHub Team",
    publishedAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
    readTime: 12,
    featured: true,
    content: `# Image Formats Explained

## PNG - Portable Network Graphics
PNG is a lossless image format that supports transparency and is perfect for graphics, logos, and images where you need crisp, clear details without compression artifacts.

**Best for:**
- Graphics with transparency
- Icons and logos
- Screenshots
- Web design elements

**Advantages:**
- Lossless compression
- Supports transparency
- Wide browser support
- No quality loss

**Disadvantages:**
- Larger file sizes than JPG
- Not ideal for photographs
- Can be slow to load on mobile

## JPG - Joint Photographic Experts Group
JPG is a lossy compression format ideal for photographs and realistic images. It achieves excellent compression by removing some image data.

**Best for:**
- Photographs
- Complex images with many colors
- Social media images
- Web galleries

**Advantages:**
- Small file sizes
- Great for photographs
- Wide compatibility
- Adjustable quality levels

**Disadvantages:**
- Quality loss from compression
- No transparency support
- Artifacts visible at low quality

## WebP - The Modern Format
WebP is Google's modern image format offering superior compression compared to JPG and PNG.

**Best for:**
- Web optimization
- Modern websites
- Progressive enhancement

**Advantages:**
- Better compression than JPG and PNG
- Supports transparency like PNG
- Smaller file sizes save bandwidth
- Modern browsers support

**Disadvantages:**
- Older browsers don't support it
- Requires fallbacks
- Adoption still growing

## AVIF - The Next Generation
AVIF is the newest format providing even better compression than WebP.

**Best for:**
- Future-proof websites
- Maximum compression
- High-quality images at small sizes

**Advantages:**
- Best-in-class compression
- Supports both lossy and lossless
- HDR support

**Disadvantages:**
- Limited browser support currently
- Slower to encode
- Requires more fallbacks

## Conversion Tips
- Always provide fallbacks for modern formats
- Use conversion tools to test different formats
- Consider your audience's browser support
- Test file sizes and visual quality
- Use responsive images with srcset

## Summary
Choose PNG for graphics and images needing transparency, JPG for photographs, WebP for modern web applications, and AVIF for cutting-edge optimization.`,
  },
  {
    id: "2",
    title: "Audio Compression: Quality vs File Size",
    slug: "audio-compression-guide",
    excerpt: "Learn how to balance audio quality with file size when converting between formats.",
    category: "guides",
    tags: ["audio", "compression", "quality", "formats"],
    author: "ConvertHub Team",
    publishedAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-10"),
    readTime: 10,
    featured: true,
    content: `# Audio Compression Explained

## Understanding Bitrate
Bitrate determines how much audio data is preserved. Higher bitrates = better quality but larger files.

### Bitrate Guidelines
- **64 kbps**: Acceptable for speech, podcasts
- **128 kbps**: Good for most listening on mobile
- **192 kbps**: High quality, noticeable improvement
- **320 kbps**: Highest quality, CD-like sound

## Lossless vs Lossy
**Lossless Compression (WAV, FLAC):**
- No data loss
- Perfect sound quality
- Larger file sizes
- Best for archival

**Lossy Compression (MP3, AAC):**
- Data loss for smaller size
- Good enough for most listeners
- Smaller file sizes
- Better for distribution

## Format Recommendations
- **MP3**: Universal compatibility, good quality
- **AAC**: Better quality at same bitrate as MP3
- **FLAC**: Lossless, archival quality
- **WAV**: Uncompressed, professional audio

## Best Practices
1. Start with original audio quality
2. Choose bitrate based on use case
3. Test different bitrates with target audience
4. Keep original files for re-encoding
5. Document conversion settings`,
  },
  {
    id: "3",
    title: "Video Formats for Web: MP4 vs WebM",
    slug: "video-formats-web",
    excerpt: "Which video format should you choose for web streaming and compatibility.",
    category: "guides",
    tags: ["video", "web", "formats", "streaming"],
    author: "ConvertHub Team",
    publishedAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-05"),
    readTime: 8,
    featured: true,
    content: `# Web Video Formats

## MP4 - MPEG-4 Part 14
MP4 is the most widely supported video format for web use.

**Advantages:**
- Universal browser support
- Good compression
- Widely compatible
- Industry standard

**Disadvantages:**
- Larger file sizes than modern formats
- Patent/licensing considerations

## WebM
WebM is Google's open-source format designed specifically for web video.

**Advantages:**
- Open-source and royalty-free
- Excellent compression
- Modern browsers support

**Disadvantages:**
- Limited Apple support
- Needs fallbacks

## Best Practice: Use Both
Modern web development uses both MP4 and WebM:

\`\`\`html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  Your browser doesn't support HTML5 video.
</video>
\`\`\`

## Video Encoding Tips
1. Always encode at appropriate resolution
2. Use hardware acceleration when available
3. Test on target devices
4. Monitor file sizes
5. Consider adaptive bitrate streaming`,
  },
  {
    id: "4",
    title: "CSV to JSON: Complete Tutorial",
    slug: "csv-to-json-tutorial",
    excerpt: "Learn how to convert CSV spreadsheets to JSON format for web applications.",
    category: "tutorials",
    tags: ["csv", "json", "data", "conversion", "tutorial"],
    author: "ConvertHub Team",
    publishedAt: new Date("2024-12-28"),
    updatedAt: new Date("2024-12-28"),
    readTime: 15,
    featured: false,
    content: `# CSV to JSON Conversion Guide

## Why Convert CSV to JSON?
JSON is better suited for web applications and APIs. It's easier to parse and manipulate in JavaScript.

## The Conversion Process

### Step 1: Prepare Your CSV
Ensure your CSV has headers in the first row:
\`\`\`
name,email,department
John Doe,john@example.com,Sales
Jane Smith,jane@example.com,Engineering
\`\`\`

### Step 2: Use ConvertHub
Upload your CSV file and click "CSV to JSON" conversion.

### Step 3: Download
Get your JSON file instantly.

## The Result
Your CSV is converted to this structure:
\`\`\`json
[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Sales"
  },
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "department": "Engineering"
  }
]
\`\`\`

## Tips for Better Results
1. Ensure consistent column names
2. Handle special characters in data
3. Test with small datasets first
4. Validate JSON output
5. Use prettification for readability`,
  },
  {
    id: "5",
    title: "Privacy-First File Conversion: How ConvertHub Keeps Your Data Safe",
    slug: "privacy-first-conversion",
    excerpt: "Understanding how client-side processing keeps your files private and secure.",
    category: "best-practices",
    tags: ["privacy", "security", "data", "safety"],
    author: "ConvertHub Team",
    publishedAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
    readTime: 9,
    featured: true,
    content: `# Privacy-First File Conversion

## Client-Side Processing
ConvertHub processes most files on your device, never sending them to our servers.

### How It Works
1. You upload a file
2. Conversion happens in your browser
3. Download converted file
4. Original file is never stored

### Benefits
- Complete privacy
- Faster processing
- Works offline
- No bandwidth waste

## When Server Processing is Used
Large files (over 50MB) are processed on secure servers:
- HTTPS encryption
- Automatic deletion after conversion
- No file storage
- Audit logging

## Security Best Practices
1. Keep browser updated
2. Use HTTPS connections
3. Don't share download links
4. Clear browser cache for sensitive files
5. Review file permissions

## Your Data Rights
We don't:
- Store your files
- Sell your data
- Share with third parties
- Track your conversions
- Use files for ML training

## Compliance
ConvertHub complies with:
- GDPR requirements
- CCPA standards
- Industry security standards
- Data protection regulations`,
  },
  {
    id: "6",
    title: "Top 10 File Conversion Tips for Professionals",
    slug: "professional-tips",
    excerpt: "Expert tips for efficient file conversion workflows in professional settings.",
    category: "tips",
    tags: ["tips", "workflow", "productivity", "professional"],
    author: "ConvertHub Team",
    publishedAt: new Date("2024-12-15"),
    updatedAt: new Date("2024-12-15"),
    readTime: 11,
    featured: false,
    content: `# Professional File Conversion Tips

## 1. Use Batch Processing
Convert multiple files at once when possible to save time.

## 2. Choose the Right Format
Select formats based on:
- Where files will be used
- Compatibility requirements
- File size constraints
- Quality needs

## 3. Test Before Production
Always test converted files with your audience or systems before full deployment.

## 4. Maintain Version Control
Keep original files for re-conversion if needed.

## 5. Document Settings
Record compression levels and options used for consistency.

## 6. Automate Workflows
Set up batch scripts for repetitive conversions.

## 7. Monitor File Sizes
Track conversion efficiency to optimize quality vs. size.

## 8. Use Quality Benchmarks
Establish quality standards for your organization.

## 9. Implement Error Handling
Plan for conversion failures and have fallbacks.

## 10. Stay Updated
Keep aware of new formats and technologies.

## Workflow Example
1. Source → Convert → Test → Deploy → Archive`,
  },
]

export function getBlogPosts(category?: string, featured?: boolean): BlogPost[] {
  return blogPosts.filter((post) => {
    if (category && post.category !== category) return false
    if (featured !== undefined && post.featured !== featured) return false
    return true
  })
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = getBlogPostBySlug(currentSlug)
  if (!current) return []

  return blogPosts
    .filter((post) => post.slug !== currentSlug && post.tags.some((tag) => current.tags.includes(tag)))
    .slice(0, limit)
}

export function getAllCategories(): string[] {
  return [...new Set(blogPosts.map((post) => post.category))]
}

export function getAllTags(): string[] {
  const tags = new Set<string>()
  blogPosts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)))
  return Array.from(tags).sort()
}
