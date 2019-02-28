window.addEventListener('load', () => {
    // code to register service worker to use methods inside it
    registerSW();
});

async function registerSW() {
    // check if browser supports service worker
    if('serviceWorker' in navigator) {
        try {
            // register service worker
            await navigator.serviceWorker.register('./sw.js');
        } catch(e) {
            // failed to register service worker
            console.log('SW registration failed');
        }
    }
}

// Link this file using <script src="./index.js" type="module"> </script>