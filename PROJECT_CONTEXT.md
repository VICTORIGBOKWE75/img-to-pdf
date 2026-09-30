# Image-to-PDF — Project Context

## 1. Project Overview

I am building a web application that converts images into PDF files.

The original motivation is a common personal problem: I frequently need to combine photos, screenshots, downloaded images, graphics, and photos of physical documents into a PDF.

The product should eventually be useful to other people as well.

### Core product promise

> Convert multiple images into a PDF directly on your device. No uploads. No account required.

The initial product should be free.

The product may become freemium in the future, but monetization is NOT part of V1.

---

# 2. Core Product Principle

The most important characteristic of V1 is privacy.

Images should remain on the user's device.

The application should process images entirely in the browser.

There should be NO:

* image upload server
* cloud image storage
* database
* user accounts
* authentication
* server-side image processing
* cloud conversion
* payment system

The initial architecture is intentionally simple.

The browser should do the conversion.

---

# 3. Target Users

The application should support people who want to convert:

* Phone photos
* Photos of documents
* Screenshots
* Downloaded images
* JPG/JPEG images
* PNG images
* WebP images
* Graphics

It is NOT exclusively a document scanner.

It is a general-purpose image-to-PDF converter.

---

# 4. Main User Flow

The main workflow is:

```text
Upload Images
      ↓
Arrange Images
      ↓
Make Basic Adjustments
      ↓
Configure PDF
      ↓
Convert
      ↓
Download PDF
```

The application should be simple enough that a user can:

```text
select images
    ↓
click convert
    ↓
download PDF
```

without having to configure anything.

---

# 5. V1 Features

## Upload

Users can:

* Select multiple images
* Drag and drop images
* Add more images
* See image thumbnails
* See filenames
* See image dimensions

Supported formats:

* JPG
* JPEG
* PNG
* WebP

Initial limits:

* Maximum 30 images per conversion
* Maximum 20 MB per image

These limits can be adjusted after real-device testing.

---

## Image Management

Users should eventually be able to:

* Reorder images
* Delete images
* Rotate images 90 degrees
* Clear all images
* Add more images

The PDF page order must follow the image order.

---

## PDF Settings

V1 should support:

### Page size

* A4
* Letter

### Orientation

* Portrait
* Landscape

### Margins

A configurable margin.

### Image scaling

* Fit
* Fill

Images must preserve their aspect ratio.

Images should never be stretched or distorted.

### Default settings

Use sensible defaults so the user can immediately convert:

```text
Page size: A4
Orientation: Portrait
Margin: 10mm
Scaling: Fit
Quality: Balanced
```

---

# 6. PDF Generation

Use `pdf-lib`.

The PDF should contain:

```text
1 image = 1 PDF page
```

The image order should determine page order.

PDF generation happens entirely in the browser.

The core function should eventually have a structure similar to:

```typescript
async function generatePdf(
  images: ImageItem[],
  options: PdfOptions
): Promise<Blob>
```

The conversion engine should be separated from the UI.

This is important because the conversion engine may eventually be reused for:

* Mobile apps
* APIs
* Other interfaces
* Future products

---

# 7. Recommended Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## PDF

* pdf-lib

## Drag and drop

* dnd-kit

## State

Start with React state.

Use Zustand only if the application's state becomes complex enough to justify it.

## Testing

Eventually use:

* Vitest
* Playwright

## Hosting

Initially:

* GitHub
* Vercel

No backend is required for V1.

---

# 8. Architecture

The intended architecture is:

```text
Browser
  │
  └── Next.js + React + TypeScript
          │
          ├── File Manager
          │
          ├── Image Processor
          │       └── Canvas API
          │
          ├── UI State
          │
          └── PDF Generator
                  └── pdf-lib
                         │
                         ↓
                       PDF Blob
                         │
                         ↓
                      Download
```

There should be no backend in V1.

---

# 9. Project Structure

The intended project structure is:

