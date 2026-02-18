import { Injectable } from '@nestjs/common';
import * as ejs from "ejs";
import * as path from "path";
import * as fs from "fs";
import { ConfigService } from '@nestjs/config';
import axios from "axios";
import { BrowserService } from './browser.service';

@Injectable()
export class PdfService {
    constructor(
        private readonly browserService: BrowserService,
        private readonly configService: ConfigService
    ) { }

    async generatePdf(userId: string, token: string): Promise<string> {
        const MAIN_SERVER_URL = this.configService.get<string>("MAIN_SERVER_URL");
        const secret = this.configService.get<string>("SECRET");

        const response = await axios.get(
            `${MAIN_SERVER_URL}/pdf/internal/${userId}`,
            {
                headers: {
                    'x-internal-secret': secret
                }
            }
        );

        const cartItems = response.data;

        if (!cartItems?.data?.length) {
            throw new Error('No cart items found');
        }

        const cart = cartItems.data[0].cart;
        const totalAmount = cartItems.data.reduce(
            (sum, item) => sum + item.total_price,
            0,
        );

        const templatePath = path.join(
            process.cwd(),
            'templates',
            'cart.ejs',
        );

        const html = await ejs.renderFile(templatePath, {
            cart,
            cartItems,
            totalAmount,
        });

        const browser = await this.browserService.getBrowser();
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: 'domcontentloaded' });


        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        await page.close();

        const filePath = `/home/parmesh/Desktop/Backend-Nest/NestJs/project/pdfs/cart-${userId}-${Date.now()}.pdf`;

        await fs.promises.writeFile(filePath, pdfBuffer);

        return filePath;
    }
}
