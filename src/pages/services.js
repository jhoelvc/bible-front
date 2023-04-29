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

export default function services() {
   const [services, setServices] = useState([]);
   const [service, setService] = useState({code: 0, name: '', price: 0});
   const [serviceDTO, setServiceDTO] = useState({name: '', price: 0});
   const [open, setOpen] = React.useState(false);
   const [deleteModal, setDeleteModal] = React.useState({state: false, body: {code: 0, name: ''}});

   const columns = [
      {name: "CODIGO", align: "inherit"},
      {name: "NOMBRE", align: "inherit"},
      {name: "TIPO", align: "inherit"}
   ];

   const openNew = () => {
      setService({...service, code: 0, name: '', price: 0});
      setOpen(true);
   };

   const openEdit = (row) => {
      setOpen(true);
      setService({...service, code: row.code, name: row.name, price: row.price});
   };

   const openDelete = (row) => {
      setDeleteModal({state: true, body: {code: row.code, name: row.name}})
   };

   const save = () => {
      setOpen(false);
      
      addData('service', service.code, serviceDTO).then(res => {
        renderServices();
      })
      .catch(error => {console.log(error)});
   };

   const drop = (code) => {
      deleteData('service', code).then(res => {
         setDeleteModal({...deleteModal, state: false})
         renderServices();
      })
      .catch(error => {console.log(error)});
   };

   const renderServices = async () => {
      let response = await getData('service');
      debugger
      setServices(response.data)
   };

   useEffect(() => {
    renderServices();
   }, []);

   return (
      <Layout title="Servicios">
         <MyTable columns={columns} rows={services} openNew={openNew} openEdit={openEdit} openDelete={openDelete}/>

         <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{service.code > 0 ? 'EDITAR' : 'NUEVO'} SERVICIO</DialogTitle>
            <DialogContent>
               <Grid spacing={1} sx={{pt: 1}} container>
                  <Grid item xs={12}>
                     <TextField 
                        id="name" 
                        label="Nombre" 
                        variant="outlined" 
                        onChange={(e) => {
                           setService({...service, name: e.target.value})
                           setServiceDTO({...serviceDTO, name: e.target.value})
                        }}
                        value={service.name || ''}
                        fullWidth
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField 
                        id="price" 
                        label="Precio" 
                        variant="outlined" 
                        onChange={(e) => {
                           setService({...service, price: e.target.value})
                           setServiceDTO({...serviceDTO, price: e.target.value})
                        }}
                        value={service.price || ''}
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
