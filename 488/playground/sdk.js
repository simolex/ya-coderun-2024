class SDK {
    #changePixelColorCount = 0;
    #changeAreaColorCount = 0;

    constructor(art) {
        this.art = art;
        this.height = art.length;
        this.width = art[0].length;
    }

    initArt(field) {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const color = colors[this.art[row][col]];

                const pixel = document.createElement("div");

                pixel.classList.add("pixel");
                pixel.style.setProperty("background-color", color);
                pixel.style.setProperty("--col", col);
                pixel.style.setProperty("--row", row);

                field.appendChild(pixel);
            }
        }

        this.pixels = field.querySelectorAll(".pixel");
    }

    #changePixelColorBase(col, row, color) {
        const pixel = this.pixels[row * this.width + col];

        pixel.style.setProperty("background-color", color);
    }

    changePixelColor(colLike, rowLike, color) {
        const [col, row] = [Number(colLike), Number(rowLike)];
        this.#changePixelColorCount++;
        if (this.#changePixelColorCount > maxChangePixelColorCalls) {
            throw new Error(
                "Exceeded the maximum number of changePixelColor calls"
            );
        }

        this.#changePixelColorBase(col, row, color);
    }

    changeAreaColor(col1Like, row1Like, col2Like, row2Like, color) {
        this.#changeAreaColorCount++;
        if (this.#changeAreaColorCount > maxChangeAreaColorCalls) {
            throw new Error(
                "Exceeded the maximum number of changeAreaColor calls"
            );
        }
        const [col1, row1] = [Number(col1Like), Number(row1Like)];
        const [col2, row2] = [Number(col2Like), Number(row2Like)];

        if (col1 > col2 || row1 > row2 || (col1 === col2 && row1 === col2)) {
            throw new Error("Incorrect coordinates");
        }
        
        for (let row = row1; row <= row2; row++) {
            for (let col = col1; col <= col2; col++) {
                this.#changePixelColorBase(col, row, color);
            }
        }
    }
}
