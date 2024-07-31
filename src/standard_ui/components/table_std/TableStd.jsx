import React from "react";
import PropTypes from 'prop-types';

import TextStd from '../text_std/TextStd';
import utils from '../../utils';

/*
* A component that displays data in a tabular structure.

* Props:
    > prRowHeader: the header row (an array of strings).
    > prRowsContent: the content rows (an array of an array of strings). Each row should be have the same length as prRowHeader.
    > prData: an object which contains all of the table's data and the order of the columns. If prData is defined, 
      prRowHeader and prRowsContent are ignored.
        e.g. 
        {
            orderColumns: [ "colA", "colC", "colB" ],
            header: { colA: "A", colC: "C", colB: "B" },
            content:
            {
                orderRows: [ "rowA", "rowC", "rowB" ],
                rows:
                {
                    rowA: { colA: "1", colC: "2", colB: "3" },
                    rowC: { colA: "2", colC: "3", colB: "4" },
                    rowB: { colA: "5", colC: "6", colB: "7" }
                }
            }
        }
    > prBorders: an array of four booleans which determine whether each of the outside borders are displayed. The order 
      from index 0 is top, right, bottom, and left (e.g. if prBorders[1] is false, this means that the right border 
      won't be displayed).
*/
function TableStd({ prRowHeader, prRowsContent, prData, prBorders, prBorderSize, prBorderColour, prStyles, prTheme })
{
    // The header row.
    let lRowHeader = [];
    if (prData)
    {
        for (const lColumn of prData.orderColumns)
        {
            lRowHeader.push(prData.header[lColumn]);
        }
    }
    else
    {
        lRowHeader = prRowHeader;
    }

    // The dimensions of the table.
    let lNumColumns;
    let lNumRows;
    if (prData)
    {
        lNumColumns = prData.orderColumns.length;
        lNumRows = Object.keys(prData.content.rows).length;
    }
    else
    {
        lNumColumns = prRowHeader.length;
        lNumRows = prRowsContent.length;
    }

    // The content rows.
    let lRows;

    if (prData)
    {
        lRows = [];
        for (const lRow of prData.content.orderRows)
        {
            const lRowTemp = [];
            for (const lColumn of prData.orderColumns)
            {
                lRowTemp.push(prData.content.rows[lRow][lColumn]);
            }

            lRows.push(lRowTemp);
        }
    }
    else
    {
        lRows = Array(prRowsContent.length);
        for (let i = 0; i < lRows.length; ++i)
        {
            lRows[i] = utils.padEndArray(prRowsContent[i], lNumColumns, "-");
        }
    }

    // Border styling.
    const lBorder = `${prBorderSize}px solid ${prBorderColour ? prBorderColour : prTheme.border}`;

    return (
        <div
            className = "hideScrollBar"
            style = {{ 
                backgroundColor: prTheme.background,
                ...styles.table, 
                ...prStyles?.con 
            }}
        >
            {
                lRowHeader.map(
                    (pHeading, pIndexCol) =>
                    {
                        const lBorderRight = ((pIndexCol != lNumColumns - 1) || prBorders[1]) ? lBorder : undefined;
                        const lBorderLeft = (pIndexCol == 0 && prBorders[3]) ? lBorder : undefined;

                        return (
                            <div 
                                key = { pIndexCol }
                                style = {{ 
                                    ...styles.column, ...prStyles?.column, 
                                    //borderRight: (pIndexCol == lNumColumns - 1) ? lBorder : undefined 
                                }}
                            >
                                <TextStd 
                                    prText = { pHeading } prIsBold
                                    prStyle = {{ 
                                        ...styles.cell, ...styles.cellHeader, 
                                        backgroundColor: prTheme.backgroundHeaderCell,
                                        borderRight: lBorderRight, borderLeft: lBorderLeft, 
                                        borderTop: prBorders[0] ? lBorder : undefined, 
                                        ...prStyles?.cellHeader, ...prStyles?.text,
                                    }}
                                />
                                {
                                    Array(lNumRows).fill(undefined).map(
                                        (pIDC, pIndexRow) =>
                                        {
                                            let lText = lRows[pIndexRow][pIndexCol];

                                            if (!lText || lText.length == 0)
                                                lText = "-";

                                            return (
                                                <TextStd 
                                                    key = { pIndexRow }
                                                    prText = { lText }
                                                    prStyle = {{ 
                                                        ...styles.cell, ...styles.cellContent, 
                                                        backgroundColor: prTheme.backgroundContentCell,
                                                        borderTop: lBorder, borderRight: lBorderRight,
                                                        borderLeft: lBorderLeft, borderBottom: ((pIndexRow == lNumRows - 1) && prBorders[2]) ? lBorder : undefined,
                                                        ...prStyles?.text, ...prStyles?.cellContent,
                                                    }} 
                                                />
                                            );
                                        }
                                    )
                                }
                            </div>
                        )
                    }
                )
            }

        </div>
    );
}

