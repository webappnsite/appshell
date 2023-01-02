/* Copyright (c) appsite.web.id */

function initAlert(message) {
    window.alert(JSON.stringify(message, null, 2))
}

function initApp() {
    initHeaderScroll(window.scrollY)
    initNavOpen()
    initShare()
    initWindowOnScroll()
}

function initClipboardWriteText(clipText, info = "Copied to clipboard.") {
    if ("clipboard" in navigator) {
        navigator.clipboard.writeText(clipText)
        .then(() => initAlert(info))
        .catch(initError)
    }
    else {
        initAlert("The <dialog> API is not supported by this browser.")
    }
}

function initError(error) {
    console.error(error)
}

function initHeaderScroll(value) {
    document
    .querySelector("header.web")
    .classList[value ? "add" : "remove"]
    ("scrolled")
}

function initNavOpen() {
    const button = document.querySelector("button.open-nav")
    button.disabled = false

    const elem = document.querySelector("nav.web")

    button.onclick = () => {
        elem.classList.add("open")
    }

    elem.onclick = (event) => {
        if (event.target == event.currentTarget
        || event.target.href) {
            event.currentTarget.classList.remove("open")
        }
    }
}

function initShare() {
    const button = document.querySelector("button.share")
    button.disabled = false
    button.onclick = () => {
        if ("share" in navigator) {
            navigator.share({
                "text": document.querySelector("meta[name=description]").content,
                "title": document.title,
                "url": document.URL
            })
            .catch(initError)
        }
        else {
            initClipboardWriteText(
                document.URL,
                "The URL has been copied. Please share."
            )
        }
    }
}

function initWindowOnScroll() {
    let windowScrollY = 0
    let ticking = false

    window.onscroll = () => {
        windowScrollY = window.scrollY

        if (!ticking) {
            window.requestAnimationFrame(() => {
                initHeaderScroll(windowScrollY)
                ticking = false
            })

            ticking = true
        }
    }
}

window.onload = () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js")
        .catch(initError)
        .finally(initApp)
    }
    else {
        initApp()
    }
}
