const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    // Hardcoded JSON data
    const data = {
        name: "John Doe",
        email: "john@example.com",
        items: [
            { name: "Product A", price: 100 },
            { name: "Product B", price: 200 },
        ],
    };

    // Build dynamic table rows
    const itemsRows = data.items
        .map(item => `
      <tr>
        <td>${item.name}</td>
        <td>$${item.price}</td>
      </tr>
    `)
        .join('');

    // Load HTML template from global root folder
    const templatePath = path.join(process.cwd(), 'templates', 'invoice.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders with JSON data
    html = html.replace('{{name}}', data.name)
        .replace('{{email}}', data.email)
        .replace('{{itemsRows}}', itemsRows);

    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // Generate PDF
    await page.pdf({
        path: 'invoice.pdf',  // PDF will be saved in project root
        format: 'A4',
        printBackground: true
    });

    await browser.close();

    console.log('PDF generated: invoice.pdf');
})();
