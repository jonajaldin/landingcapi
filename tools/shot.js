const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const p = await b.newPage({ viewport: vp, deviceScaleFactor: 2 });
    await p.goto('file:///home/user/landingcapi/index.html');
    await p.waitForTimeout(2600);
    await p.screenshot({ path: `/home/user/landingcapi/tools/shot-${name}.png` });
    await p.close();
  }
  await b.close();
  console.log('ok');
})();
