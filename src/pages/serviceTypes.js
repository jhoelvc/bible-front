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

export default function serviceTypes() {
   const [serviceTypes, setServiceTypes] = useState([]);
   const [serviceType, setServiceType] = useState({code: 0, name: ''});
   const [serviceTypeDTO, setServiceTypeDTO] = useState({name: ''});
   const [open, setOpen] = React.useState(false);
   const [deleteModal, setDeleteModal] = React.useState({state: false, body: {code: 0, name: ''}});

   const columns = [
      {name: "CODIGO", align: "inherit"},
      {name: "NOMBRE", align: "inherit"}
   ];

   const openNew = () => {
      setServiceType({...serviceType, code: 0, name: ''});
      setOpen(true);
   };

   const openEdit = (row) => {
      setOpen(true);
      setServiceType({...serviceType, code: row.code, name: row.name});
   };

   const openDelete = (row) => {
      setDeleteModal({state: true, body: {code: row.code, name: row.name}})
   };

   const save = () => {
      setOpen(false);
      
      addData('service_type', serviceType.code, serviceTypeDTO).then(res => {
         renderServiceTypes();
      })
      .catch(error => {console.log(error)});
   };

   const drop = (code) => {
      deleteData('service_type', code).then(res => {
         setDeleteModal({...deleteModal, state: false})
         renderServiceTypes();
      })
      .catch(error => {console.log(error)});
   };

   const renderServiceTypes = async () => {
      let response = await getData('service_type');
      setServiceTypes(response.data)
   };

   useEffect(() => {
      renderServiceTypes();
   }, []);

   return (
      <Layout title="Tipos de servicio">
         <MyTable columns={columns} rows={serviceTypes} openNew={openNew} openEdit={openEdit} openDelete={openDelete}/>

         <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{serviceType.code > 0 ? 'EDITAR' : 'NUEVO'} IDIOMA</DialogTitle>
            <DialogContent>
               <Grid spacing={1} sx={{pt: 1}} container>
                  <Grid item xs={12}>
                     <TextField 
                        id="name" 
                        label="Nombre" 
                        variant="outlined" 
                        onChange={(e) => {
                           setServiceType({...serviceType, name: e.target.value})
                           setServiceTypeDTO({...serviceTypeDTO, name: e.target.value})
                        }}
                        value={serviceType.name || ''}
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
