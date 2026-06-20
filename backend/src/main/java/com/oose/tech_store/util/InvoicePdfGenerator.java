package com.oose.tech_store.util;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.oose.tech_store.dto.invoice.InvoiceItemResponse;
import com.oose.tech_store.dto.invoice.InvoiceResponse;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

public class InvoicePdfGenerator {

    private static final Color COLOR_PRIMARY = new Color(23, 32, 51);
    private static final Color COLOR_MUTED = new Color(84, 97, 121);
    private static final Color COLOR_BORDER = new Color(230, 233, 239);
    private static final Color COLOR_ACCENT = new Color(37, 99, 235);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private InvoicePdfGenerator() {}

    public static byte[] generate(InvoiceResponse invoice) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4, 48, 48, 56, 56);
            PdfWriter.getInstance(doc, baos);
            doc.open();

            addHeader(doc, invoice);
            addDivider(doc);
            addMetaInfo(doc, invoice);
            addDivider(doc);
            addItemsTable(doc, invoice);
            addDivider(doc);
            addSummary(doc, invoice);

            doc.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate invoice PDF", e);
        }
    }

    private static void addHeader(Document doc, InvoiceResponse invoice) throws DocumentException {
        Font storeFont = new Font(Font.HELVETICA, 22, Font.BOLD, COLOR_PRIMARY);
        Font labelFont = new Font(Font.HELVETICA, 10, Font.NORMAL, COLOR_MUTED);
        Font valueFont = new Font(Font.HELVETICA, 10, Font.BOLD, COLOR_PRIMARY);

        PdfPTable header = new PdfPTable(2);
        header.setWidthPercentage(100);
        header.setSpacingAfter(4);

        PdfPCell storeCell = new PdfPCell();
        storeCell.setBorder(Rectangle.NO_BORDER);
        storeCell.addElement(new Phrase("Tech Store", storeFont));
        storeCell.addElement(new Phrase("Official Invoice", new Font(Font.HELVETICA, 11, Font.NORMAL, COLOR_MUTED)));
        header.addCell(storeCell);

        PdfPCell invoiceIdCell = new PdfPCell();
        invoiceIdCell.setBorder(Rectangle.NO_BORDER);
        invoiceIdCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        invoiceIdCell.addElement(phrase("Invoice ID", labelFont, Element.ALIGN_RIGHT));
        invoiceIdCell.addElement(phrase(invoice.invoiceId(), valueFont, Element.ALIGN_RIGHT));
        invoiceIdCell.addElement(phrase("Issued", labelFont, Element.ALIGN_RIGHT));
        invoiceIdCell.addElement(phrase(
                invoice.issuedAt() != null ? invoice.issuedAt().format(DATE_FMT) : "-",
                valueFont, Element.ALIGN_RIGHT));
        header.addCell(invoiceIdCell);

        doc.add(header);
    }

    private static void addMetaInfo(Document doc, InvoiceResponse invoice) throws DocumentException {
        Font labelFont = new Font(Font.HELVETICA, 9, Font.NORMAL, COLOR_MUTED);
        Font valueFont = new Font(Font.HELVETICA, 10, Font.NORMAL, COLOR_PRIMARY);

        PdfPTable meta = new PdfPTable(4);
        meta.setWidthPercentage(100);
        meta.setSpacingBefore(8);
        meta.setSpacingAfter(4);

        addMetaCell(meta, "Order ID", invoice.orderId(), labelFont, valueFont);
        addMetaCell(meta, "Order Date",
                invoice.orderDate() != null ? invoice.orderDate().format(DATE_FMT) : "-",
                labelFont, valueFont);
        addMetaCell(meta, "Payment Method", invoice.paymentMethod(), labelFont, valueFont);
        addMetaCell(meta, "Order Status", invoice.orderStatus(), labelFont, valueFont);

        doc.add(meta);
    }

    private static void addMetaCell(PdfPTable table, String label, String value,
                                     Font labelFont, Font valueFont) {
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPaddingBottom(4);
        cell.addElement(new Phrase(label, labelFont));
        cell.addElement(new Phrase(value != null ? value : "-", valueFont));
        table.addCell(cell);
    }

    private static void addItemsTable(Document doc, InvoiceResponse invoice) throws DocumentException {
        Font headFont = new Font(Font.HELVETICA, 9, Font.BOLD, Color.WHITE);
        Font bodyFont = new Font(Font.HELVETICA, 9, Font.NORMAL, COLOR_PRIMARY);
        Font subFont = new Font(Font.HELVETICA, 8, Font.ITALIC, COLOR_MUTED);

        float[] widths = {0.35f, 0.18f, 0.12f, 0.12f, 0.12f, 0.11f};
        PdfPTable table = new PdfPTable(widths);
        table.setWidthPercentage(100);
        table.setSpacingBefore(8);
        table.setSpacingAfter(8);

        String[] headers = {"Product", "Variant", "Qty", "Unit Price", "Bundle", "Subtotal"};
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headFont));
            cell.setBackgroundColor(COLOR_PRIMARY);
            cell.setPadding(7);
            cell.setBorderColor(COLOR_PRIMARY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }

        for (InvoiceItemResponse item : invoice.items()) {
            addBodyCell(table, item.productName(), bodyFont, Element.ALIGN_LEFT);
            addBodyCell(table, item.variantDisplay(), bodyFont, Element.ALIGN_LEFT);
            addBodyCell(table, String.valueOf(item.quantity()), bodyFont, Element.ALIGN_CENTER);
            addBodyCell(table, formatMoney(item.unitPrice()), bodyFont, Element.ALIGN_RIGHT);

            PdfPCell bundleCell = new PdfPCell();
            bundleCell.setPadding(7);
            bundleCell.setBorderColor(COLOR_BORDER);
            if (item.bundleServices().isEmpty()) {
                bundleCell.addElement(new Phrase("-", subFont));
            } else {
                BigDecimal bundleTotal = item.bundleServices().stream()
                        .map(InvoiceItemResponse.BundleServiceSummary::price)
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                        .multiply(BigDecimal.valueOf(item.quantity()));
                for (InvoiceItemResponse.BundleServiceSummary bs : item.bundleServices()) {
                    bundleCell.addElement(new Phrase(bs.name(), subFont));
                }
                bundleCell.addElement(new Phrase(formatMoney(bundleTotal), bodyFont));
            }
            table.addCell(bundleCell);

            addBodyCell(table, formatMoney(item.subtotal()), bodyFont, Element.ALIGN_RIGHT);
        }

        doc.add(table);
    }

    private static void addBodyCell(PdfPTable table, String text, Font font, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "-", font));
        cell.setPadding(7);
        cell.setBorderColor(COLOR_BORDER);
        cell.setHorizontalAlignment(alignment);
        table.addCell(cell);
    }

    private static void addSummary(Document doc, InvoiceResponse invoice) throws DocumentException {
        Font labelFont = new Font(Font.HELVETICA, 10, Font.NORMAL, COLOR_MUTED);
        Font valueFont = new Font(Font.HELVETICA, 10, Font.NORMAL, COLOR_PRIMARY);
        Font totalLabelFont = new Font(Font.HELVETICA, 12, Font.BOLD, COLOR_PRIMARY);
        Font totalValueFont = new Font(Font.HELVETICA, 12, Font.BOLD, COLOR_ACCENT);

        PdfPTable summary = new PdfPTable(2);
        summary.setWidthPercentage(45);
        summary.setHorizontalAlignment(Element.ALIGN_RIGHT);
        summary.setSpacingBefore(4);

        addSummaryRow(summary, "Original Amount", formatMoney(invoice.originalAmount()), labelFont, valueFont);
        addSummaryRow(summary, "Discount", "- " + formatMoney(invoice.discountAmount()), labelFont, valueFont);
        addSummaryRow(summary, "VAT", "+ " + formatMoney(invoice.vatAmount()), labelFont, valueFont);
        addSummaryRow(summary, "TOTAL", formatMoney(invoice.finalAmount()), totalLabelFont, totalValueFont);

        doc.add(summary);
    }

    private static void addSummaryRow(PdfPTable table, String label, String value,
                                       Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBorder(Rectangle.TOP);
        labelCell.setBorderColor(COLOR_BORDER);
        labelCell.setPadding(6);
        labelCell.setHorizontalAlignment(Element.ALIGN_LEFT);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, valueFont));
        valueCell.setBorder(Rectangle.TOP);
        valueCell.setBorderColor(COLOR_BORDER);
        valueCell.setPadding(6);
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private static void addDivider(Document doc) throws DocumentException {
        LineSeparator line = new LineSeparator(0.5f, 100, COLOR_BORDER, Element.ALIGN_CENTER, -4);
        doc.add(new Chunk(line));
        doc.add(Chunk.NEWLINE);
    }

    private static Phrase phrase(String text, Font font, int alignment) {
        return new Phrase(text != null ? text : "-", font);
    }

    private static String formatMoney(BigDecimal amount) {
        if (amount == null) return "-";
        return String.format("%,.0f VND", amount);
    }
}
