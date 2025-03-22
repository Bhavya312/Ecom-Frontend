import { toast } from 'react-toastify';

/**
 * Gloabal API Response Handler
 * 
 * @param {Object} response - API Response Object
 * @param {Function} dispatch - Redux Dispath Function
 * @param {Function} successAction - Optional Redux Success Action
 * 
 */

export const handleApiResponse = (response, dispatch, successAction = null) => {
  if(!response){
    toast.error("Something went wrong!");
    return;
  }

  const { status, data, msg } = response;

  if( status >= 200 && status < 300){
    toast.success(msg || "Request sucessfull!");

    if(successAction){
      dispatch(successAction(data));
    }
  }else{
    toast.error(msg || "Something went wrong!"); 
  }
};