import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

import { CartService } from '../cart/cart.service';
import { APIResponse } from '../common/response/response.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class PdfService {

  constructor(
    private readonly cartService: CartService,
    private readonly userService: UserService,

    @InjectQueue("pdf")
    private readonly pdfQueue: Queue
  ) { }

  async createPdf(user: any) {
    const job = await this.pdfQueue.add(
      'process',
      { userId: user.id },
      {
        backoff: { type: 'exponential', delay: 5000 },
        removeOnFail: {
          age: 24 * 60 * 60,
          count: 1000
        },
        removeOnComplete: {
          age: 60 * 60,
          count: 10
        },
      }
    )

    return {
      jobId: job.id
    }
  }

  async fetchCartForPdf(userId: string): Promise<APIResponse> {
    const user = await this.userService.findOne(userId);

    if (!user) throw new NotFoundException({ message: "User not found." });

    const cartItem = await this.cartService.findCart(user.data);

    if (!cartItem) throw new InternalServerErrorException({ message: "Internal Server Error while fetching cart items" });

    return {
      success: true,
      data: cartItem.data,
      expired: false,
      message: "Cart Item fetched successfully",
      statusCode: 200
    }
  }

  async createScreenShot(): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.goto('https://youtube.com', {
      waitUntil: 'networkidle2',
    });

    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true
    });

    await browser.close();

    return Buffer.from(screenshot);
  }
}