TableStd.propTypes =
{
    prRowHeader: PropTypes.oneOfType(
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.arrayOf(PropTypes.number)
    ),
    prRowsContent: PropTypes.arrayOf(
        PropTypes.oneOfType(
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.arrayOf(PropTypes.number)
        ),
    ),
    prData: PropTypes.shape({
        orderColumns: PropTypes.arrayOf(PropTypes.string),
        header: PropTypes.object,
        content: PropTypes.shape({
            orderRows: PropTypes.arrayOf(PropTypes.string),
            rows: PropTypes.object
        })
    }),
    prSizeText: PropTypes.number,
    prBorders: PropTypes.arrayOf(PropTypes.bool),
    prBorderSize: PropTypes.number,
    prBorderColour: PropTypes.string,
    prStyles: PropTypes.shape(
        {
            con: PropTypes.object,
            column: PropTypes.object,
            cellHeader: PropTypes.object,
            cellContent: PropTypes.object,
            text: PropTypes.object,
        }
    ),
    prTheme: PropTypes.shape(
        {
            background: PropTypes.string.isRequired,
            backgroundColorHeaderCell: PropTypes.string.isRequired,
            backgroundColorContentCell: PropTypes.string.isRequired,
            border: PropTypes.string.isRequired,
        }
    )
};

TableStd.defaultProps =
{
    prSizeText: 0,
    prBorders: [ true, true, true, true ],
    prBorderSize: 1,
    prTheme: 
    {
        backgroundColor: "transparent",
        backgroundColorHeaderCell: "#000000",
        backgroundColorContentCell: "transparent",
        borderColor: "#FAFAFA",
    },
}

const styles =
{
    table:
    {
        flexDirection: "row",
        //justifyContent: "center",
        overflowX: "scroll",
    },
    column:
    {
        flexShrink: 0,
        flexDirection: "column",
        //paddingLeft: 5, 
        //paddingRight: 5, 
    },
    cell:
    {
        padding: 5,
        lineHeight: 1
    },
    cellHeader:
    {
        //padding: 10,
        textAlign: "center"
    },
    cellContent:
    {
        //padding: 5,
        //textAlign: "center"
    }
};

/*
* Returns the height of a table with default styling for the given parameters.

* Parameters:
    >
*/
function defaultTableHeight(pNumRows, pSizeText, pBorders, pBorderSize = 2)
{
    let lPadding = styles.cell.padding;
    let lHeightPadding = pNumRows * 2 * lPadding;

    let lHeightBorders = pBorderSize * (pNumRows - 1);
    if (pBorders[0])
        lHeightBorders += pBorderSize;
    if (pBorders[2])
        lHeightBorders += pBorderSize;

    let lHeightText = pNumRows * pSizeText;

    return lHeightPadding + lHeightBorders + lHeightText;
}

export { TableStd as default, defaultTableHeight };