import { getCategoriesData } from "./action";
import { CategoriesClient } from "./CategoriesClient";

export default async function CategoriesPage() {
  const { categories } = await getCategoriesData();

  return <CategoriesClient initialCategories={categories} />;
}
