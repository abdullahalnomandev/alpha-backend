import { Promo } from "./promo.model"
import QRCode from "qrcode"
import path from "path"
import fs from "fs"


export const generateQrCode = async (query: Record<string, any>, userId: string) => {
    const qrData = JSON.stringify(query);

    const qrDir = path.join(process.cwd(), "uploads", "qr");
    if (!fs.existsSync(qrDir)) {
        fs.mkdirSync(qrDir, { recursive: true });
    }

    const fileName = `qr_${userId}.png`;
    const filePath = path.join(qrDir, fileName);

    await QRCode.toFile(filePath, qrData, {
        type: "png",
        width: 300,
        errorCorrectionLevel: "H",
    });

    return `/qr/${fileName}`;
}


export const generatePromocode = async () => {
    const lastPromo = await Promo.findOne({ generatePromocode: true })
        .sort({ createdAt: -1 })
        .exec();

    let nextNumber = 1;
    if (lastPromo && lastPromo.promoCode) {
        const match = lastPromo.promoCode.match(/^BG(\d+)$/);
        if (match && match[1]) {
            nextNumber = parseInt(match[1], 10) + 1;
        }
    }

    const paddedNumber = String(nextNumber).padStart(4, '0');
    const newPromoCode = `BG${paddedNumber}`;
    return newPromoCode;
}


