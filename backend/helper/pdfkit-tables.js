// Source Code from
// https://www.andronio.me/2017/09/02/pdfkit-tables/

const PDFDocument = require('pdfkit');

class PDFDocumentWithTables extends PDFDocument {
    constructor (options) {
        super(options);
    }

    table (table, arg0, arg1, arg2, info) {
        let startX = this.page.margins.left, startY = this.y;
        let options = {};

        let pageNum = 1

        if ((typeof arg0 === 'number') && (typeof arg1 === 'number')) {
            startX = arg0;
            startY = arg1;

            if (typeof arg2 === 'object')
                options = arg2;
        } else if (typeof arg0 === 'object') {
            options = arg0;
        }

        const columnCount = table.headers.length;
        const columnSpacing = options.columnSpacing || 15;
        const rowSpacing = options.rowSpacing || 5;
        const usableWidth = options.width || (this.page.width - this.page.margins.left - this.page.margins.right);

        const prepareHeader = options.prepareHeader || (() => {});
        const prepareRow = options.prepareRow || (() => {});
        const computeRowHeight = (row) => {
            let result = 0;

            row.forEach((cell) => {
                const cellHeight = this.heightOfString(cell, {
                    width: columnWidth,
                    align: 'left'
                });
                result = Math.max(result, cellHeight);
            });

            return result + rowSpacing;
        };

        const columnContainerWidth = usableWidth / columnCount;
        const columnWidth = columnContainerWidth - columnSpacing;
        const maxY = this.page.height - this.page.margins.bottom;

        const footerY = maxY - 20

        let rowBottomY = 0;

        this.on('pageAdded', () => {
            startY = this.page.margins.top+50;
            rowBottomY = 0;
            pageNum++
        });

        // Allow the user to override style for headers
        prepareHeader();

        // Print Header for First Page
        this.font("Helvetica")
            .fontSize(10)
            .text("Demand Reciept",55,65)
            .text(`${info.distributorName}`,55,80)
            .fontSize(20)
            .text("Dinesh Auto Spares",100,57,{ align: 'center', width: 400 })
            .fontSize(10)
            .text(`TID: ${info.ticketNumber}`,200,65,{align:'right'})
            .text(`${info.date}`,200,80,{align:'right'})
            .moveDown();

        // Check to have enough room for header and first rows
        if (startY + 3 * computeRowHeight(table.headers) > maxY)
            this.addPage();

        // Print all headers
        table.headers.forEach((header, i) => {
            if(i===table.headers.length-1){
                this.text(header, startX + i * columnContainerWidth, startY, {
                    width: columnWidth,
                    align: 'right'
                });
            }else{
                this.text(header, startX + i * columnContainerWidth, startY, {
                    width: columnWidth,
                    align: 'left'
                });
            }
        });

        // Refresh the y coordinate of the bottom of the headers row
        rowBottomY = Math.max(startY + computeRowHeight(table.headers), rowBottomY);

        // Separation line between headers and rows
        this.moveTo(startX, rowBottomY - rowSpacing * 0.5)
            .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.5)
            .lineWidth(2)
            .stroke();

        table.rows.forEach((row, i) => {
            const rowHeight = computeRowHeight(row);

            // Switch to next page if we cannot go any further because the space is over.
            // For safety, consider 3 rows margin instead of just one
            if (startY + 5 * rowHeight < maxY){
                startY = rowBottomY + rowSpacing;
            }
            else{
                // Print Header and Footer on Page Change
                this.fontSize(10)
                    .text(`${pageNum}`, 
                        70, 
                        footerY-15, 
                        {align:'left', width:500}
                    )
                    .text('This is an auto-generated Demand Reciept. Thank you for your business.',
                        50,
                        footerY-15,
                        { align: 'center', width: 500 },
                    )
                    .text('cont...',
                        50,
                        footerY,
                        { align: 'center', width: 500 },
                    )
                
                this.addPage();

                this.font("Helvetica")
                    .fontSize(10)
                    .text("Demand Reciept",55,65)
                    .text(`${info.distributorName}`,55,80)
                    .fontSize(20)
                    .text("Dinesh Auto Spares",100,57,{ align: 'center', width: 400 })
                    .fontSize(10)
                    .text(`TID: ${info.ticketNumber}`,200,65,{align:'right'})
                    .text(`${info.date}`,200,80,{align:'right'})
                    .moveDown();
            }
            // Allow the user to override style for rows
            prepareRow(row, i);

            // Print all cells of the current row
            row.forEach((cell, i) => {
                if(i===row.length-1){
                    this.text(cell, startX + i * columnContainerWidth, startY, {
                        width: columnWidth,
                        align: 'right'
                    });
                }else{
                    this.text(cell, startX + i * columnContainerWidth, startY, {
                        width: columnWidth,
                        align: 'left'
                    });
                }
            });

            // Refresh the y coordinate of the bottom of this row
            rowBottomY = Math.max(startY + rowHeight, rowBottomY);

            // Separation line between rows
            this.moveTo(startX, rowBottomY - rowSpacing * 0.5)
                .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.5)
                .lineWidth(0.5)
                .opacity(0.7)
                .stroke()
                .opacity(1); // Reset opacity after drawing the line
        });

        this.x = startX;
        this.moveDown();

        this.fontSize(10)
            .text(`${pageNum}`,70,footerY,{align:'left', width:500})
            .text('This is an auto-generated Demand Reciept. Thank you for your business.',
                50,
                footerY,
                { align: 'center', width: 500 },
            )

        return this;
    }
}

module.exports = PDFDocumentWithTables;