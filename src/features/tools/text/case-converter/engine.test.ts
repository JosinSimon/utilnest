import { describe, it, expect } from "vitest"
import { convertCase, type CaseMode } from "./engine"

function apply(text: string, mode: CaseMode) {
  return convertCase(text, mode)
}

describe("case-converter engine", () => {
  it("uppercases text", () => {
    expect(apply("Hello World", "upper")).toBe("HELLO WORLD")
  })

  it("lowercases text", () => {
    expect(apply("Hello World", "lower")).toBe("hello world")
  })

  it("title-cases each word", () => {
    expect(apply("hello world foo", "title")).toBe("Hello World Foo")
  })

  it("handles mixed separators for title case", () => {
    expect(apply("hello-world foo_bar", "title")).toBe("Hello World Foo Bar")
  })

  it("preserves non-ASCII Unicode characters in title and camel cases", () => {
    expect(apply("café au lait", "title")).toBe("Café Au Lait")
    expect(apply("café au lait", "camel")).toBe("caféAuLait")
  })

  it("sentence-cases only the first letter", () => {
    expect(apply("hELLO WORLD", "sentence")).toBe("Hello world")
  })

  it("produces camelCase", () => {
    expect(apply("hello world", "camel")).toBe("helloWorld")
    expect(apply("hello-world test_string", "camel")).toBe("helloWorldTestString")
  })

  it("produces PascalCase", () => {
    expect(apply("hello world", "pascal")).toBe("HelloWorld")
  })

  it("produces kebab-case", () => {
    expect(apply("Hello World", "kebab")).toBe("hello-world")
  })

  it("produces snake_case", () => {
    expect(apply("Hello World", "snake")).toBe("hello_world")
  })

  it("produces CONSTANT_CASE", () => {
    expect(apply("Hello World", "constant")).toBe("HELLO_WORLD")
  })

  it("handles single word input", () => {
    expect(apply("hello", "camel")).toBe("hello")
    expect(apply("hello", "pascal")).toBe("Hello")
    expect(apply("hello", "upper")).toBe("HELLO")
  })

  it("tokenizes acronyms for joining cases", () => {
    expect(apply("API docs", "camel")).toBe("apiDocs")
    expect(apply("API docs", "kebab")).toBe("api-docs")
  })

  it("returns empty string for empty input", () => {
    expect(apply("", "upper")).toBe("")
    expect(apply("", "title")).toBe("")
    expect(apply("   ", "sentence")).toBe("")
  })

  it("handles digits inside words", () => {
    expect(apply("game 2 is here", "camel")).toBe("game2IsHere")
  })

  it("is deterministic", () => {
    const a = convertCase("hello world", "camel")
    const b = convertCase("hello world", "camel")
    expect(a).toBe(b)
  })
})