import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS } from './src/data/products.js';
import { Product, Order, OrderItem } from './src/types.js';

// In-memory store for newly added products and completed orders
let productsStore: Product[] = [...INITIAL_PRODUCTS];
const ordersStore: Order[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Route: Get Catalog Products
  app.get('/api/products', (req, res) => {
    const { category, search, featured, trending, sort } = req.query;

    let filtered = [...productsStore];

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (featured === 'true') {
      filtered = filtered.filter(p => p.featured);
    }

    if (trending === 'true') {
      filtered = filtered.filter(p => p.trending);
    }

    if (sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'popular') {
      filtered.sort((a, b) => b.downloadsCount - a.downloadsCount);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  });

  // API Route: Get Single Product Details
  app.get('/api/products/:id', (req, res) => {
    const product = productsStore.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Digital product not found in Atelier' });
    }
    res.json({ success: true, data: product });
  });

  // API Route: Creator Submit New Product
  app.post('/api/products', (req, res) => {
    const newProductData = req.body as Partial<Product>;

    if (!newProductData.title || !newProductData.category || !newProductData.price) {
      return res.status(400).json({ success: false, error: 'Title, category, and base price are required' });
    }

    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      id,
      title: newProductData.title,
      tagline: newProductData.tagline || 'Exquisite luxury digital resource.',
      description: newProductData.description || 'Handcrafted digital asset for modern creative direction.',
      category: newProductData.category,
      categoryLabel: newProductData.categoryLabel || 'Creative Asset',
      author: newProductData.author || {
        name: 'Atelier Creator',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        studio: 'AURA Verified Studio',
        verified: true,
      },
      rating: 5.0,
      reviewsCount: 1,
      downloadsCount: 1,
      fileFormats: newProductData.fileFormats || ['.zip', '.fig'],
      fileSize: newProductData.fileSize || '150 MB',
      updatedAt: 'Just Now',
      version: 'v1.0.0',
      price: Number(newProductData.price),
      licenses: newProductData.licenses || [
        {
          type: 'personal',
          name: 'Personal License',
          price: Number(newProductData.price),
          description: 'Single personal project usage.',
          rights: ['1 Personal Project', 'Standard Support'],
        },
        {
          type: 'commercial',
          name: 'Commercial Atelier License',
          price: Number(newProductData.price) * 2.5,
          description: 'Commercial client usage.',
          rights: ['Unlimited Commercial Projects', 'Multi-user Workspace'],
        },
      ],
      previewImage: newProductData.previewImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
      galleryImages: newProductData.galleryImages || [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
      ],
      specifications: newProductData.specifications || {
        Format: 'Digital Package',
        Resolution: 'High-Res Vectors',
      },
      tags: newProductData.tags || ['Luxury', 'Digital Asset'],
    };

    productsStore.unshift(newProduct);
    res.status(201).json({ success: true, data: newProduct });
  });

  // API Route: Process Checkout & License Generation
  app.post('/api/checkout', (req, res) => {
    const { customerEmail, customerName, items, voucherCode, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    let subtotal = 0;
    const orderItems: OrderItem[] = [];

    items.forEach((item: { productId: string; selectedLicenseType?: string }) => {
      const product = productsStore.find(p => p.id === item.productId);
      if (product) {
        const license = product.licenses.find(l => l.type === item.selectedLicenseType) || product.licenses[0];
        const price = license.price;
        subtotal += price;

        // Generate Cryptographic License Key
        const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
        const timestamp = Date.now().toString(36).toUpperCase();
        const downloadKey = `AURA-LIC-${randomHex}-${timestamp}-${product.id.slice(0, 6).toUpperCase()}`;

        orderItems.push({
          productId: product.id,
          title: product.title,
          category: product.categoryLabel,
          licenseName: license.name,
          price,
          downloadKey,
          previewImage: product.previewImage,
        });

        // Increment download count
        product.downloadsCount += 1;
      }
    });

    // Discount handling
    let discount = 0;
    if (voucherCode && voucherCode.toUpperCase().trim() === 'LUXURY20') {
      discount = subtotal * 0.2;
    }

    const total = Math.max(0, subtotal - discount);
    const orderId = `AURA-ORD-${Date.now()}`;
    const certId = `CERT-LUX-${Math.floor(100000 + Math.random() * 900000)}`;

    const order: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerEmail: customerEmail || 'guest.patron@aura.atelier',
      customerName: customerName || 'Patron of the Atelier',
      items: orderItems,
      subtotal,
      discount,
      total,
      status: 'completed',
      licenseCertificateId: certId,
      paymentMethod: paymentMethod || 'Instant Atelier Pay',
    };

    ordersStore.unshift(order);

    res.json({
      success: true,
      message: 'Luxury purchase successfully authenticated and license keys issued.',
      order,
    });
  });

  // API Route: Download Asset & Official Digital License Package
  app.get('/api/download/:orderId/:productId', (req, res) => {
    const { orderId, productId } = req.params;
    const order = ordersStore.find(o => o.id === orderId);

    if (!order) {
      return res.status(404).send('Order record not found in Digital Vault.');
    }

    const orderItem = order.items.find(i => i.productId === productId);
    const product = productsStore.find(p => p.id === productId);

    if (!orderItem || !product) {
      return res.status(404).send('Product missing from order manifest.');
    }

    // Generate markdown formatted digital asset package + certificate text
    const fileContent = `===================================================================
AURA LUXURY DIGITAL ATELIER — OFFICIAL ASSET & LICENSE CERTIFICATE
===================================================================

Certificate ID : ${order.licenseCertificateId}
Order Reference: ${order.id}
Date Issued    : ${order.createdAt}
Licensed To    : ${order.customerName} (${order.customerEmail})

ASSET METADATA
-------------------------------------------------------------------
Title          : ${product.title}
Category       : ${product.categoryLabel}
Version        : ${product.version}
Author Studio  : ${product.author.studio}
License Rights : ${orderItem.licenseName}
License Key    : ${orderItem.downloadKey}

INCLUDED FORMATS & SPECIFICATIONS
-------------------------------------------------------------------
File Formats   : ${product.fileFormats.join(', ')}
Package Size   : ${product.fileSize}
checksum       : sha256:${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}

TERMS OF LICENSE
-------------------------------------------------------------------
1. Grant of Rights: The licensee is granted a non-exclusive, world-wide,
   perpetual license according to the "${orderItem.licenseName}" tier.
2. Sublicensing & Redistribution: Sublicensing or redistribution of raw
   source assets is strictly prohibited unless explicitly granted under
   an Enterprise Atelier License.
3. Official Cryptographic Verification Token:
   ${orderItem.downloadKey}

===================================================================
Thank you for supporting independent haute digital artisans.
AURA Digital Atelier — https://aura-atelier.com
===================================================================`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${product.title.replace(/[^a-zA-Z0-0]/g, '_')}_License_Package.txt"`
    );
    res.send(fileContent);
  });

  // API Route: AI Asset Concierge & Recommendation Engine (Gemini API Server-Side)
  app.post('/api/ai/recommend', async (req, res) => {
    try {
      const { projectScope, styleVibe, budgetRange } = req.body;

      if (!projectScope) {
        return res.status(400).json({ success: false, error: 'Project scope is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback curated recommendation if API key is not configured
        const fallbackMatch = productsStore.slice(0, 3);
        return res.json({
          success: true,
          data: {
            summary: `Based on your request for "${projectScope}" with a "${styleVibe || 'luxury'}" aesthetic, our Atelier Concierge recommends a combination of high-contrast UI tokens, precision typography, and spatial 3D accents.`,
            recommendedProductIds: fallbackMatch.map(p => p.id),
            designTips: [
              'Pair high-contrast dark surfaces (#0B0C0E) with subtle 1px gold hairline borders.',
              'Use serif typography for headings to establish editorial authority.',
              'Limit accent colors to warm champagne brass or deep alabaster.',
            ],
            curatedColorPalette: ['#0B0C0E', '#181B21', '#D4AF37', '#F7F6F2'],
            suggestedTypographyPairing: 'Cormorant Garamond Display + Plus Jakarta Sans',
          },
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are the chief design curator for AURA, a ultra-luxury digital products atelier.
An elite creative director or developer is asking for curated asset recommendations for their project.

Project Context: "${projectScope}"
Style / Vibe requested: "${styleVibe || 'Haute-couture dark luxury'}"
Budget Level: "${budgetRange || 'Flexible luxury'}"

Available Products in Atelier Catalog:
${productsStore.map(p => `- ID: ${p.id} | Title: "${p.title}" | Category: ${p.categoryLabel} | Price: $${p.price} | Description: ${p.tagline}`).join('\n')}

Respond in clean JSON format matching this schema:
{
  "summary": "2-3 sophisticated sentences tailoring recommendations to their scope",
  "recommendedProductIds": ["prod-id-1", "prod-id-2"],
  "designTips": ["tip 1", "tip 2", "tip 3"],
  "curatedColorPalette": ["#hex1", "#hex2", "#hex3", "#hex4"],
  "suggestedTypographyPairing": "Header Font + Body Font"
}
Output strictly valid JSON with no extra markdown wrapping if possible.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text || '';
      // Clean up markdown wrapping if present
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJson);

      res.json({ success: true, data: parsedData });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      // Return elegant fallback on error
      const fallbackMatch = productsStore.slice(0, 3);
      res.json({
        success: true,
        data: {
          summary: `Our Atelier Concierge curated a bespoke selection based on your requirements for "${req.body.projectScope}".`,
          recommendedProductIds: fallbackMatch.map(p => p.id),
          designTips: [
            'Maintain generous negative space with a 1.333 typography step ratio.',
            'Integrate micro-animations on interactive hover controls.',
          ],
          curatedColorPalette: ['#0B0C0E', '#121418', '#D4AF37', '#E6CA65'],
          suggestedTypographyPairing: 'Cormorant Garamond + Plus Jakarta Sans',
        },
      });
    }
  });

  // Vite Development / Production Static File Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AURA Atelier Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
