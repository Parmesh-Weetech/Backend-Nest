import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

import { CartService } from '../cart/cart.service';

@Injectable()
export class PdfService {

  constructor(private readonly cartService: CartService) { }

  async createPdf(user: any): Promise<Buffer> {
    // Fetch all cart items for the user
    const cartItems = await this.cartService.findCart(user);

    if (!cartItems || cartItems.data.length === 0) {
      throw new Error('No cart items found');
    }

    // Get cart info from the first cartItem (all belong to same cart)
    const cart = cartItems.data[0].cart;

    // Build dynamic table rows
    const itemsRows = cartItems.data
      .map(
        (item: any) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.mealType.join(', ')}</td>
            <td>${item.quantity}</td>
            <td>₹ ${item.price}</td>
            <td>₹ ${item.total_price}</td>
          </tr>
        `
      )
      .join('');

    const totalAmount = cartItems.data.reduce((sum, item) => sum + item.total_price, 0);

    // Load HTML template
    const templatePath = path.join(process.cwd(), 'templates', 'invoice.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders with cart + user data
    html = html.replace('{{cartId}}', cart.id)
      .replace('{{userName}}', cart.user.name)
      .replace('{{userEmail}}', cart.user.email)
      .replace('{{cartStatus}}', cart.status)
      .replace('{{cartCreatedAt}}', new Date(cart.created_at).toLocaleString())
      .replace('{{cartUpdatedAt}}', new Date(cart.updated_at).toLocaleString())
      .replace('{{itemsRows}}', itemsRows)
      .replace('{{totalAmount}}', totalAmount.toString());

    // Launch Puppeteer
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