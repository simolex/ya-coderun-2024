function setCSS(element, styles, unit = "px") {
    for (const key in styles) {
        element.style.setProperty(key, `${styles[key]}${unit}`);
    }
}

const app = document.getElementById("app");

export class TransmitterPresenter {
    raysContainer = null;
    raysContainerStyles = {};

    constructor() {

        this.buildTransmitterPresenter();
    }

    buildTransmitterPresenter() {
        const transmittersContainer = document.querySelector(
            ".transmitters-container"
        );
        const transmitter = document.createElement("div");

        transmitter.classList.add("transmitter");
        transmittersContainer.appendChild(transmitter);
        this.transmitter = transmitter;

        window.requestAnimationFrame(() => {
            this.landRect = document.querySelector(".land").getBoundingClientRect();
            this.transmitterBoundRect =
                this.transmitter.getBoundingClientRect();
            this.buildRaysContainer();
        });
    }

    buildRaysContainer() {
        const raysContainer = document.createElement("div");

        raysContainer.classList.add("transmitter-rays-container");
        app.appendChild(raysContainer);
        this.raysContainer = raysContainer;

        this.buildRaysContainerStyles();
    }

    buildRaysContainerStyles() {
        const top =
            Math.min(this.landRect.top, this.transmitterBoundRect.top) +
            this.transmitterBoundRect.height / 2;
        const left =
            Math.min(this.landRect.left, this.transmitterBoundRect.left) +
            this.landRect.width / 2;
        const right =
            window.innerWidth -
            Math.max(this.landRect.right, this.transmitterBoundRect.right) +
            this.transmitterBoundRect.width / 2;
        const bottom =
            window.innerHeight -
            Math.max(this.landRect.bottom, this.transmitterBoundRect.bottom) +
            this.landRect.height / 2;
        const height = window.innerHeight - (top + bottom);
        const width = window.innerWidth - (left + right);

        this.raysContainerStyles = {
            top,
            left,
            height,
            width,
        };

        setCSS(this.raysContainer, this.raysContainerStyles);
    }

    sendRay(rayType = "long") {
        const ray = document.createElement("div");

        ray.classList.add("ray", rayType);
        ray.style.setProperty(
            "transform",
            `rotate(atan(-${this.raysContainerStyles.height} / ${this.raysContainerStyles.width}))`
        );

        this.raysContainer.appendChild(ray);
    }
}
