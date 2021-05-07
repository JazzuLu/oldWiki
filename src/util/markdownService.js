/**
 * https://stribny.name/blog/2018/10/convert-markdown-text-to-html-and-to-plaintext-in-javascript/
 * **/

/**  使用方法
import { convertToHTML, convertToPlainText } as markdownService from "./markdownService"
const html = convertToHTML(markdownText)
const plaintext = convertToPlainText(markdownText)
// or
import * as markdownService from "./markdownService"
const html = markdownService.convertToHTML(markdownText)
const plaintext = markdownService.convertToPlainText(markdownText)
**/

import marked from "marked"
import PlainTextRenderer from "marked-plaintext"

const mdOptions = {
  // whether to conform to original MD implementation
  pedantic: false,
  // Github Flavoured Markdown
  gfm: true,
  // tables extension
  tables: true,
  // smarter list behavior
  smartLists: true,
  // "smart" typographic punctuation for things like quotes and dashes
  smartypants: true,
  // sanitize HTML tags
  sanitize: true,
  // ... other options
}

const plaintextOptions = {
  sanitize: false
}

const todoListItemRenderer = (text) => {
  if (text.includes('type="checkbox"')) {
    return `<li style="list-style: none">${text}</li>`
  }
  return `<li>${text}</li>`
}

const externalLinkRenderer = (href, title, text) => {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    if (!text) {
      text = href
    }
    return `<a target="_blank" href="${href}" title="${title}">${text}</a>`
  }
  return `[${text}](${href})`
}

export function convertToHTML(markdownText) {
  const renderer = new marked.Renderer()
  renderer.listitem = todoListItemRenderer
  renderer.link = externalLinkRenderer
  marked.setOptions(mdOptions)
  return marked(markdownText, { renderer })
}

export function convertToPlainText(markdownText) {
  const renderer = new PlainTextRenderer()
  renderer.checkbox = (text) => {
    return text
  }
  marked.setOptions(plaintextOptions)
  return marked(markdownText, { renderer })
}
