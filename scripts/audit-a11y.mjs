#!/usr/bin/env node
// A11y audit con axe-core su 4 route chiave del sito.
// Output: lista violazioni con severity, selector, impact.

import { chromium } from 'playwright'
import { AxeBuilder } from '@axe-core/playwright'

const BASE = 'https://firmamento-technologies.github.io/fibonacci-website'

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/specialita/estetica/', name: 'specialty-estetica' },
  { path: '/tutorial/', name: 'tutorial' },
  { path: '/docs/installazione/', name: 'doc-installazione' },
]

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, ignoreHTTPSErrors: true })
const page = await ctx.newPage()

const summary = { total: 0, critical: 0, serious: 0, moderate: 0, minor: 0 }
const byRoute = {}

for (const route of ROUTES) {
  console.log(`\n=== ${route.name} (${route.path}) ===`)
  await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(2500)

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()

  byRoute[route.name] = { violations: results.violations.length }
  summary.total += results.violations.length

  for (const v of results.violations) {
    summary[v.impact] = (summary[v.impact] ?? 0) + 1
    console.log(`  [${v.impact.toUpperCase()}] ${v.id}: ${v.help}`)
    console.log(`    help: ${v.helpUrl}`)
    for (const node of v.nodes.slice(0, 3)) {
      console.log(`    target: ${node.target.join(' ')}`)
      if (node.failureSummary) {
        console.log(`    why: ${node.failureSummary.split('\n').slice(1).join(' / ').substring(0, 200)}`)
      }
    }
  }
}

console.log('\n=== SUMMARY ===')
console.log(`Total violations: ${summary.total}`)
console.log(`  critical: ${summary.critical ?? 0}`)
console.log(`  serious:  ${summary.serious ?? 0}`)
console.log(`  moderate: ${summary.moderate ?? 0}`)
console.log(`  minor:    ${summary.minor ?? 0}`)
console.log('\nPer-route:')
for (const [name, data] of Object.entries(byRoute)) {
  console.log(`  ${name}: ${data.violations} violations`)
}

await browser.close()
