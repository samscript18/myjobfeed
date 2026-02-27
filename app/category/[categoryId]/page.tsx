import CategoryPage from "@/components/ui/pages/CategoryPage";

export interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

const Category = async ({ params }: CategoryPageProps) => {
  const { categoryId } = await params;
  return <CategoryPage categoryId={categoryId} />;
}
export default Category;
