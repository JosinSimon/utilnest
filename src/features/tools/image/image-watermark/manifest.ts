import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "image-watermark",
  name: "Image Watermark",
  slug: "image-watermark",
  category: "image",
  path: "image/image-watermark",

  shortDescription:
    "Add a text or logo watermark to a photo in your browser. Set position, size and opacity, then download as JPG or PNG. Free, no upload.",
  longDescription:
    "Add your name, shop name, website or a logo to a photo before you share it. Pick one of four corners or the centre, set the size and opacity, and save the result as JPG or PNG at the original dimensions. The image is processed in your browser and never uploaded.",
  schemaType: "Utility",

  sections: [
    {
      heading: "Text or logo: which to use",
      body: "A text watermark is the quickest choice. Type something short such as \"© Priya Studio\" or your Instagram handle. The text is drawn in white with a soft dark shadow, so it stays readable on both light and dark photos. A logo watermark suits a business with a brand mark. Use a PNG with a transparent background, otherwise the logo shows as a box with its own background. If you add both text and a logo, they are placed at the same position and can overlap, so for most photos pick one.",
    },
    {
      heading: "Choosing position, size and opacity",
      body: "Bottom right is the default and works for most photos because the subject is rarely there. Centre is harder to crop out, which suits proofs you send to clients before payment. The size slider runs from 2% to 30%. For text it sets the font size as a share of the image's shorter side; for a logo it sets the logo width as a share of the image width. Opacity runs from 10% to 100%. Around 50% to 70% is visible without hiding the photo.",
    },
    {
      heading: "Worked example: product photos for an online shop",
      body: "Say you sell handmade earrings on Instagram and WhatsApp. Choose a 1080 × 1080 product photo, type your shop name, keep bottom right, set size to about 5% and opacity to 60%. That gives a font size of about 54 pixels, small enough not to distract and large enough to read on a phone. Download as JPG and repeat with the same settings for each photo so your whole catalogue looks consistent.",
    },
    {
      heading: "JPG or PNG output",
      body: "JPG gives a smaller file and is the right choice for photos you will post or send on chat apps. PNG is lossless and keeps sharp edges, which helps for screenshots, graphics and images with text, but the file is usually much larger. Either way, the output keeps the same width and height as your original image, and the file name ends in \"-watermarked\" so you do not mix it up with the original.",
    },
    {
      heading: "What a watermark can and cannot do",
      body: "A watermark shows who owns or made the image and makes casual copying less likely. It is not a lock. A corner mark can be cropped off, so use the centre position for anything you really want to protect. Always keep your original, unwatermarked file safe. Because the watermarking runs on your device, you can use this tool for client proofs or personal photos without sending them to any server.",
    },
  ],

  examples: [
    {
      title: "Instagram product photo",
      input: "1080 × 1080 JPG, text \"@myshop\", bottom right, 5% size, 60% opacity",
      output: "1080 × 1080 JPG with a small white handle in the corner",
    },
    {
      title: "Photographer's client proof",
      input: "Photo with a transparent PNG logo, centre, 30% size, 40% opacity",
      output: "Logo across the middle at 30% of the image width, faint enough to judge the photo",
    },
    {
      title: "Screenshot for a tutorial",
      input: "PNG screenshot, text \"example.com\", top right, PNG output",
      output: "Lossless PNG with sharp text and the same dimensions",
    },
  ],

  primaryKeyword: "watermark image",
  keywords: [
    "add watermark to photo",
    "add watermark to image online free",
    "image watermark online",
    "text watermark on photo",
    "add logo to photo",
    "logo watermark on image",
    "add name on photo",
    "add copyright to image",
    "watermark photo without app",
    "transparent watermark on image",
    "protect image with watermark",
    "watermark product photos",
  ],
  searchAliases: [
    "watermark my photos",
    "add copyright text to image",
    "image branding tool",
    "put logo on picture",
    "photo watermark maker",
    "watermark jpg",
  ],
  searchWeight: 74,

  relatedTools: ["image-converter", "image-resizer", "image-compressor", "pdf-watermark"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-07",
  lastUpdated: "2026-11-11",

  icon: "droplets",
  faq: [
    {
      question: "How do I add a watermark to a photo for free?",
      answer:
        "Choose your photo, type your watermark text or add a logo, pick a position, set size and opacity, then press Apply watermark and download. There is no sign-up and no charge.",
    },
    {
      question: "Can I use my logo as a watermark?",
      answer:
        "Yes. Add your logo as a PNG or JPG file. A PNG with a transparent background gives the cleanest result because only the logo shape is drawn on the photo.",
    },
    {
      question: "What opacity should I use?",
      answer:
        "For a visible but quiet mark, 50% to 70% works on most photos. For proofs you want to protect, use the centre position with a lower opacity such as 30% to 40%, so the photo can still be judged.",
    },
    {
      question: "Does the watermark reduce image quality?",
      answer:
        "The width and height stay the same. JPG output is saved at high quality, so the change is hard to see. Choose PNG if you need a lossless file.",
    },
    {
      question: "Can I watermark many photos at once?",
      answer:
        "This tool works on one photo at a time. Keep the same text, position, size and opacity for each photo so they all match.",
    },
    {
      question: "Are my photos uploaded?",
      answer: "No. The watermark is drawn in your browser and the photo never leaves your device.",
    },
  ],
  howTo: [
    {
      title: "Choose your photo",
      description: "Drag a JPG, PNG or WebP onto the box, browse for it, or paste a copied image.",
    },
    {
      title: "Add text or a logo",
      description: "Type a short line such as your name or handle, or add a transparent PNG logo.",
    },
    {
      title: "Set position, size and opacity",
      description: "Pick a corner or the centre, then move the size and opacity sliders until the mark looks right.",
    },
    {
      title: "Apply and download",
      description: "Choose JPG or PNG, press Apply watermark, then download the new file.",
    },
  ],

  engine: "file",
  privacyNote: "client",
}
