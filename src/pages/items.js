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

export default function items() {
   const [items, setItems] = useState([]);
   const [item, setItem] = useState({code: 0, name: '', price: 0});
   const [itemDTO, setItemDTO] = useState({name: '', price: 0});
   const [open, setOpen] = React.useState(false);
   const [deleteModal, setDeleteModal] = React.useState({state: false, body: {code: 0, name: ''}});

   const columns = [
      {name: "CODIGO", align: "inherit"},
      {name: "NOMBRE", align: "inherit"},
      {name: "PRECIO", align: "inherit"}
   ];

   const openNew = () => {
      setItem({...item, code: 0, name: '', price: 0});
      setOpen(true);
   };

   const openEdit = (row) => {
      setOpen(true);
      setItem({...item, code: row.code, name: row.name, price: row.price});
   };

   const openDelete = (row) => {
      setDeleteModal({state: true, body: {code: row.code, name: row.name}})
   };

   const save = () => {
      setOpen(false);
      
      addData('items', item.code, itemDTO).then(res => {
         renderItems();
      })
      .catch(error => {console.log(error)});
   };

   const drop = (code) => {
      deleteData('items', code).then(res => {
         setDeleteModal({...deleteModal, state: false})
         renderItems();
      })
      .catch(error => {console.log(error)});
   };

   const renderItems = async () => {
      let response = await getData('items');
      setItems(response.data)
   };

   useEffect(() => {
      renderItems();
   }, []);

   return (
      <Layout title="Items">
         <MyTable columns={columns} rows={items} openNew={openNew} openEdit={openEdit} openDelete={openDelete}/>

         <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{item.code > 0 ? 'EDITAR' : 'NUEVO'} IDIOMA</DialogTitle>
            <DialogContent>
               <Grid spacing={1} sx={{pt: 1}} container>
                  <Grid item xs={12}>
                     <TextField 
                        id="name" 
                        label="Nombre" 
                        variant="outlined" 
                        onChange={(e) => {
                           setItem({...item, name: e.target.value})
                           setItemDTO({...item, name: e.target.value})
                        }}
                        value={item.name || ''}
                        fullWidth
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField 
                        id="price" 
                        label="Precio" 
                        variant="outlined" 
                        onChange={(e) => {
                           setItem({...item, price: e.target.value})
                           setItemDTO({...item, price: e.target.value})
                        }}
                        value={item.price || ''}
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
