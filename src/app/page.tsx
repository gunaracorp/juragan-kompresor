import { db } from '@/lib/db'
import { serializeProduct, serializeArticle } from '@/lib/serialize'
import type { Product } from '@/lib/types'
import { FOUNDER, CO_ENGINEER, FOUNDER_SAME_AS, SUPPORT_COMPANIES } from '@/lib/branding'
import TopBar from '@/components/juragan/top-bar'
import Navbar from '@/components/juragan/navbar'
import Hero from '@/components/juragan/hero'
import BrandMarquee from '@/components/juragan/brand-marquee'
import UspSection from '@/components/juragan/usp-section'
import FlashSale from '@/components/juragan/flash-sale'
import CatalogSection from '@/components/juragan/catalog'
import ToolsSection from '@/components/juragan/tools-section'
import ArticlesSection from '@/components/juragan/articles-section'
import TestimonialsSection from '@/components/juragan/testimonials-section'
import FaqSection from '@/components/juragan/faq-section'
import CtaSection from '@/components/juragan/cta-section'
import Footer from '@/components/juragan/footer'
import CartSheet from '@/components/juragan/cart-sheet'
import ProductDetailSheet from '@/components/juragan/product-detail-sheet'
import { CompareBar, CompareSheet } from '@/components/juragan/compare'
import ChatWidget from '@/components/juragan/chat-widget'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://juragankompresor.id'

export default async function Home() {
  const [productsRaw, articlesRaw, testimonials, faqs] = await Promise.all([
    db.product.findMany({ orderBy: { soldCount: 'desc' } }),
    db.article.findMany({ orderBy: { publishedAt: 'desc' } }),
    db.testimonial.findMany({ orderBy: { createdAt: 'asc' } }),
    db.faq.findMany({ orderBy: { order: 'asc' } }),
  ])

  const products: Product[] = productsRaw.map(serializeProduct)
  const articles = articlesRaw.map(serializeArticle)

  const flashProduct = products.find(
    (p) => p.saleEndsAt && new Date(p.saleEndsAt).getTime() > Date.now() && p.stock > 0,
  ) ?? null

  /* ====== JSON-LD SCHEMA (SEO) ====== */
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Juragan Kompresor',
    url: SITE_URL,
    logo: `${SITE_URL}/images/og-image.jpg`,
    description:
      'Toko kompresor AC #1 Indonesia. Jual kompresor AC original Daikin, Panasonic, LG, Gree, Mitsubishi, Copeland, Danfoss, Bitzer — bergaransi resmi.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Raya Kompresor No. 88, Glodok',
      addressLocality: 'Jakarta Barat',
      addressRegion: 'DKI Jakarta',
      postalCode: '11180',
      addressCountry: 'ID',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+62-21-8888-7777',
      contactType: 'customer service',
      areaServed: 'ID',
      availableLanguage: ['id'],
    },
    sameAs: ['https://instagram.com/juragankompresor', 'https://facebook.com/juragankompresor', ...FOUNDER_SAME_AS],
    founder: {
      '@type': 'Person',
      name: FOUNDER.name,
      alternateName: [...FOUNDER.aliases],
      jobTitle: FOUNDER.jobTitle,
    },
    foundedBy: { '@id': `${SITE_URL}/#gugun-gunara` },
  }

  /* Knowledge Graph: sang pembuat + perusahaan pendukung (nama naik di Google) */
  const brandGraphJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#gugun-gunara`,
        name: FOUNDER.name,
        alternateName: [...FOUNDER.aliases],
        jobTitle: FOUNDER.jobTitle,
        description:
          'Master polymath, arsitek & engineer super web app Juragan Kompresor — platform penjualan kompresor AC #1 Indonesia. Dikenal juga sebagai prabudanling & santri angon.',
        knowsAbout: [...FOUNDER.knowsAbout],
        worksFor: { '@id': `${SITE_URL}/#pt-top-konsultan-internasional` },
        sameAs: [...FOUNDER_SAME_AS],
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#muhammad-lutfi-azmi`,
        name: CO_ENGINEER.name,
        jobTitle: CO_ENGINEER.role,
        description: 'Co-engineer Juragan Kompresor, mewakili PT Digital Bisnis Manajemen (digiman.id) sebagai support system.',
        worksFor: { '@id': `${SITE_URL}/#pt-digital-bisnis-manajemen` },
        sameAs: ['https://digiman.id'],
      },
      ...SUPPORT_COMPANIES.map((c) => ({
        '@type': 'Organization',
        '@id': `${SITE_URL}/#${c.legalName.toLowerCase().replace(/\s+/g, '-')}`,
        name: c.legalName,
        alternateName: c.name,
        url: c.url,
        description: `${c.legalName} — ${c.role} untuk platform Juragan Kompresor.`,
        foundedBy: c.legalName === 'PT Top Konsultan Internasional' ? { '@id': `${SITE_URL}/#gugun-gunara` } : undefined,
      })),
    ],
  }

  /* BlogPosting: atribusi penulis artikel → nama ikut muncul di rich results Google */
  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Kompresorpedia — Artikel Edukasi Kompresor',
    itemListElement: articles.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'BlogPosting',
        headline: a.title,
        description: a.excerpt,
        datePublished: a.publishedAt,
        inLanguage: 'id-ID',
        author: { '@id': `${SITE_URL}/#gugun-gunara` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntityOfPage: SITE_URL,
      },
    })),
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Juragan Kompresor',
    url: SITE_URL,
    description: 'Toko kompresor AC original terlengkap di Indonesia.',
    publisher: { '@id': `${SITE_URL}/#organization` },
    creator: { '@id': `${SITE_URL}/#gugun-gunara` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Katalog Kompresor AC Juragan Kompresor',
    numberOfItems: products.length,
    itemListElement: products.slice(0, 12).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        image: `${SITE_URL}${p.image}`,
        description: p.description,
        sku: p.modelCode,
        brand: { '@type': 'Brand', name: p.brand },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.reviews },
        offers: {
          '@type': 'Offer',
          url: SITE_URL,
          priceCurrency: 'IDR',
          price: p.price,
          availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@id': `${SITE_URL}/#organization` },
        },
      },
    })),
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* SEO Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(brandGraphJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />

      <TopBar />
      <Navbar />

      <main className="flex-1">
        <Hero productCount={products.length} />
        <BrandMarquee />
        <UspSection />
        <FlashSale product={flashProduct} />
        <CatalogSection products={products} />
        <ToolsSection products={products} />
        <ArticlesSection articles={articles} />
        <TestimonialsSection testimonials={testimonials} />
        <FaqSection faqs={faqs} />
        <CtaSection />
      </main>

      <Footer />

      {/* Overlay global */}
      <CartSheet />
      <ProductDetailSheet products={products} />
      <CompareSheet products={products} />
      <CompareBar products={products} />
      <ChatWidget />
    </div>
  )
}
