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

export default function fileState() {
   const [fileStates, setFileStates] = useState([]);
   const [fileState, setFileState] = useState({code: 0, name: ''});
   const [fileStateDTO, setFileStateDTO] = useState({name: ''});
   const [open, setOpen] = React.useState(false);
   const [deleteModal, setDeleteModal] = React.useState({state: false, body: {code: 0, name: ''}});

   const columns = [
      {name: "CODIGO", align: "inherit"},
      {name: "NOMBRE", align: "inherit"}
   ];

   const openNew = () => {
      setFileState({...fileState, code: 0, name: ''});
      setOpen(true);
   };

   const openEdit = (row) => {
      setOpen(true);
      setFileState({...fileState, code: row.code, name: row.name});
   };

   const openDelete = (row) => {
      setDeleteModal({state: true, body: {code: row.code, name: row.name}})
   };

   const save = () => {
      setOpen(false);
      
      addData('file_state', fileState.code, fileStateDTO).then(res => {
         renderFileStates();
      })
      .catch(error => {console.log(error)});
   };

   const drop = (code) => {
      deleteData('file_state', code).then(res => {
         setDeleteModal({...deleteModal, state: false})
         renderFileStates();
      })
      .catch(error => {console.log(error)});
   };

   const renderFileStates = async () => {
      let response = await getData('file_state');
      setFileStates(response.data)
   };

   useEffect(() => {
      renderFileStates();
   }, []);

   return (
      <Layout title="Estados de file">
         <MyTable columns={columns} rows={fileStates} openNew={openNew} openEdit={openEdit} openDelete={openDelete}/>

         <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{fileState.code > 0 ? 'EDITAR' : 'NUEVO'} ESTADO</DialogTitle>
            <DialogContent>
               <Grid spacing={1} sx={{pt: 1}} container>
                  <Grid item xs={12}>
                     <TextField 
                        id="name" 
                        label="Nombre" 
                        variant="outlined" 
                        onChange={(e) => {
                           setFileState({...fileState, name: e.target.value})
                           setFileStateDTO({...fileStateDTO, name: e.target.value})
                        }}
                        value={fileState.name || ''}
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
