import axios from "axios";

export const getLanguages = async () => {
   try {
      return await axios.get("http://localhost:3001/languages");
   } catch (error) {
      console.error(error);
   }
};

export const addLanguage = async (language) => {
   try {
      let res = null;
      if (language.code > 0)
         res = await axios.patch(`http://localhost:3001/languages/${language.code}`, {name: language.name});
      else
         res = await axios.post(`http://localhost:3001/languages/`, {name: language.name});

      return res;
   } catch (error) {
      console.error(error);
   }
};

export const deleteLanguage = async (code) => {
   try {
      return await axios.delete(`http://localhost:3001/languages/${code}`);
   } catch (error) {
      console.error(error);
   }
};