```text
image-to-pdf/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── privacy/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── uploader/
│   │   │   ├── UploadZone.tsx
│   │   │   └── FilePicker.tsx
│   │   │
│   │   ├── images/
│   │   │   ├── ImageGrid.tsx
│   │   │   ├── ImageCard.tsx
│   │   │   └── ImagePreview.tsx
│   │   │
│   │   ├── editor/
│   │   │   ├── ImageToolbar.tsx
│   │   │   └── ImageActions.tsx
│   │   │
│   │   ├── pdf/
│   │   │   ├── PdfSettings.tsx
│   │   │   ├── PdfPreview.tsx
│   │   │   └── ConvertButton.tsx
│   │   │
│   │   └── ui/
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │   ├── image/
│   │   │   ├── decode.ts
│   │   │   ├── resize.ts
│   │   │   ├── rotate.ts
│   │   │   ├── compress.ts
│   │   │   └── validate.ts
│   │   │
│   │   ├── pdf/
│   │   │   ├── generate.ts
│   │   │   ├── layout.ts
│   │   │   ├── dimensions.ts
│   │   │   └── options.ts
│   │   │
│   │   └── utils/
│   │
│   ├── store/
│   │
│   ├── types/
│   │   ├── image.ts
│   │   └── pdf.ts
│   │
│   └── workers/
│
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

The structure can evolve if there is a good reason.

Do not create unnecessary abstraction just for the sake of following this structure.

---

# 10. Important Image Processing Requirements

## Image validation

Do not trust only:

* Filename extensions
* MIME types

The browser should actually attempt to decode the image.

Invalid/corrupt images should be rejected gracefully.

---

## EXIF orientation

Phone photos can contain EXIF orientation information.

Eventually the image-processing pipeline must account for this so that phone photos don't appear sideways or incorrectly rotated.

---

## Object URLs

Use:

```typescript
URL.createObjectURL(file)
```

for previews.

Remember to clean them up using:

```typescript
URL.revokeObjectURL(url)
```

when no longer needed.

---

## Rotation

Do NOT rewrite the image file every time the user clicks rotate.

Store rotation metadata:

```typescript
rotation: 0 | 90 | 180 | 270
```

and apply the rotation during image processing/PDF generation.

---

## Large images

Compressed file size does not necessarily represent memory usage.

For example, a large photograph may be relatively small as a JPEG but enormous when decoded into raw pixels.

Avoid processing many huge images simultaneously.

Prefer sequential processing:

```text
Image 1
  ↓
Process
  ↓
PDF

Image 2
  ↓
Process
  ↓
PDF

Image 3
  ↓
Process
  ↓
PDF
```

Web Workers can be introduced later if processing blocks the UI.

Do not prematurely build a complicated worker architecture.

---

# 11. Data Model

The initial image model is:

```typescript
export type ImageStatus =
  | "pending"
  | "processing"
  | "ready"
  | "error";

export interface ImageItem {
  id: string;
  file: File;
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  rotation: 0 | 90 | 180 | 270;
  previewUrl: string;
  status: ImageStatus;
  error?: string;
}
```

The PDF settings model will eventually look approximately like:

```typescript
interface PdfOptions {
  pageSize: "A4" | "LETTER";
  orientation: "portrait" | "landscape";
  margin: number;
  imageFit: "fit" | "fill";
  quality: "small" | "balanced" | "high";
}
```

Do not add `ORIGINAL` page size unless we explicitly decide to implement physical-size/DPI semantics.

---

# 12. Milestone Roadmap

The project is intentionally divided into milestones.

## Milestone 0 — Project Initialization

Goal:

Create the basic Next.js project and development environment.

Tasks:

* Create Git repository
* Create Next.js project
* TypeScript
* Tailwind
* ESLint
* Initial dependencies
* Basic folder structure
* README
* First Git commit
* Verify development server
* Verify production build

Definition of done:

```bash
npm run dev
npm run build
```

both work.

---

# Milestone 1 — Application Shell

Goal:

Build the initial UI without implementing the full functionality.

Build:

* Header
* Logo/name
* Main title
* Description
* Upload/drop zone
* Empty state
* Basic responsive layout
* Privacy message

The page should look like a real product even before the upload functionality is complete.

---

# Milestone 2 — Image Uploading

CURRENT MILESTONE / COMPLETED PARTS SHOULD BE TRACKED HERE.

Goal:

Allow users to add images to the application.

Implement:

* Multiple file selection
* Drag and drop
* JPG/JPEG
* PNG
* WebP
* File validation
* 20 MB file limit
* 30 image limit
* Image decoding
* Image dimensions
* Thumbnail previews
* Add more images
* Error handling
* Object URL cleanup

Current implementation includes:

```text
src/types/image.ts

src/lib/image/validate.ts

src/lib/image/decode.ts

src/hooks/useImages.ts

src/components/uploader/FilePicker.tsx

src/components/uploader/UploadZone.tsx

src/components/images/ImagePreview.tsx

src/components/images/ImageGrid.tsx

