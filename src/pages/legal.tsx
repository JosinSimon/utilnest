import type { ReactNode } from "react"
import { Seo } from "@/components/seo/Seo"
import { site } from "@/data/site"
import { Link } from "react-router-dom"
import { ShieldCheck, Lock, FileText, Mail } from "lucide-react"
import { categories } from "@/data/categories"
import { getToolsByCategory, totalToolCount } from "@/data/registry"
import { categoryPath } from "@/data/derive"

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
            image: site.defaultOgImage,
            url: `${site.url}/${routePath(title)}`,
          },
        }}
      />
      <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6">
        <div className="border-b pb-6 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {site.name} ({site.domain}) · Last updated {updated}
          </p>
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </>
  )
}

function routePath(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-")
}

export function AboutPage() {
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)
  return (
    <Page
      title="About UtilNest"
      seoTitle={`About ${site.name} - Free, Private Online Tools for India`}
      description={`${site.name} is a free collection of calculators, PDF, image and audio tools that run in your browser. Learn how the tools work and how we check them.`}
      updated="November 11, 2026"
    >
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mt-0">
          <ShieldCheck className="size-5 text-primary" /> What {site.name} is
        </h2>
        <p className="mt-2 text-sm text-foreground/90 mb-0">
          {site.name} (<a href={site.url} className="text-primary font-medium">{site.domain}</a>) is a free collection of {totalToolCount}+ everyday online tools: loan and tax calculators, PDF and image tools, exam photo and signature resizers, invoice and quotation generators, and audio converters. It is built for students, job seekers, freelancers and small businesses in India, and anyone else who needs a quick, reliable tool without signing up.
        </p>
      </div>

      <h2 className="text-foreground font-bold text-xl">Why we built it</h2>
      <p>
        Most free online tools ask you to upload your files to their servers. That is a real risk when the file is an Aadhaar card, a PAN card, a salary slip, a signed agreement or a call recording. Many of those sites are also slow, full of pop-ups, or stop working after a few uses unless you pay.
      </p>
      <p>
        {site.name} takes a different approach. The tools run inside your own browser, so the work happens on your phone or computer, not on a server. There is no account to create and no daily limit.
      </p>

      <h2 className="text-foreground font-bold text-xl">How the tools handle your files</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Files stay on your device.</strong> When you compress a PDF, resize a photo or convert an audio file, the file is processed by code running in your browser. It is not uploaded to {site.name} or to anyone else.</li>
        <li><strong>Calculators send nothing.</strong> Loan amounts, salaries and tax figures you type are calculated in the page and are not stored.</li>
        <li><strong>What we do measure.</strong> We use Google Analytics to count visits and see which tools are used, so we know what to improve. It never receives the files you process or the numbers you type. Details are in our <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>.</li>
      </ul>

      <h2 className="text-foreground font-bold text-xl">How we check the tools</h2>
      <p>
        Calculators use the standard published formulas (for example, the reducing-balance EMI formula used by Indian banks) and are covered by automated tests that compare results with worked examples. Exam and document photo sizes are taken from official notifications, and each tool page shows when it was last updated. Requirements change every exam cycle, so the pages also remind you to check your own notification before uploading.
      </p>
      <p>
        If you find a mistake, such as a wrong formula, an outdated exam size or a broken tool, please <Link to="/contact" className="text-primary underline">tell us</Link>. Corrections are our top priority.
      </p>

      <h2 className="text-foreground font-bold text-xl">What you can do here</h2>
      <ul className="list-disc pl-5 space-y-2">
        {sortedCategories.map((category) => (
          <li key={category.slug}>
            <Link to={categoryPath(category.slug)} className="font-semibold text-primary underline">
              {category.name}
            </Link>{" "}
            ({getToolsByCategory(category.slug).length} tools): {category.tagline}
          </li>
        ))}
      </ul>

      <h2 className="text-foreground font-bold text-xl">How {site.name} stays free</h2>
      <p>
        Every tool is free to use, with no sign-up, no watermarks and no paid tier. To cover hosting and development costs, {site.name} may show a small number of ads from Google AdSense. Ads never get access to your files or the data you enter in the tools.
      </p>

      <h2 className="text-foreground font-bold text-xl">Get in touch</h2>
      <p>
        Questions, tool requests and corrections are welcome. Email{" "}
        <a className="font-semibold text-primary underline" href={`mailto:${site.legalEmail}`}>{site.legalEmail}</a>{" "}
        or visit the <Link to="/contact" className="text-primary underline">contact page</Link>.
      </p>
    </Page>
  )
}

