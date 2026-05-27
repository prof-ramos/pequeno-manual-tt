import type { RequestHandler } from './$types'
import { CONSELHOS } from '$lib/conselhos'

export const GET: RequestHandler = async ({ url }) => {
  const quote = url.searchParams.get('quote')
  const theme = url.searchParams.get('theme') || 'noir'
  const padding = url.searchParams.get('padding') || '64'
  const align = url.searchParams.get('align') || 'center'
  const font = url.searchParams.get('font') || ''
  const marks = url.searchParams.get('marks') !== 'false' ? 'true' : 'false'
  const bg = url.searchParams.get('bg') !== 'false' ? 'true' : 'false'
  const author = url.searchParams.get('author') || 'H. Jackson Brown, Jr.'
  const source = url.searchParams.get('source') || ''
  const number = url.searchParams.get('number')

  // Build URL for the page with query params
  const baseUrl = url.origin
  const params = new URLSearchParams({
    quote: quote || '',
    theme,
    align,
    padding,
    marks,
    bg
  })
  if (font) params.set('font', font)
  if (source) params.set('source', source)
  if (number) params.set('number', number)

  const pageUrl = `${baseUrl}/?${params.toString()}`

  try {
    // Dynamic import of playwright
    const { chromium } = await import('playwright')

    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage({
      viewport: { width: 1200, height: 630 }
    })

    await page.goto(pageUrl, { waitUntil: 'networkidle' })

    // Wait for the quote frame to be visible
    await page.waitForSelector('.quote-frame', { timeout: 10000 })

    // Give a moment for fonts to load
    await page.waitForTimeout(1000)

    // Take screenshot of the quote frame
    const frame = await page.$('.quote-frame')
    if (!frame) {
      throw new Error('Quote frame not found')
    }

    const imageBuffer = await frame.screenshot({
      type: 'png',
      omitBackground: false
    })

    await browser.close()

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    console.error('Error generating image:', error)

    // Fallback: return error message as PNG-like response
    return new Response(JSON.stringify({ error: 'Failed to generate image', details: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}