src/app/page.tsx
```

Current `ImageItem` model:

```typescript
export interface ImageItem {
  id: string;
  file: File;
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
  rotation: 0 | 90 | 180 | 270;
  previewUrl: string;
  status: ImageStatus;
  error?: string;
}
```

At the end of Milestone 2, the user should be able to:

```text
Choose Images
      ↓
Select multiple images
      ↓
Images appear as thumbnails
      ↓
Filename + dimensions are shown
```

Do NOT implement reordering, rotation controls, PDF generation, or PDF settings during Milestone 2.

---

# Milestone 3 — Image Workspace

Goal:

Turn the uploaded image list into the main workspace.

Implement:

* Reordering
* Drag and drop ordering
* Delete image
* Rotate image
* Clear all
* Add more images
* Image count
* Better image cards
* Non-drag alternative for reordering for accessibility

Use dnd-kit.

Important:

The PDF page order must exactly match the image order in the workspace.

---

# Milestone 4 — Image Processing Foundation

Goal:

Build the image-processing layer independently from the UI.

Create:

```text
src/lib/image/
├── decode.ts
├── resize.ts
├── rotate.ts
├── compress.ts
└── validate.ts
```

Implement:

* Image decoding
* Resize
* Rotation
* Compression
* EXIF orientation handling
* Pixel/dimension protection

Keep processing code independent of React.

---

# Milestone 5 — PDF Engine

Goal:

Generate an actual PDF.

Use:

```text
pdf-lib
```

Create:

```text
src/lib/pdf/
├── generate.ts
├── layout.ts
├── dimensions.ts
└── options.ts
```

Implement:

* A4
* Letter
* Portrait
* Landscape
* Margins
* Fit
* Fill
* One image per page
* Aspect-ratio preservation

Core API:

```typescript
generatePdf(images, options)
```

returns a PDF Blob.

---

# Milestone 6 — Connect UI to PDF Engine

Goal:

User can click Convert and generate a PDF.

Flow:

```text
Images
 ↓
Convert
 ↓
Validate
 ↓
Process sequentially
 ↓
Create PDF
 ↓
Download
```

Add progress such as:

```text
Creating your PDF...

7 / 10
```

---

# Milestone 7 — PDF Settings

Implement:

* Page size
* Orientation
* Margins
* Fit/Fill
* Quality

Defaults:

```text
A4
Portrait
10mm
Fit
Balanced
```

The user should not need to change settings before converting.

---

# Milestone 8 — Download & Completion

Implement:

* Success state
* Download PDF
* Start Again
* Filename
* Approximate file size where practical
* Conversion errors
* Retry

---

# Milestone 9 — Mobile

Test thoroughly on:

* iPhone Safari
* Android Chrome
* Desktop Chrome
* Firefox
* Safari

Test:

```text
1 image
5 images
10 images
20 images
30 images
```

Test:

* Phone photos
* Large images
* Screenshots
* PNG
* JPG
* WebP
* Mixed formats

---

# Milestone 10 — Performance

Implement/improve:

* Sequential processing
* Memory cleanup
* Large-image protection
* Thumbnail optimization
* UI responsiveness

Introduce Web Workers only if testing shows that they are necessary.

---

# Milestone 11 — Testing

Use:

* Vitest
* Playwright

Unit test:

* Page dimensions
* Fit
* Fill
* Margins
* Rotation
* Validation
* Filename generation

Integration test:

```text
Upload
 ↓
Reorder
 ↓
Rotate
 ↓
Generate
 ↓
PDF exists
```

Browser test:

* Chromium
* Firefox
* WebKit
* Mobile viewport

---

# Milestone 12 — Privacy & Security

Verify:

* No image upload requests
* No cloud storage
* No server-side image processing
* No accidental third-party image transmission

Add privacy page.

Do not make privacy claims that aren't true in the implementation.

---

# Milestone 13 — Product Polish

Improve:

* Loading states
* Empty states
* Error states
* Success states
* Accessibility
* Keyboard navigation
* Focus states
* Responsive layout
* Drag/drop feedback
* Confirmation for Clear All
* Better mobile UX

---

# Milestone 14 — SEO & Launch Preparation

Implement:

* Metadata
* Open Graph
* Favicon
* Sitemap
* Robots.txt
* Privacy page
* Terms page
* Homepage SEO

Potential pages:

```text
/
 /image-to-pdf
 /jpg-to-pdf
 /png-to-pdf
 /webp-to-pdf
```

Do not create lots of thin SEO pages.

---

# Milestone 15 — Deployment

Initial infrastructure:

```text
GitHub
   ↓
Vercel
   ↓
