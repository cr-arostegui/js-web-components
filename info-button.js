class InfoButton extends HTMLElement {
    constructor() {
        super();
        console.log('Info btn')
        this._bannerContainer;
        this._bannerText = 'No text provided';
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .banner-info {
                    background-color: black;
                    color: white;
                }
            </style>
            <button><slot>Display</slot></button>
        `;
    }

    connectedCallback() {
        if (this.hasAttribute('banner-text')) {
            this._bannerText = this.getAttribute('banner-text');
        }

        const button = this.shadowRoot.querySelector('button');
        button.addEventListener('click', this.toggleBanner.bind(this));
        this.shadowRoot.appendChild(button);
    }

    toggleBanner() {
        const bannerInfo = this.shadowRoot.querySelector('.banner-info');
        if (bannerInfo) {
            this.shadowRoot.removeChild(bannerInfo);
            return;
        }

        this._bannerContainer = document.createElement('div');
        this._bannerContainer.className = 'banner-info';
        this._bannerContainer.textContent = this._bannerText;
        this.shadowRoot.appendChild(this._bannerContainer);
    }
}

customElements.define('uc-info-button', InfoButton);