const puppeteer = require('puppeteer');
function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1100);
    });
}

(async () => {
    
    //lancement de la page
    const browser = await puppeteer.launch({
        headless: false,
        args:['--start-fullscreen']
    });
    const page = await browser.newPage();
    await page.setViewport({width:600, height:600});
    await page.goto("https://chromedino.com/", {
        waitUntil: 'networkidle2',
    });


    // Coordonnées du pixel que vous souhaitez vérifier (par exemple, x = 100, y = 200)
    const x = 100;
    const y = 200;

    // Utiliser page.evaluate pour extraire la couleur du pixel
    const color = await page.evaluate((x, y) => {
        // Obtenir le contexte du canevas HTML5 à partir de la page
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1;
        canvas.height = 1;

        // Dessiner un pixel à partir des coordonnées spécifiées
        ctx.drawImage(document.querySelector('img'), x, y, 1, 1, 0, 0, 1, 1);

        // Extraire la couleur du pixel
        const pixelData = ctx.getImageData(0, 0, 1, 1).data;
        return `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`;
    }, x, y);

    // Afficher la couleur du pixel
    console.log(`La couleur du pixel à (${x}, ${y}) est : ${color}`);

    // Fermer le navigateur Puppeteer
    await delay(3)
    //validation des cookies
    await page.click('[class = "fc-button-label"]')
    //changement de couleur (OBLIGATOIRE!!!!)
    await page.goto('https://chromedino.com/black/')
    await delay(10)
    await page.keyboard.press('Space')
    await page.keyboard.down('Space')

    await delay(30)
    await browser.close();
})();
