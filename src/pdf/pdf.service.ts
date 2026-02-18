import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as ejs from 'ejs';

import { CartService } from '../cart/cart.service';

@Injectable()
export class PdfService {

  constructor(private readonly cartService: CartService) { }

  async createPdf(user: any): Promise<Buffer> {
    // Fetch all cart items
    const cartItems = await this.cartService.findCart(user);
    if (!cartItems || cartItems.data.length === 0) throw new Error('No cart items found');

    const cart = cartItems.data[0].cart;

    // Calculate total amount
    const totalAmount = cartItems.data.reduce((sum, item) => sum + item.total_price, 0);

    // Path to EJS template
    const templatePath = path.join(process.cwd(), 'templates', 'cart.ejs');

    // Render HTML from EJS
    const html = await ejs.renderFile(templatePath, { cart, cartItems, totalAmount });

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }

  async createScreenShot(): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // good for production
    });

    const page = await browser.newPage();

    await page.goto('https://youtube.com', {
      waitUntil: 'networkidle2',
    });

    const screenshot = await page.screenshot({
      type: 'jpeg',
      fullPage: true,
      quality: 100
    });

    await browser.close();

    return Buffer.from(screenshot);
  }
}