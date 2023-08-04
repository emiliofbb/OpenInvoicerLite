const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const currency = require("currency.js");
const { createAddress } = require("./Addressify");

async function invoiceGenerator(app, document) {

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const rest = showSaveDocumentDialog(); 
    let invoiceName = customer.name + dd + mm + yyyy + ".pdf";
    if (rest !== "") {
        invoiceName = rest;
    }

    const htmlString = fs.readFileSync(
        path.join(app.getAppPath(), "./invoices/index.html"),
        "utf-8"
    );

    const $ = cheerio.load(htmlString);

    $("#doc-type").text(docType);

    // Company info insert

    const addressTotal = createAddress(
        companyInfo.address,
        companyInfo.city,
        companyInfo.country
    );
    $("#logo-img").attr("src", `data:image/jgp;base64,${companyInfo.logoBase64}`);
    $("#company-name").text(companyInfo.name);
    $("#company-address").append(addressTotal);
    $("#company-tel").text(companyInfo.phone);
    $("#company-mail").text(companyInfo.email);
    $("#company-mail").attr("href", "mailto:" + companyInfo.email);

    //Customer info insert
    const finalCustomerAddress = createAddress(
        customer.address,
        customer.city,
        customer.country
    );
    $("#client-name").append("<span>CLIENTE:</span> " + customer.name);
    $("#client-address").append(
        "<span>DIRECCIÓN:</span> " + finalCustomerAddress
    );
    $("#emision-date").append(
        "<span>FECHA:</span> " + dd + "/" + mm + "/" + yyyy
    );

    const currencyOptions = { symbol: "€", decimal: ",", separator: "." };

    var subtotal = currency(0, currencyOptions);

    //PRODS info insert
    products.forEach((prod, i) => {
        const unitPrice = currency(prod.price, currencyOptions);
        const prodPrice = unitPrice.multiply(prod.quantity);
        subtotal = subtotal.add(prodPrice);
        const row = `<tr>
            <td class="service">${i}</td>
            <td class="desc">
            ${prod.description}
            </td>
            <td class="unit">${unitPrice.format()}</td>
            <td class="qty">${prod.quantity}</td>
            <td class="total">${prodPrice.format()}</td>
            </tr>`;
        $("#row-nt").before(row);
    });

    const taxValue = subtotal.multiply(0.21);
    $("#total-no-tax").text(subtotal.format());
    $("#tax-val").text(taxValue.format());
    $("#total-final").text(subtotal.add(taxValue).format());

    await createPDF($.html(), invoiceName);
}

async function showSaveDocumentDialog() {
    return await dialog
        .showSaveDialog({
            title: "Guardado",
            filters: [{ name: "Document", extensions: ["pdf"] }],
        })
        .then((result) => {
            if (result.filePath.length === 0 || result.canceled) {
                return "";
            } else {
                return result.filePath;
            }
        });
}

async function createPDF(html, path) {
    // Create a browser instance
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    //Get HTML content from HTML
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType("screen");

    // Downlaod the PDF
    const pdf = await page.pdf({
        path: path,
        margin: { top: "10px", right: "50px", bottom: "10px", left: "50px" },
        printBackground: true,
        format: "A4",
    });

    // Close the browser instance
    await browser.close();
}

exports.invoiceGenerator = invoiceGenerator;
