const applicationServerPublicKey = 'BCx1qqSFCJBRGZzPaFa8AbvjxtuJj9zJie_pXom2HI-gisHUUnlAFzrkb-W1_IisYnTcUXHmc5Ie3F58M1uYhZU';

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function subscribeUser(swReg) {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swReg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log(JSON.stringify(subscription));
  })
  .catch(function(err) {
    console.log('订阅失败: ', err);
  });
}


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function (swReg) {
    swReg.pushManager.getSubscription()
      .then(function(subscription) {
        if (subscription) {
          console.log(JSON.stringify(subscription));
        } else {
          console.log('没有订阅');
          subscribeUser(swReg);
        }
      });
  });
}