import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

export const generatePDF = (res, entries, title) => {

    const doc = new PDFDocument({ margin: 30 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${title}.pdf`);

    doc.pipe(res);

    doc.fontSize(18).text(title, { align: "center" });
    doc.moveDown();

    entries.forEach(e => {

        doc.fontSize(11).text(
            `${e.party?.name || "-"} | ${e.type} | ₹${e.amount} | ${e.reference} | ${e.note || "-"} | ${new Date(e.date).toLocaleDateString()}`
        );

    });

    doc.end();
};


export const generateExcel = async (res, entries, title) => {

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(title);

    sheet.columns = [
        { header: "Party", key: "party", width: 25 },
        { header: "Type", key: "type", width: 10 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Reference", key: "reference", width: 15 },
        { header: "Note", key: "note", width: 35 },
        { header: "Date", key: "date", width: 20 }
    ];

    entries.forEach(e => {

        sheet.addRow({
            party: e.party?.name || "-",
            type: e.type,
            amount: e.amount,
            reference: e.reference,
            note: e.note || "-",
            date: new Date(e.date).toLocaleDateString()
        });

    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${title}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

};