export function PrivacyPage() {
  return (
    <Page
      title="Privacy Policy"
      seoTitle={`Privacy Policy | ${site.name} (${site.domain})`}
      description={`Official Privacy Policy for ${site.name} (${site.domain}) compliant with Google AdSense, GDPR, CCPA, and India DPDP Act 2023.`}
      updated="August 11, 2026"
    >
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mt-0">
          <Lock className="size-5 text-emerald-600" /> Complete Privacy Guarantee
        </h2>
        <p className="mt-2 text-sm text-foreground/90 mb-0">
          At {site.name} (accessible from <a href={site.url} className="text-primary font-semibold">{site.domain}</a>), one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information collected and how we protect it.
        </p>
      </div>

      <h3 className="text-foreground font-bold">1. Zero File Upload Policy (Local Processing)</h3>
      <p>
        {site.name} operates on a 100% client-side philosophy. Any files you select (PDFs, images, documents) and data you calculate (GST, EMI, Income Tax, Passwords, QR Codes) are processed locally inside your web browser. <strong>No file data is uploaded, stored, or transmitted to any server or third party.</strong>
      </p>

      <h3 className="text-foreground font-bold">2. Log Files & Standard Analytics</h3>
      <p>
        {site.name} follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
      </p>

      <h3 className="text-foreground font-bold">3. Google AdSense & Third-Party Advertising Cookies</h3>
      <p>
        Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to {site.domain} and/or other sites on the Internet.
        </li>
        <li>
          Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Ads Settings</a> or <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.aboutads.info</a>.
        </li>
      </ul>
      <p>
        {site.name} has no access to or control over these cookies that are used by third-party advertisers.
      </p>

      <h3 className="text-foreground font-bold">4. GDPR & Data Protection Rights</h3>
      <p>
        We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
        <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
        <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data.</li>
      </ul>

      <h3 className="text-foreground font-bold">5. Children's Privacy (COPPA Compliance)</h3>
      <p>
        Another part of our priority is adding protection for children while using the internet. {site.name} does not knowingly collect any Personal Identifiable Information from children under the age of 13.
      </p>

      <h3 className="text-foreground font-bold">6. Contact & Grievance Redressal</h3>
      <p>
        If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at{" "}
        <a href={`mailto:${site.legalEmail}`} className="text-primary font-semibold underline">
          {site.legalEmail}
        </a>.
      </p>
    </Page>
  )
}

