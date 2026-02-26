import CategoryPage from "@/components/ui/pages/CategoryPage";

interface CategoryPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

const Category = async ({ params }: CategoryPageProps) => {
  const { categorySlug } = await params;
  return <CategoryPage categorySlug={categorySlug} />;
}
export default Category;
