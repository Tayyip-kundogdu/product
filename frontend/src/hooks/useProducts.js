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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // 1. useQueryClient eklendi
import { getAllProducts, createProduct } from "../lib/api";

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
