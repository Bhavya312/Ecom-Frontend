import { useParams } from "react-router-dom";
import Banner from "../components/Banner";
import SubCategories from "../components/SubCategories";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api, get } from "../components/config/config";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { setCategories } from "../redux/api/categorySlice";
import Products from "../components/Products";
import { setProducts } from "../redux/api/productSlice";

const Category = () => {
  const { id } = useParams();
  const { loading } = useSelector((state) => state.loading);

  const dispatch = useDispatch();
  const [category, setCategory] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
          const response = await get(api.CATEGORIES + `/` + id);
          setCategory(response.data.data);
          const categoriesData = await get(api.CATEGORIES, {
            params: { limit: 10, page: 1, ...(id && { parent_id: id }) },
          });
          dispatch(setCategories(categoriesData.data.data));

          const productsData = await get(api.PRODUCTS, {
            params: {limit: 10, page: 1},
          });
          dispatch(setProducts(productsData.data.data));
      } catch (err) {
        toast.error(err?.data?.msg || err.error || "Something went wrong");
      }
    };
    fetchData();
  }, [dispatch, id]);

  const { categories } = useSelector((state) => state.categories);

  if (loading) return <Loader />;
  return (
    <>
      <Banner name={category.name} catImage={category?.image} />
      <SubCategories parentCat={category} categories={categories} />
      <Products />
    </>
  );
};

export default Category;
