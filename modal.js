class Modal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open'});
        this.isOpen = false;
        this.shadowRoot.innerHTML = `
            <style>
                #backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: rgba(0,0,0,0.75);
                    z-index: 10;
                    opacity: 0;
                    pointer-events: none;
                }

                :host([opened]) #backdrop,
                :host([opened]) #modal {
                    opacity: 1;
                    pointer-events: all;
                }

                #modal {
                    z-index: 100;
                    position: fixed;
                    top: 15vh;
                    left: 25%;
                    width: 50%;
                    height: 30rem;
                    background: white;
                    border-radius: 3px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.26);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    opacity: 0;
                    pointer-events: none;
                }

                header {
                    padding: 1rem;
                }

                ::slotted(h1) {
                    font-size: 1.25rem;
                }

                #main {
                    padding: 1rem;
                }

                #actions {
                    border-top: 1px solid #ccc;
                    padding: 1rem;
                    display: flex;
                    justify-content: flex-end;
                }

                #actions button {
                    margin: 0 0.25rem;
                }
            </style>
            <div id="backdrop"></div>
            <div id="modal">
                <header>
                    <slot name="title">Please Confirm Payment</slot>
                </header>
                <section id="main">
                    <slot></slot>
                </section>
                <section id="actions">
                    <button id="cancel-btn">Cancel</button>
                    <button id="confirm-btn">Okay</button>
                </section>
            </div>
        `;
        const slots = this.shadowRoot.querySelectorAll('slot');

        slots[1].addEventListener('slotchange', event => {
            console.dir([slots[1]]);
        });
        const cancelButton = this.shadowRoot.querySelector('#cancel-btn');
        const confirmButton = this.shadowRoot.querySelector('#confirm-btn');

        cancelButton.addEventListener('click', this._cancel.bind(this));
        confirmButton.addEventListener('click', this._confirm.bind(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.isOpen = this.hasAttribute('opened');
        // First approach to show modal
        // if (name === 'opened') {
        //     if (this.hasAttribute('opened')) {
        //         this.shadowRoot.querySelector('#backdrop').style.opacity = 1;
        //         this.shadowRoot.querySelector('#backdrop').style.pointerEvents = 'all';
        //         this.shadowRoot.querySelector('#modal').style.opacity = 1;
        //         this.shadowRoot.querySelector('#modal').style.pointerEvents = 'all';
        //     }
        // }
    }

    static get observedAttributes() {
        return ['opened'];
    }

    open() {
        this.setAttribute('opened', '');
        this.isOpen = true;
    }

    hide() {
        if (this.isOpen) {
            this.removeAttribute('opened');
        }

        this.isOpen = false;
    }

    _cancel(event) {
        this.hide();
        event.target.dispatchEvent(new Event('cancel', { bubbles: true, composed: true }));
    }

    _confirm() {
        this.hide();
        this.dispatchEvent(new Event('confirm'))
    }
}

customElements.define('uc-modal', Modal);