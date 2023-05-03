import { useMutation } from "@tanstack/react-query";
import { addCarByUsername } from "../api/carsAPI";

const addData = async (username, car) => {
  return await addCarByUsername(username, car);
};

export const useAddCarByUser = ({ onSuccess, onError }) => {
  const username = "daniel"; // TODO: get logged user
  return useMutation({
    mutationFn: (car) => addData(username, car),
    onError,
    onSuccess,
  });
};

export default useAddCarByUser;
