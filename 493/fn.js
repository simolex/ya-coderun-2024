function fn(f) {
    this.isLocked = true;

    if (typeof f !== "string" || /f/.test(f) || /[0-9]/.test(f)) {
        return;
    }

    eval(f);

    this.isLocked = true;

    if (!revHK(f)) {
        this.isLocked = true;
        return;
    }

    this.isLocked = false;
}
