'use client';

import Layout from "@/components/Layout";
import { categories } from "@/lib/data/mock-data";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const CategoriesPage = () => {
  return (
    <Layout>
      <div className="container py-10">
        <h1 className="font-display text-3xl font-bold">Job Categories</h1>
        <p className="mt-2 text-muted-foreground">Browse jobs by category</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.name} href={`/category/${category.name.toLowerCase()}`}>
              <Card className="h-full p-6 cursor-pointer transition-all hover:shadow-lg hover:border-primary">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h2 className="font-display text-lg font-semibold">{category.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{category.count} open positions</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesPage;
