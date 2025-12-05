
// ================= TAILLES PAR CATÉGORIE =================
export const getDefaultSizes = (categoryName: string) => {
    const name = categoryName.toLowerCase();

    if (name.includes("vêtements") || name.includes("vetements") || name.includes("mode") || name.includes("fashion") || name.includes("habillement")) {
        return ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
    }
    if (name.includes("chaussures") || name.includes("shoes") || name.includes("footwear")) {
        return ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];
    }
    if (name.includes("technologie") || name.includes("tech") || name.includes("électronique") || name.includes("electronique")) {
        return ["Standard"];
    }
    if (name.includes("livres") || name.includes("books") || name.includes("bibliothèque")) {
        return ["Format unique"];
    }
    if (name.includes("meuble") || name.includes("furniture") || name.includes("décoration") || name.includes("decoration")) {
        return ["Unique"];
    }
    if (name.includes("sport") || name.includes("fitness") || name.includes("athlétique")) {
        return ["S", "M", "L", "XL", "XXL"];
    }
    if (name.includes("bijoux") || name.includes("joaillerie") || name.includes("jewelry")) {
        return ["Unique", "Adjustable"];
    }
    if (name.includes("cosmétiques") || name.includes("cosmetiques") || name.includes("beauté") || name.includes("beaute")) {
        return ["50ml", "100ml", "200ml", "500ml"];
    }

    return ["Unique"];
};
