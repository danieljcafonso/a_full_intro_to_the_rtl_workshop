import { useQuery } from "@tanstack/react-query";
import { carKeys } from "../utils/queryKeyFactories";
import { getCarsByUsername } from "../api/carsAPI";

const fetchData = async ({ queryKey }) => {
  const { username } = queryKey[0];
  return await getCarsByUsername(username);
};

export const useGetCarsByUser = () => {
  const username = "daniel"; // TODO: get logged user
  return useQuery({
    queryKey: carKeys.withUsername(username),
    queryFn: fetchData,
  });
};

export default useGetCarsByUser;
