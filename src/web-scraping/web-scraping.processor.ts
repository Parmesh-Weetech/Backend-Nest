import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { BrowserService } from "../pdf/browser.service";
import axios from "axios";
import { ConfigService } from "@nestjs/config";

@Processor("web-scraping", { concurrency: 3 })
export class WebScrapingProcessor extends WorkerHost {
    constructor(
        private readonly browserService: BrowserService,
        private readonly configService: ConfigService,
    ) { 
        super();
    }

    private blockedPatterns = [
        '/login',
        '/signup',
        '/refresh-token',
        '/update-password',
        '/reset-password',
        '/admin',
        "/password",
        "/token"
    ];

    async process(job: Job<{
        jobId: string,
        url: string,
        mainUrl: string
    }>): Promise<any> {
        const { jobId, url, mainUrl } = job.data;

        const MAIN_SERVER_URL = this.configService.get<string>("MAIN_SERVER_URL");
        const secret = this.configService.get<string>("SECRET");

        let page;

        try {

            const browser = await this.browserService.getBrowser();

            page = await browser.newPage();

            await page.setUserAgent(
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
            );

            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 30000,
            });

            const currentUrl = page.url();
            if (!this.isValidUrl(currentUrl, mainUrl)) {
                console.log(`Blocked URL: ${currentUrl}`);
                await axios.put(
                    `${MAIN_SERVER_URL}/web-scraping`,
                    {
                        jobId: jobId,
                        url: url,
                        mainUrl: mainUrl,
                        status: "SKIPPED"
                    },
                    {
                        headers: {
                            'x-internal-secret': secret
                        }
                    }
                )
            }

            if (this.blockedPatterns.some(pattern => page.url().includes(pattern))) {
                await axios.put(
                    `${MAIN_SERVER_URL}/web-scraping`,
                    {
                        jobId: jobId,
                        url: url,
                        mainUrl: mainUrl,
                        status: "SKIPPED"
                    },
                    {
                        headers: {
                            'x-internal-secret': secret
                        }
                    }
                )
            }

            const status = page.response()?.status();
            if (status === 401 || status === 403) {
                await axios.put(
                    `${MAIN_SERVER_URL}/web-scraping`,
                    {
                        jobId: jobId,
                        url: url,
                        mainUrl: mainUrl,
                        status: "SKIPPED"
                    },
                    {
                        headers: {
                            'x-internal-secret': secret
                        }
                    }
                )
            }

            const html = await page.content();

            const links = await this.extractLinks(page, mainUrl);

            console.log(links);

            await axios.put(
                `${MAIN_SERVER_URL}/web-scraping`,
                {
                    jobId: jobId,
                    url: url,
                    mainUrl: mainUrl,
                    status: "DONE"
                },
                {
                    headers: {
                        'x-internal-secret': secret
                    }
                }
            )
        } catch (error) {
            console.log(`Scrape failed for ${url}`, error);

            await axios.put(
                `${MAIN_SERVER_URL}/web-scraping`,
                {
                    jobId: jobId,
                    url: url,
                    mainUrl: mainUrl,
                    status: "FAILED"
                },
                {
                    headers: {
                        'x-internal-secret': secret
                    }
                }
            )
        } finally {
            if (page) {
                await page.close();
            }
        }
    }

    private isValidUrl(url: string, mainUrl: string): boolean {
        if (!url.startsWith(mainUrl)) return false;

        if (this.blockedPatterns.some(pattern => url.includes(pattern))) {
            return false;
        }

        return true;
    }

    private async extractLinks(
        page: any,
        mainUrl: string,
    ): Promise<string[]> {
        const links: string[] = await page.$$eval('a', anchors =>
            anchors
                .map(a => a.getAttribute('href'))
                .filter(Boolean),
        );

        const normalized = links
            .map(link => {
                if (link.startsWith('/')) {
                    return mainUrl + link;
                }
                return link;
            })
            .filter(link => this.isValidUrl(link, mainUrl));

        return [...new Set(normalized)];
    }
}