export function TermsPage() {
  return (
    <Page
      title="Terms of Use"
      seoTitle={`Terms of Use | ${site.name} (${site.domain})`}
      description={`Official Terms of Use and Conditions for accessing and using ${site.name} (${site.domain}).`}
      updated="August 11, 2026"
    >
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mt-0">
          <FileText className="size-5 text-amber-600" /> Terms & Conditions
        </h2>
        <p className="mt-2 text-sm text-foreground/90 mb-0">
          Welcome to {site.name} (<a href={site.url} className="text-primary font-semibold">{site.domain}</a>). By accessing this website, you accept and agree to be bound by these Terms of Use.
        </p>
      </div>

      <h3 className="text-foreground font-bold">1. Free Commercial & Personal License</h3>
      <p>
        Unless otherwise stated, {site.name} and/or its licensors own the intellectual property rights for all material on {site.domain}. All intellectual property rights are reserved. You may access this for your own personal and commercial use subject to restrictions set in these terms and conditions.
      </p>

      <h3 className="text-foreground font-bold">2. Disclaimer & No Financial/Legal Advice</h3>
      <p>
        The tools, calculators, and information provided on {site.domain} are for general utility purposes only. While we take every effort to ensure 100% mathematical precision, {site.name} does not provide certified legal, tax, or financial advice. Users should verify critical calculations (such as official Income Tax or GST filings) independently with a certified professional.
      </p>

      <h3 className="text-foreground font-bold">3. Limitation of Liability</h3>
      <p>
        In no event shall {site.name}, nor any of its officers, directors, or employees, be held liable for anything arising out of or in any way connected with your use of this website whether such liability is under contract. {site.name} shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website.
      </p>

      <h3 className="text-foreground font-bold">4. External Links</h3>
      <p>
        {site.domain} may contain links to external third-party websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites.
      </p>

      <h3 className="text-foreground font-bold">5. Governing Law</h3>
      <p>
        These Terms will be governed by and interpreted in accordance with the laws of the Republic of India.
      </p>
    </Page>
  )
}

export function ContactPage() {
  return (
    <Page
      title="Contact Us"
      seoTitle={`Contact ${site.name} - Report a Bug, Request a Tool`}
      description={`Contact ${site.name} to report a bug, request a new tool, correct an exam photo size or ask about privacy. Email ${site.legalEmail}.`}
      updated="November 11, 2026"
    >
      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mt-0">
            <Mail className="size-5 text-indigo-600" /> Email us
          </h2>
          <p className="mt-1 text-sm text-foreground/90 mb-0">
            The fastest way to reach us is email:{" "}
            <a className="font-semibold text-primary underline" href={`mailto:${site.legalEmail}`}>{site.legalEmail}</a>
          </p>
        </div>
        <a
          href={`mailto:${site.legalEmail}`}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow transition-transform hover:scale-105 active:scale-95 shrink-0"
        >
          <Mail className="size-4" /> Email {site.name}
        </a>
      </div>

      <p>
        {site.name} is an independent project, and we read every message. To help us reply quickly, use a subject line that starts with one of the topics below.
      </p>

      <h2 className="text-foreground font-bold text-xl">Report a bug</h2>
      <p>
        Use the subject <strong>Bug:</strong> followed by the tool name. Tell us the page link, what you expected and what happened instead, and which device and browser you used (for example, "Android phone, Chrome"). A screenshot helps.
      </p>
      <p>
        <strong>Please do not email us your private files</strong>, such as ID cards, photos, signatures or call recordings. If a file causes a problem, describe it instead (format, size in KB or MB, and where it came from). Our tools are designed so we never need to see your files.
      </p>

      <h2 className="text-foreground font-bold text-xl">Correct an exam or document size</h2>
      <p>
        Use the subject <strong>Correction:</strong>. Exam photo and signature rules change each year. If a size on {site.name} doesn't match your official notification, send us the exam name, the year and a link to the notification, and we will update the tool.
      </p>

      <h2 className="text-foreground font-bold text-xl">Request a new tool</h2>
      <p>
        Use the subject <strong>Tool request:</strong>. Describe what you need it to do and, if possible, an example input and the result you expect.
      </p>

      <h2 className="text-foreground font-bold text-xl">Privacy questions</h2>
      <p>
        Use the subject <strong>Privacy:</strong>. Our <Link to="/privacy" className="text-primary underline">Privacy Policy</Link> explains what we collect (anonymous usage statistics) and what we never collect (the files you process and the data you type into tools). Our <Link to="/terms" className="text-primary underline">Terms of Use</Link> cover how the tools may be used.
      </p>

      <h2 className="text-foreground font-bold text-xl">Business and partnership enquiries</h2>
      <p>
        Use the subject <strong>Business:</strong> for partnerships, embedding a tool on your website, or other enquiries.
      </p>
    </Page>
  )
}
