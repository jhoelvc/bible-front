import * as React from 'react';
import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function MyTable({columns, rows, openNew, openEdit, openDelete}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <StyledTableCell key={column.name} align={column.align}>{column.name}</StyledTableCell>
            ))}
            <StyledTableCell component="th" scope="row" align="right">
              <IconButton aria-label="add" color="primary" onClick={openNew}>
                  <AddIcon />
               </IconButton>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              {Object.values(row).map(val => 
                <StyledTableCell key={val} align="left">{val}</StyledTableCell>
              )}
              <StyledTableCell align="right">
                <IconButton aria-label="edit" color="primary" onClick={() => openEdit(row)}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" color="error" onClick={() => openDelete(row)}>
                  <DeleteIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}