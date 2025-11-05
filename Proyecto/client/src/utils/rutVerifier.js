const rutVerifier = (rut) => {
    const dv = rut.slice(-1);
    const body = rut.slice(0, -2);

    try {
        let aux = 2;
        let sum = 0;
        for (let i = body.length - 1; i >= 0; i--) {
            sum += parseInt(body[i]) * aux;

            if (aux === 7) {
                aux = 2;
            } else {
                aux++;
            }
        }

        aux = sum % 11;
        aux = 11 - aux;

        switch (aux) {
            case 10:
                aux = "K";
                break;
            case 11:
                aux = "0";
                break;
            default:
                aux = aux.toString();
        }

        if (aux !== dv) {
            throw Error("dv no coincide");
        }

        return false;
    } catch (err) {
        console.log(err);
        return true;
    }
};

module.exports = {rutVerifier}