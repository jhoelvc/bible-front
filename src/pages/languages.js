import React from 'react'
import { getData, addData, deleteData } from '../controller/crud.controller';
import { useEffect, useState } from "react";
import { Layout } from '@/components/Layout'
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import DeleteModal from '../components/DeleteModal.js';
import MyTable from '../components/MyTable.js';

export default function languages() {
   const [languages, setLanguages] = useState([]);
   const [language, setLanguage] = useState({code: 0, name: ''});
   const [languageDTO, setLanguageDTO] = useState({name: ''});
   const [open, setOpen] = React.useState(false);
   const [deleteModal, setDeleteModal] = React.useState({state: false, body: {code: 0, name: ''}});

   const columns = [
      {name: "CODIGO", align: "inherit"},
      {name: "NOMBRE", align: "inherit"}
   ];

   const openNew = () => {
      setLanguage({...language, code: 0, name: ''});
      setOpen(true);
   };

   const openEdit = (row) => {
      setOpen(true);
      setLanguage({...language, code: row.code, name: row.name});
   };

   const openDelete = (row) => {
      setDeleteModal({state: true, body: {code: row.code, name: row.name}})
   };

   const save = () => {
      setOpen(false);
      
      addData('languages', language.code, languageDTO).then(res => {
         renderLanguages();
      })
      .catch(error => {console.log(error)});
   };

   const drop = (code) => {
      deleteData('languages', code).then(res => {
         setDeleteModal({...deleteModal, state: false})
         renderLanguages();
      })
      .catch(error => {console.log(error)});
   };

   const renderLanguages = async () => {
      let response = await getData('languages');
      setLanguages(response.data)
   };

   useEffect(() => {
      renderLanguages();
   }, []);

   return (
      <Layout title="Idiomas">
         <MyTable columns={columns} rows={languages} openNew={openNew} openEdit={openEdit} openDelete={openDelete}/>

         <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{language.code > 0 ? 'EDITAR' : 'NUEVO'} IDIOMA</DialogTitle>
            <DialogContent>
               <Grid spacing={1} sx={{pt: 1}} container>
                  <Grid item xs>
                     <TextField 
                        id="name" 
                        label="Nombre" 
                        variant="outlined" 
                        onChange={(e) => {
                           setLanguage({...language, name: e.target.value})
                           setLanguageDTO({...languageDTO, name: e.target.value})
                        }}
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
