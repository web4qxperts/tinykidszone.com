importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
workbox.setConfig({ debug: false });
workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.precaching.precacheAndRoute([
    {
        "url": "/",
        "revision": "001"
    },
    {
        "url": "/about-us",
        "revision": "002"
    },
    {
        "url": "/contact-us",
        "revision": "003"
    },
    {
        "url": "/drag-and-drop-activities",
        "revision": "004"
    },
    {
        "url": "/animal-sounds",
        "revision": "005"
    },
    {
        "url": "/crossword-puzzles",
        "revision": "006"
    },
    {
        "url": "/memory-activities",
        "revision": "007"
    },
    {
        "url": "/matching-activities",
        "revision": "008"
    },
    {
        "url": "/coloring-activities",
        "revision": "009"
    }
])