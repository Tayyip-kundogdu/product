/*
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  getAllProducts
} from "../lib/api";

export const useProducts = () => {
  const result = useQuery({ queryKey: ["products"], queryFn: getAllProducts });
  return result;
};

export const useCreateProduct = () => {
  return useMutation({ mutationFn: createProduct });
};*/
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getMyProducts,
  getProductById,
  updateProduct,
} from "../lib/api";

export const useProducts = () => {
  const result = useQuery({ queryKey: ["products"], queryFn: getAllProducts });
  return result;
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient(); // 2. QueryClient çağrıldı

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // 3. Ürün başarıyla eklendiğinde "products" önbelleğini geçersiz kıl
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
  mutationFn: deleteProduct,
  onSuccess: (_, id) => {
    queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["product", id] });
  },
});
};

export const useMyProducts = () => {
  return useQuery({ queryKey: ["myProducts"], queryFn: getMyProducts });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
};
