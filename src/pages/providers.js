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
import MenuItem from '@mui/material/MenuItem';
import DeleteModal from '../components/DeleteModal.js';
import MyTable from '../components/MyTable.js';

export default function providers() {
  const [providers, setProviders] = useState([]);
  const [identityDocumentTypes, setIdentityDocumentTypes] = useState([]);
  const [provider, setProvider] = useState({ code: 0, id_number: '', identity_document_type_code: 1, name: '' });
  const [providerDTO, setProviderDTO] = useState({ id_number: '', identity_document_type_code: 1, name: '' });
  const [open, setOpen] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState({ state: false, body: { code: 0, name: '' } });

  const columns = [
    { name: "CODIGO", align: "inherit" },
    { name: "NOMBRE", align: "inherit" },
    { name: "TIPO", align: "inherit" },
    { name: "NUMERO", align: "inherit" }
  ];

  const openNew = () => {
    setProvider({ ...provider, code: 0, id_number: '', identity_document_type_code: 1, name: '' });
    setOpen(true);
  };

  const openEdit = (row) => {
    setOpen(true);
    setProvider({ ...provider, code: row.code, identity_document_type_code: row.identity_document_type_code, id_number: row.id_number, name: row.name });
  };

  const openDelete = (row) => {
    setDeleteModal({ state: true, body: { code: row.code, name: row.name } })
  };

  const save = () => {
    setOpen(false);

    addData('provider', provider.code, providerDTO).then(res => {
      renderProviders();
    })
      .catch(error => { console.log(error) });
  };

  const drop = (code) => {
    deleteData('provider', code).then(res => {
      setDeleteModal({ ...deleteModal, state: false })
      renderProviders();
    })
      .catch(error => { console.log(error) });
  };

  const renderProviders = async () => {
    let response = await getData('provider');
    setProviders(response.data)
  };

  const getIdentityDocumentTypes = async () => {
    let response = await getData('identity_document_type')
    setIdentityDocumentTypes(response.data);
  };

  useEffect(() => {
    renderProviders();
    getIdentityDocumentTypes();
  }, []);

  return (
    <Layout title="Proveedores">
      <MyTable columns={columns} rows={providers} openNew={openNew} openEdit={openEdit} openDelete={openDelete} />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{provider.code > 0 ? 'EDITAR' : 'NUEVO'} PROVEEDOR</DialogTitle>
        <DialogContent>
          <Grid spacing={1} sx={{ pt: 1 }} container>
            <Grid item xs={12}>
              <TextField
                label="Tipo de documento"
                variant="outlined"
                onChange={(e) => {
                  setProvider({ ...provider, identity_document_type_code: e.target.value })
                  setProviderDTO({ ...providerDTO, identity_document_type_code: e.target.value })
                }}
                value={provider.identity_document_type_code}
                fullWidth
                select
              >
                {identityDocumentTypes.map((item) => {
                  return (
                    <MenuItem key={item.code} value={item.code}>{item.name}</MenuItem>
                  )
                })}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Numero"
                variant="outlined"
                onChange={(e) => {
                  setProvider({ ...provider, id_number: e.target.value })
                  setProviderDTO({ ...providerDTO, id_number: e.target.value })
                }}
                value={provider.id_number || ''}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                variant="outlined"
                onChange={(e) => {
                  setProvider({ ...provider, name: e.target.value })
                  setProviderDTO({ ...providerDTO, name: e.target.value })
                }}
                value={provider.name || ''}
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
        close={() => setDeleteModal({ ...deleteModal, state: false })}
        body={deleteModal.body}
        handleDelete={drop}
      />
    </Layout>
  )
}