Custom domain
```

No backend is required for V1.

---

# 13. Out of Scope for V1

Do NOT add these unless the project plan is explicitly changed:

* Accounts
* Login/signup
* Database
* Cloud storage
* Payments
* Subscriptions
* OCR
* AI document processing
* Automatic document detection
* Perspective correction
* PDF → image
* PDF merging
* PDF splitting
* Advanced image editing
* API
* Admin dashboard
* Cloud processing

These are potential future features.

---

# 14. Possible V2/V3 Features

Potential future functionality:

* HEIC
* TIFF
* Better compression
* PDF preview
* Custom page sizes
* DPI controls
* Cropping
* Filters
* PWA/offline support
* OCR
* Automatic document detection
* Perspective correction
* Searchable PDFs
* PDF → images
* PDF compression
* PDF merge/split

Potential commercial features later:

* Accounts
* Cloud storage
* Conversion history
* Subscriptions
* API
* Team functionality

Do not build these now.

---

# 15. Future Product Direction

The longer-term product could become a broader document toolbox:

```text
Image → PDF
PDF → Image
Merge PDF
Split PDF
Compress PDF
OCR
Document Scanner
```

But the current objective is to make the basic Image → PDF workflow excellent.

---

# 16. Development Principles

Follow these principles when helping me build the project:

### 1. Keep V1 simple

Don't introduce backend architecture unless there is a real requirement.

### 2. Browser-first

Image processing and PDF generation should happen locally.

### 3. Separate UI from core logic

The PDF engine and image-processing functions should not depend on React components.

### 4. Don't over-engineer

Prefer a simple implementation that works over abstractions that may be useful someday.

### 5. Build incrementally

Complete one milestone before moving to the next.

### 6. Test real behavior

Don't assume something works because the code looks correct.

Test with:

* Large images
* Phone photos
* Multiple images
* Invalid files
* Mobile browsers

### 7. Don't add features without discussing scope

If a feature isn't part of the current milestone, mention it as a possible future improvement instead of silently implementing it.

### 8. Preserve the privacy promise

Never introduce a dependency or implementation that sends user images to a server without explicitly discussing the architectural change.

---

# 17. How the Assistant Should Work With This Project

When I start a new chat, I may provide this project context.

First understand:

1. What the product is
2. The V1 scope
3. The architecture
4. The milestone roadmap
5. The current milestone
6. What has already been implemented

When giving code:

* Give the exact file path
* Give the complete file when practical
* Clearly indicate whether it is a new file or replacement
* Use TypeScript
* Follow the existing project architecture
* Don't unnecessarily rewrite unrelated files
* Don't introduce dependencies without explaining why
* Don't skip important implementation details
* Don't assume future milestones have already been implemented

When debugging:

* Ask for the relevant file/code or error if needed
* Identify the likely cause
* Explain the fix
* Give the exact code change
* Avoid rewriting the entire project unless necessary

When I say:

> "Move to Milestone X"

focus only on that milestone and its dependencies.

If a later milestone requires a decision that affects the current implementation, point it out before making a significant architectural change.

---

# 18. Current Status

Current milestone:

**Milestone 2 — Image Uploading**

Completed/implemented:

* Project initialized
* Next.js
* TypeScript
* Tailwind
* Image data model
* Image validation
* File size validation
* Image count validation
* Image decoding
* Image dimensions
* File picker
* Drag/drop upload zone
* Image previews
* Multiple image selection
* Object URL cleanup
* Basic error handling

Current files:

```text
src/
├── app/
│   └── page.tsx
│
├── components/
│   ├── images/
│   │   ├── ImageGrid.tsx
│   │   └── ImagePreview.tsx
│   │
│   └── uploader/
│       ├── FilePicker.tsx
│       └── UploadZone.tsx
│
├── hooks/
│   └── useImages.ts
│
├── lib/
│   └── image/
│       ├── decode.ts
│       └── validate.ts
│
└── types/
    └── image.ts
```

Next milestone:

**Milestone 3 — Image Workspace**

Milestone 3 should add:

* Drag-to-reorder
* Delete
* Rotate
* Clear all
* Add more images
* Better image cards
* Image ordering
* Accessibility-friendly controls

Do not jump directly to PDF generation.

---

# 19. Current Goal

The immediate goal is:

> Finish Milestone 2 completely, verify it works reliably, then move to Milestone 3.

After Milestone 3, continue sequentially through the roadmap.

The ultimate V1 goal is a production-ready, privacy-first image-to-PDF converter that works entirely in the browser.
