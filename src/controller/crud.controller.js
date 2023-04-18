import axios from "axios";

export const getData = async (table) => {
   try {
      //return await axios.get("http://localhost:3001/languages");
      let response = await axios.get(`http://localhost:3001/${table}`)
         .then(async function(res) {
            return res;
         })
         .catch(function(error) {
            console.log(error);
         });

      return response;
   } catch (error) {
      console.error(error);
   }
};

export const addData = async (table, code, body) => {
   try {
      let response = null;
      if (code > 0)
         response = await axios.patch(`http://localhost:3001/${table}/${code}`, body);
      else
         response = await axios.post(`http://localhost:3001/${table}/`, body);

      return response;
   } catch (error) {
      console.error(error);
   }
};

export const deleteData = async (table, code) => {
   try {
      return await axios.delete(`http://localhost:3001/${table}/${code}`);
   } catch (error) {
      console.error(error);
   }
};