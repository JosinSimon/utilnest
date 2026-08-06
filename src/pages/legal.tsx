import type { ReactNode } from "react"
import { Seo } from "@/components/seo/Seo"
import { site } from "@/data/site"

function Page({
  title,
  seoTitle,
  description,
  updated,
  children,
}: {
  title: string
  seoTitle: string
  description: string
  updated: string
  children: ReactNode
}) {
  return (
    <>
      <Seo
        data={{
          title: seoTitle,
          description,
          canonical: `${site.url}/${routePath(title)}`,
          robots: "index, follow",
          og: {
            type: "website",
            title: seoTitle,
            description,
            image: `${site.url}/og/about.png`,
            url: `${site.url}/${routePath(title)}`,
          },
        }}
      />
      <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Last updated {updated}</p>
        <div className="prose mt-8 space-y-4 text-muted-foreground">{children}</div>
      </div>
    </>
  )
}

function routePath(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-")
}

export function AboutPage() {
  return (
    <Page
      title="About"
      seoTitle={`About ${site.name}`}
      description={`Learn about ${site.name}, a free online tools platform.`}
      updated="August 6, 2026"
    >
      <p>
        {site.name} is a growing collection of free online tools built for
        students, professionals and businesses across India. Our goal is simple:
        solve everyday digital problems in seconds.
      </p>
      <p>
        Every tool is designed to do one thing well. Calculators, converters,
        image tools, PDF tools and more — all free, all fast, and all processed
        privately in your browser.
      </p>
      <p>
        We never upload your files, sell your data, or show intrusive ads.
        Privacy is not an afterthought — it's the way we build.
      </p>
    </Page>
  )
}

export function PrivacyPage() {
  return (
    <Page
      title="Privacy Policy"
      seoTitle={`Privacy Policy | ${site.name}`}
      description={`How ${site.name} protects your privacy.`}
      updated="August 6, 2026"
    >
      <h2>Your data stays on your device</h2>
      <p>
        The overwhelming majority of tools on {site.name} process everything in
        your browser. Files you upload and content you enter never leave your
        device. Nothing is stored on our servers.
      </p>
      <h2>Analytics</h2>
      <p>
        We use privacy-respecting analytics to understand which tools people use
        and how the site performs. We do not collect personal data such as your
        name, email address or IP-identifying information from tool use.
      </p>
      <h2>Cookies</h2>
      <p>
        We do not use tracking cookies. Any cookies required for core site
        functionality are minimal and non-invasive.
      </p>
      <h2>Contact</h2>
      <p>For privacy questions, email {site.legalEmail}.</p>
    </Page>
  )
}

export function TermsPage() {
  return (
    <Page
      title="Terms of Use"
      seoTitle={`Terms of Use | ${site.name}`}
      description={`Terms and conditions for using ${site.name}.`}
      updated="August 6, 2026"
    >
      <h2>Free to use</h2>
      <p>
        All tools on {site.name} are free. You may use them for personal and
        business purposes.
      </p>
      <h2>No warranty</h2>
      <p>
        Tools are provided "as is". While we aim for accuracy, please verify
        important calculations independently, especially for financial or legal
        matters.
      </p>
      <h2>Acceptable use</h2>
      <p>
        You agree not to abuse, spam, or attempt to disrupt the site. Tools must
        not be used for unlawful purposes.
      </p>
    </Page>
  )
}

export function ContactPage() {
  return (
    <Page
      title="Contact"
      seoTitle={`Contact | ${site.name}`}
      description={`Get in touch with ${site.name}.`}
      updated="August 6, 2026"
    >
      <p>
        Want a tool you don't see yet? Have feedback or spotted a bug? We'd love
        to hear from you.
      </p>
      <p>
        Email us at{" "}
        <a className="text-primary underline" href={`mailto:${site.legalEmail}`}>
          {site.legalEmail}
        </a>
        .
      </p>
      <p>We typically respond within 1–2 business days.</p>
    </Page>
  )
}