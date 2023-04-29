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

export default function identityDocumentType() {
   const [IdentityDocumentTypes, setIdentityDocumentTypes] = useState([]);
   const [IdentityDocumentType, setIdentityDocumentType] = useState({code: 0, name: ''});
   const [IdentityDocumentTypeDTO, setIdentityDocumentTypeDTO] = useState({name: ''});
   const [open, setOpen] = React.useState(false);
   const [deleteModal, setDeleteModal] = React.useState({state: false, body: {code: 0, name: ''}});

   const columns = [
      {name: "CODIGO", align: "inherit"},
      {name: "NOMBRE", align: "inherit"}
   ];

   const openNew = () => {
      setIdentityDocumentType({...IdentityDocumentType, code: 0, name: ''});
      setOpen(true);
   };

   const openEdit = (row) => {
      setOpen(true);
      setIdentityDocumentType({...IdentityDocumentType, code: row.code, name: row.name});
   };

   const openDelete = (row) => {
      setDeleteModal({state: true, body: {code: row.code, name: row.name}})
   };

   const save = () => {
      setOpen(false);
      
      addData('identity_document_type', IdentityDocumentType.code, IdentityDocumentTypeDTO).then(res => {
         renderIdentityDocumentType();
      })
      .catch(error => {console.log(error)});
   };

   const drop = (code) => {
      deleteData('identity_document_type', code).then(res => {
         setDeleteModal({...deleteModal, state: false})
         renderIdentityDocumentType();
      })
      .catch(error => {console.log(error)});
   };

   const renderIdentityDocumentType = async () => {
      let response = await getData('identity_document_type');
      setIdentityDocumentTypes(response.data)
   };

   useEffect(() => {
      renderIdentityDocumentType();
   }, []);

   return (
      <Layout title="Estados de file">
         <MyTable columns={columns} rows={IdentityDocumentTypes} openNew={openNew} openEdit={openEdit} openDelete={openDelete}/>

         <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{IdentityDocumentType.code > 0 ? 'EDITAR' : 'NUEVO'} ESTADO</DialogTitle>
            <DialogContent>
               <Grid spacing={1} sx={{pt: 1}} container>
                  <Grid item xs={12}>
                     <TextField 
                        id="name" 
                        label="Nombre" 
                        variant="outlined" 
                        onChange={(e) => {
                           setIdentityDocumentType({...IdentityDocumentType, name: e.target.value})
                           setIdentityDocumentTypeDTO({...IdentityDocumentTypeDTO, name: e.target.value})
                        }}
                        value={IdentityDocumentType.name || ''}
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
