import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "password-generator",
  name: "Password Generator",
  slug: "password-generator",
  category: "utilities",
  path: "utilities/password-generator",

  shortDescription:
    "Generate strong random passwords in your browser. Pick length 6 to 64, letters, numbers and symbols, skip look-alike characters and see the strength in bits.",
  longDescription:
    "Create strong, random passwords for email, banking, shopping and work accounts. Choose the length, pick which character types to use, leave out characters that are easy to misread, and make up to 50 passwords at once. Every password is made in your browser with the Web Crypto API and is never sent or stored anywhere.",

  sections: [
    {
      heading: "How the passwords are made",
      body: "The tool builds a character pool from the sets you tick: A-Z, a-z, 0-9 and 26 symbols such as ! @ # $ % and &. It then picks each character from that pool using crypto.getRandomValues, the random source your browser provides for security work. Values that would make some characters more likely than others are thrown away and redrawn, so every character in the pool has an equal chance. Nothing is sent to a server, and changing any option or clicking Regenerate makes a fresh password.",
    },
    {
      heading: "How the strength meter works",
      body: "Strength is shown in bits of entropy: length × log2(pool size). More bits means more guesses an attacker would need. With all four sets on and look-alike characters removed, the pool has 82 characters, so a 16-character password scores about 102 bits (Strong) and a 20-character one about 127 bits (Very Strong). A 12-character password of letters and numbers only scores about 70 bits (Fair). The labels are: under 32 bits Very Weak, 32 to 59 Weak, 60 to 79 Fair, 80 to 119 Strong, and 120 or more Very Strong.",
    },
    {
      heading: "Choosing length and character types",
      body: "Length adds more strength than anything else, so go long when the site allows it. For most accounts, 16 characters with all four sets is a good default. For a password manager master password or a work admin account, use 20 or more. Some bank, government and older company portals limit the length or reject certain symbols. If a site refuses the password, turn off Symbols or lower the length, then generate again rather than editing the password by hand.",
    },
    {
      heading: "Look-alike characters and bulk passwords",
      body: "The Exclude Ambiguous option removes O, 0, I, 1, l and |, which look alike in many fonts. Keep it on when you will read a password aloud, type it from a printout or share Wi-Fi details with family. It removes only 6 characters from the pool, so the strength drop is small. Set Quantity up to 50 to make a list of passwords at once, for example when setting up accounts for a new team. Each one has its own copy button.",
    },
    {
      heading: "Using generated passwords safely",
      body: "Use a different password for every account, so one leak does not open the rest. Save new passwords in a password manager or your browser's built-in manager instead of a notes app or chat. Turn on two-factor authentication for email, banking and UPI-linked accounts. Each character is picked from the combined pool, so a short password can sometimes miss a type, such as a digit. If a site insists on at least one of each, check the result and click Regenerate if needed.",
    },
  ],

  examples: [
    {
      title: "Default settings",
      input: "16 characters · A-Z, a-z, 0-9, symbols · look-alikes excluded",
      output: "Pool of 82 characters · about 102 bits · Strong",
    },
    {
      title: "Master password",
      input: "20 characters · all four sets · look-alikes excluded",
      output: "About 127 bits · Very Strong",
    },
    {
      title: "Site that rejects symbols",
      input: "12 characters · letters and numbers · look-alikes excluded",
      output: "Pool of 57 characters · about 70 bits · Fair",
    },
  ],

  primaryKeyword: "password generator",
  keywords: [
    "strong password generator",
    "random password generator",
    "secure password generator",
    "password generator online free",
    "16 character password generator",
    "password generator with symbols",
    "password generator without ambiguous characters",
    "bulk password generator",
    "password entropy calculator",
    "how to create a strong password",
  ],
  searchAliases: [
    "password maker",
    "password creator",
    "random password",
    "strong password",
    "generate password",
    "secure key generator",
  ],
  searchWeight: 95,

  relatedTools: ["uuid-generator", "qr-code-generator", "random-number-generator"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",

  schemaType: "Generator",
  icon: "key-round",
  faq: [
    {
      question: "Are the generated passwords saved or sent anywhere?",
      answer:
        "No. Passwords are made by JavaScript running in your browser and are not uploaded, logged or stored. Once you close or refresh the page, they are gone, so copy the one you need into your password manager first.",
    },
    {
      question: "How strong is a 16-character password?",
      answer:
        "With uppercase, lowercase, numbers and symbols, and look-alike characters removed, a 16-character password has about 102 bits of entropy, which the tool rates Strong. Raising it to 20 characters gives about 127 bits, rated Very Strong.",
    },
    {
      question: "What does entropy in bits mean?",
      answer:
        "It measures how many guesses a random password would take. Each extra bit doubles the number of possibilities. The tool works it out as length × log2(pool size), where pool size is how many different characters can appear.",
    },
    {
      question: "Why does my password have no number or symbol?",
      answer:
        "Each character is drawn at random from the whole pool, so a password is not forced to include every type. This is most noticeable with short lengths. Click Regenerate, or use a longer password, if a site requires at least one of each.",
    },
    {
      question: "How long should my password be?",
      answer:
        "Use at least 12 characters for everyday accounts and 16 or more where the site allows it. Use 20 or more for a password manager master password or an important email account. The slider goes from 6 to 64 characters.",
    },
    {
      question: "Can I generate many passwords at once?",
      answer:
        "Yes. Set Quantity to any number from 1 to 50. All passwords use the same settings, and each has its own copy button in the list.",
    },
  ],
  howTo: [
    {
      title: "Set the length",
      description: "Drag the slider to choose 6 to 64 characters. 16 is a sensible default for most accounts.",
    },
    {
      title: "Pick character types",
      description: "Tick uppercase, lowercase, numbers and symbols. Untick Symbols only if the site rejects them.",
    },
    {
      title: "Adjust extras",
      description: "Keep Exclude Ambiguous on to avoid O, 0, I, 1, l and |, and set Quantity if you need several passwords.",
    },
    {
      title: "Copy and save",
      description: "Check the strength label, click Copy, and save it in your password manager straight away.",
    },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
