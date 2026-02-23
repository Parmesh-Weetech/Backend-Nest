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
        id: string,
        subUrl: string,
        mainUrl: string
        url: string,
    }>): Promise<any> {
        const { id, subUrl, mainUrl, url, } = job.data;

        const MAIN_SERVER_URL = this.configService.get<string>("MAIN_SERVER_URL");
        const secret = this.configService.get<string>("SECRET");

        let page;

        try {

            const browser = await this.browserService.getBrowser();

            page = await browser.newPage();

            await page.setUserAgent(
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
            );

            const response = await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 30000,
            });

            const currentUrl = response?.url();
            if (!this.isValidUrl(currentUrl, mainUrl)) {
                console.log(`Blocked URL: ${currentUrl}`);
                await axios.put(
                    `${MAIN_SERVER_URL}/web-scraping/${id}`,
                    {
                        subUrl: subUrl,
                        mainUrl: mainUrl,
                        url: url,
                        status: "SKIPPED"
                    },
                    {
                        headers: {
                            'x-internal-secret': secret
                        }
                    }
                )
                return;
            }

            const pageData = await page.evaluate(() => {
                return {
                    title: document.title,
                    metaDescription:
                        document.querySelector('meta[name="description"]')
                            ?.getAttribute('content') || '',
                    h1: Array.from(document.querySelectorAll('h1')).map(h => h.innerText),
                    text: document.body.innerText,
                };
            });

            if (this.blockedPatterns.some(pattern => page.url().includes(pattern))) {
                await axios.put(
                    `${MAIN_SERVER_URL}/web-scraping/${id}`,
                    {
                        subUrl: subUrl,
                        mainUrl: mainUrl,
                        url: url,
                        status: "SKIPPED"
                    },
                    {
                        headers: {
                            'x-internal-secret': secret
                        }
                    }
                )

                return;
            }

            const status = response?.status();
            if (status === 401 || status === 403) {
                await axios.put(
                    `${MAIN_SERVER_URL}/web-scraping/${id}`,
                    {
                        subUrl: subUrl,
                        mainUrl: mainUrl,
                        url: url,
                        status: "SKIPPED"
                    },
                    {
                        headers: {
                            'x-internal-secret': secret
                        }
                    }
                )
                return;
            }

            const links = await this.extractLinks(page, mainUrl);
            let count = 0;

            for (const link of links) {
                const parsed = new URL(link);
                let newSubUrl = parsed.pathname || '/';
                
                if (newSubUrl !== '/' && newSubUrl.endsWith('/')) {
                    newSubUrl = newSubUrl.slice(0, -1);
                }
                
                if (newSubUrl === subUrl) {
                    continue;
                }

                const response = await axios.get(
                    `${MAIN_SERVER_URL}/web-scraping?mainUrl=${mainUrl}&subUrl=${newSubUrl}`,
                    {
                        headers: {
                            "x-internal-secret": secret
                        }
                    }
                );

                console.log(response.data.data);

                if(!response.data.data || response.data.data === null) {
                    count++;
                    console.log(count);

                    await axios.post(
                        `${MAIN_SERVER_URL}/web-scraping/add`,
                        {
                            newSubUrl: newSubUrl,
                            mainUrl: mainUrl,
                            link: url
                        },
                        {
                            headers: {
                                "x-internal-secret": secret
                            }
                        }
                    )
                } else {
                    console.log("continue");
                    continue;
                }
            }

            await axios.put(
                `${MAIN_SERVER_URL}/web-scraping/${id}`,
                {
                    subUrl: subUrl,
                    mainUrl: mainUrl,
                    url: url,
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
            console.log(error.message);

            await axios.put(
                `${MAIN_SERVER_URL}/web-scraping/${id}`,
                {
                    subUrl: subUrl,
                    mainUrl: mainUrl,
                    url: url,
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
        try {
            const parsedUrl = new URL(url);
            const parsedMain = new URL(mainUrl);

            if (parsedUrl.host !== parsedMain.host) return false;

            if (this.blockedPatterns.some(pattern => url.includes(pattern))) {
                return false;
            }

            return true;
        } catch {
            return false;
        }
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