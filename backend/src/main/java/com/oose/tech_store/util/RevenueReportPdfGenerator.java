package com.oose.tech_store.util;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.oose.tech_store.dto.report.RevenueReportResponse;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class RevenueReportPdfGenerator {

    private static final Color COLOR_PRIMARY = new Color(23, 32, 51);
    private static final Color COLOR_MUTED = new Color(84, 97, 121);
    private static final Color COLOR_BORDER = new Color(230, 233, 239);
    private static final Color COLOR_ACCENT = new Color(37, 99, 235);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private RevenueReportPdfGenerator() {}

    public static byte[] generate(RevenueReportResponse report, LocalDateTime startDate, LocalDateTime endDate) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4, 48, 48, 56, 56);
            PdfWriter.getInstance(doc, baos);
            doc.open();

            addHeader(doc, startDate, endDate);
            addDivider(doc);
            addSummary(doc, report);
            addDivider(doc);
            addTwoColumnSection(doc, report);
            addDivider(doc);
            addTopProducts(doc, report);
            addDivider(doc);
            addPaymentMethods(doc, report);

            doc.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate revenue report PDF", e);
        }
    }

    private static void addHeader(Document doc, LocalDateTime start, LocalDateTime end) throws DocumentException {
        Font titleFont = new Font(Font.HELVETICA, 22, Font.BOLD, COLOR_PRIMARY);
        Font subFont = new Font(Font.HELVETICA, 10, Font.NORMAL, COLOR_MUTED);

        PdfPTable header = new PdfPTable(2);
        header.setWidthPercentage(100);
        header.setSpacingAfter(4);

        PdfPCell left = new PdfPCell();
        left.setBorder(Rectangle.NO_BORDER);
        left.addElement(new Phrase("Tech Store", titleFont));
        left.addElement(new Phrase("Revenue Report", subFont));
        header.addCell(left);

        String period = (start != null ? start.format(DATE_FMT) : "—")
                + "  →  "
                + (end != null ? end.format(DATE_FMT) : "—");
        PdfPCell right = new PdfPCell();
        right.setBorder(Rectangle.NO_BORDER);
        right.setHorizontalAlignment(Element.ALIGN_RIGHT);
        right.addElement(phrase("Period", subFont, Element.ALIGN_RIGHT));
        right.addElement(phrase(period, new Font(Font.HELVETICA, 9, Font.BOLD, COLOR_PRIMARY), Element.ALIGN_RIGHT));
        header.addCell(right);

        doc.add(header);
    }

    private static void addSummary(Document doc, RevenueReportResponse report) throws DocumentException {
        Font labelFont = new Font(Font.HELVETICA, 10, Font.NORMAL, COLOR_MUTED);
        Font valueFont = new Font(Font.HELVETICA, 14, Font.BOLD, COLOR_ACCENT);

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(60);
        table.setSpacingBefore(6);
        table.setSpacingAfter(6);

        addSummaryCell(table, "Total Revenue", formatMoney(report.totalRevenue()), labelFont, valueFont);
        addSummaryCell(table, "Total Orders", String.valueOf(report.totalOrders()), labelFont, valueFont);

        doc.add(table);
    }

    private static void addSummaryCell(PdfPTable table, String label, String value,
            Font labelFont, Font valueFont) {
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPaddingBottom(8);
        cell.addElement(new Phrase(label, labelFont));
        cell.addElement(new Phrase(value, valueFont));
        table.addCell(cell);
    }

    private static void addTwoColumnSection(Document doc, RevenueReportResponse report) throws DocumentException {
        Font headFont = new Font(Font.HELVETICA, 10, Font.BOLD, COLOR_PRIMARY);
        Font labelFont = new Font(Font.HELVETICA, 9, Font.NORMAL, COLOR_PRIMARY);
        Font moneyFont = new Font(Font.HELVETICA, 9, Font.BOLD, COLOR_ACCENT);

        PdfPTable outer = new PdfPTable(2);
        outer.setWidthPercentage(100);
        outer.setSpacingBefore(8);
        outer.setSpacingAfter(8);

        // Category column
        PdfPCell catCell = new PdfPCell();
        catCell.setBorder(Rectangle.NO_BORDER);
        catCell.addElement(new Phrase("Revenue by Category", headFont));
        catCell.addElement(new Phrase(" ", new Font(Font.HELVETICA, 4)));
        PdfPTable catTable = buildKeyValueTable(
                report.revenueByCategory().stream()
                        .map(i -> new String[]{i.categoryName(), formatMoney(i.revenue())})
                        .toList(),
                labelFont, moneyFont);
        catCell.addElement(catTable);
        outer.addCell(catCell);

        // Brand column
        PdfPCell brandCell = new PdfPCell();
        brandCell.setBorder(Rectangle.NO_BORDER);
        brandCell.addElement(new Phrase("Revenue by Brand", headFont));
        brandCell.addElement(new Phrase(" ", new Font(Font.HELVETICA, 4)));
        PdfPTable brandTable = buildKeyValueTable(
                report.revenueByBrand().stream()
                        .map(i -> new String[]{i.brandName(), formatMoney(i.revenue())})
                        .toList(),
                labelFont, moneyFont);
        brandCell.addElement(brandTable);
        outer.addCell(brandCell);

        doc.add(outer);
    }

    private static PdfPTable buildKeyValueTable(java.util.List<String[]> rows,
            Font labelFont, Font valueFont) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{0.6f, 0.4f});
        for (String[] row : rows) {
            PdfPCell k = new PdfPCell(new Phrase(row[0], labelFont));
            k.setBorderColor(COLOR_BORDER);
            k.setPadding(5);
            PdfPCell v = new PdfPCell(new Phrase(row[1], valueFont));
            v.setBorderColor(COLOR_BORDER);
            v.setPadding(5);
            v.setHorizontalAlignment(Element.ALIGN_RIGHT);
            table.addCell(k);
            table.addCell(v);
        }
        return table;
    }

    private static void addTopProducts(Document doc, RevenueReportResponse report) throws DocumentException {
        Font headFont = new Font(Font.HELVETICA, 10, Font.BOLD, COLOR_PRIMARY);
        Font colFont = new Font(Font.HELVETICA, 9, Font.BOLD, Color.WHITE);
        Font bodyFont = new Font(Font.HELVETICA, 9, Font.NORMAL, COLOR_PRIMARY);
        Font moneyFont = new Font(Font.HELVETICA, 9, Font.BOLD, COLOR_ACCENT);

        doc.add(new Paragraph("Top 5 Best-Selling Products", headFont));

        PdfPTable table = new PdfPTable(new float[]{0.5f, 0.25f, 0.25f});
        table.setWidthPercentage(100);
        table.setSpacingBefore(6);
        table.setSpacingAfter(6);

        for (String col : new String[]{"Product", "Qty Sold", "Revenue"}) {
            PdfPCell cell = new PdfPCell(new Phrase(col, colFont));
            cell.setBackgroundColor(COLOR_PRIMARY);
            cell.setPadding(7);
            cell.setBorderColor(COLOR_PRIMARY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }

        for (RevenueReportResponse.TopProductItem item : report.topProducts()) {
            addBodyCell(table, item.productName(), bodyFont, Element.ALIGN_LEFT);
            addBodyCell(table, String.valueOf(item.totalQuantity()), bodyFont, Element.ALIGN_CENTER);
            addBodyCell(table, formatMoney(item.totalRevenue()), moneyFont, Element.ALIGN_RIGHT);
        }

        doc.add(table);
    }

    private static void addPaymentMethods(Document doc, RevenueReportResponse report) throws DocumentException {
        Font headFont = new Font(Font.HELVETICA, 10, Font.BOLD, COLOR_PRIMARY);
        Font labelFont = new Font(Font.HELVETICA, 9, Font.NORMAL, COLOR_PRIMARY);
        Font moneyFont = new Font(Font.HELVETICA, 9, Font.BOLD, COLOR_ACCENT);

        doc.add(new Paragraph("Revenue by Payment Method", headFont));

        PdfPTable table = buildKeyValueTable(
                report.revenueByPaymentMethod().stream()
                        .map(i -> new String[]{i.paymentMethod(), formatMoney(i.revenue())})
                        .toList(),
                labelFont, moneyFont);
        table.setWidthPercentage(50);
        table.setSpacingBefore(6);
        doc.add(table);
    }

    private static void addBodyCell(PdfPTable table, String text, Font font, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "-", font));
        cell.setPadding(7);
        cell.setBorderColor(COLOR_BORDER);
        cell.setHorizontalAlignment(alignment);
        table.addCell(cell);
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
