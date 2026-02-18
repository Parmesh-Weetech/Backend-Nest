import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class BrowserService implements OnModuleInit, OnModuleDestroy {
    private browser: puppeteer.Browser | null = null;

    async onModuleInit() {
        await this.launchBrowser();
    }

    async onModuleDestroy() {
        await this.closeBrowser();
    }

    async launchBrowser() {
        // Close existing browser if any
        if (this.browser) {
            await this.browser.close();
        }

        // Launch a new browser instance
        this.browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        console.log('Puppeteer browser launched');
    }

    async getBrowser(): Promise<puppeteer.Browser> {
        // If browser is null, relaunch
        if (!this.browser) {
            await this.launchBrowser();
        }

        // At this point, browser is definitely not null
        return this.browser!;
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            console.log('Puppeteer browser closed');
            this.browser = null;
        }
    }
}
