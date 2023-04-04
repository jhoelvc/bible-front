import React from 'react'
import { getLanguages, addLanguage, deleteLanguage } from '../controller/languages.controller';
import { useEffect, useState } from "react";
import { Layout } from '@/components/Layout'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import DeleteModal from '../components/DeleteModal.js';

export default function languages() {
   const [languages, setLanguages] = useState([]);
   const [language, setLanguage] = useState({code: 0, name: ''});
   const [open, setOpen] = React.useState(false);
   const [deleteModal, setDeleteModal] = React.useState({state: false, body: {code: 0, name: ''}});

   const openNew = () => {
      setLanguage({...language, code: 0, name: ''});b
      setOpen(true);
   };

   const openEdit = (row) => {
      setOpen(true);
      setLanguage({...language, code: row.code, name: row.name});
   };

   const save = () => {
      setOpen(false);
      
      addLanguage(language).then(res => {
         render();
      })
      .catch(error => {console.log(error)});
   };

   const drop = (code) => {
      deleteLanguage(code).then(res => {
         setDeleteModal({...deleteModal, state: false})
         render();
      })
      .catch(error => {console.log(error)});
   };

   const render = () => {
      getLanguages().then(res => {
         setLanguages(res.data)
      })
      .catch(error => {console.log(error)});
   };

   useEffect(() => {
      render();
   }, []);

   return (
      <Layout title="Idiomas">
         <TableContainer component={Paper} sx={{ width: '60%', margin: 'auto' }} >
            <Table aria-label="simple table">
               <TableHead>
                  <TableRow>
                     <TableCell>CODIGO</TableCell>
                     <TableCell>NOMBRE</TableCell>
                     <TableCell align="right">
                        <IconButton aria-label="add" color="primary" onClick={openNew}>
                           <AddIcon />
                        </IconButton>
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {languages.map((row) => (
                     <TableRow
                        key={row.code}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                     >
                        <TableCell component="th" scope="row" align="center" style={{width: '100px'}}>{row.code}</TableCell>
                        <TableCell component="th" scope="row">{row.name}</TableCell>
                        <TableCell component="th" scope="row" align="right">
                           <IconButton aria-label="edit" color="primary" onClick={() => openEdit(row)}>
                              <EditIcon />
                           </IconButton>
                           <IconButton aria-label="delete" color="error" onClick={() => setDeleteModal({state: true, body: {code: row.code ,name: row.name}})}>
                              <DeleteIcon />
                           </IconButton>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>

         <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>NUEVO IDIOMA</DialogTitle>
            <DialogContent>
               <Grid spacing={1} sx={{pt: 1}} container>
                  <Grid item xs>
                     <TextField 
                        id="name" 
                        label="Nombre" 
                        variant="outlined" 
                        onChange={(e) => {setLanguage({...language, name: e.target.value})}}
                        value={language.name || ''}
                        fullWidth
                     />
                  </Grid>
               </Grid>
            </DialogContent>
            <DialogActions>
               <Button onClick={save} variant="contained" color="success">Guardar</Button>
               <Button onClick={() => setOpen(false)} variant="contained" color="error">Cancelar</Button>
            </DialogActions>
         </Dialog>

         <DeleteModal 
            open={deleteModal.state} 
            close={() => setDeleteModal({...deleteModal, state: false})} 
            body={deleteModal.body} 
            handleDelete={drop}
         />
      </Layout>
   )
}
