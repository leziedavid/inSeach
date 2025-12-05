"use client";

import { useState, useMemo } from 'react';
import { categories, products, getBestSellers } from '@/data/products';
import BestSellers from './BestSellers';
import ProductList from './ProductList';

const Sellers = () => {

    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'newest'>('newest');
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrer les produits
    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Filtre par recherche
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filtre par catégorie
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => product.category.name === selectedCategory);
        }

        // Filtre par sous-catégorie
        if (selectedSubCategory !== 'all') {
            filtered = filtered.filter(product => product.subCategory.name === selectedSubCategory);
        }

        // Filtre par prix
        filtered = filtered.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Tri
        filtered = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'price':
                    return a.price - b.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default:
                    return 0;
            }
        });

        return filtered;
    }, [selectedCategory, selectedSubCategory, priceRange, sortBy, searchTerm]);

    // Best sellers
    const bestSellers = getBestSellers();

    // Sous-catégories disponibles pour la catégorie sélectionnée
    const availableSubCategories = useMemo(() => {
        if (selectedCategory === 'all') return [];
        const category = categories.find(cat => cat.name === selectedCategory);
        return category?.subCategories || [];
    }, [selectedCategory]);

    // Réinitialiser les filtres
    const resetFilters = () => {
        setSelectedCategory('all');
        setSelectedSubCategory('all');
        setPriceRange([0, 500000]);
        setSortBy('newest');
        setSearchTerm('');
    };

    // Formater le prix
    const formatPrice = (price: number) => {  return price.toLocaleString() + ' ₣'; };

    return (
        <div className="min-h-screen bg-white py-4 px-3">
            <div className="max-w-md mx-auto">

                {/* En-tête avec recherche */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-md font-bold text-gray-900">Boutique</h1>
                    </div>

                    {/* Best-sellers avec pagination */}
                    <BestSellers products={bestSellers} />

                </div>

                {/* Catégories rapides en bas */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Parcourir par catégorie</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {categories.slice(0, 6).map(category => (
                            <button  key={category.id} onClick={() => setSelectedCategory(category.name)}  className={`p-2 rounded-lg text-center transition-colors ${selectedCategory === category.name ? 'bg-[#b07b5e] text-white'  : 'bg-gray-100 text-gray-700 hover:bg-gray-200' }`} >
                                <div className="text-lg mb-1">
                                    {category.name.includes("Électronique") && "📱"}
                                    {category.name.includes("Mode") && "👗"}
                                    {category.name.includes("Maison") && "🏠"}
                                    {category.name.includes("Beauté") && "💄"}
                                    {category.name.includes("Sports") && "⚽"}
                                </div>
                                <span className="text-xs font-medium">{category.name.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                </div>


                {/* Filtres rapides */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-sm font-semibold text-gray-700">Filtres</h2>
                        <button onClick={resetFilters} className="text-xs text-[#b07b5e] hover:text-[#155e75]"  >
                            Réinitialiser
                        </button>
                    </div>

                    {/* Catégories */}
                    <div className="mb-3">
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setSelectedSubCategory('all');
                            }}
                            className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#b07b5e]"
                        >
                            <option value="all">Toutes les catégories</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sous-catégories */}
                    {availableSubCategories.length > 0 && (
                        <div className="mb-3">
                            <select
                                value={selectedSubCategory}
                                onChange={(e) => setSelectedSubCategory(e.target.value)}
                                className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#b07b5e]"
                            >
                                <option value="all">Toutes les sous-catégories</option>
                                {availableSubCategories.map(subCategory => (
                                    <option key={subCategory.id} value={subCategory.name}>
                                        {subCategory.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Prix */}
                    <div className="mb-3">
                        <label className="block text-xs text-gray-600 mb-2">
                            Prix: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="range"
                                min="0"
                                max="500000"
                                step="1000"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                className="flex-1"
                            />
                            <input
                                type="range"
                                min="0"
                                max="500000"
                                step="1000"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    {/* Tri */}
                    <div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#b07b5e]"
                        >
                            <option value="newest">Nouveautés</option>
                            <option value="price">Prix croissant</option>
                            <option value="rating">Meilleures notes</option>
                            <option value="name">Ordre alphabétique</option>
                        </select>
                    </div>
                </div>


                                    {/* Barre de recherche */}
                    <div className="relative mb-6">
                        <input  type="text"  placeholder="Rechercher un produit..." value={searchTerm}  onChange={(e) => setSearchTerm(e.target.value)}  className="p-2 w-full text-sm rounded-lg border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#155e7533] pl-9"  style={{ fontSize: "16px" }} />
                        <div className="absolute left-3 top-3 text-gray-400">   🔍 </div>
                        {searchTerm && (
                            <button   onClick={() => setSearchTerm('')}  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"  >
                                ✕
                            </button>
                        )}
                    </div>

                {/* Liste des produits avec pagination */}
                <ProductList  products={filteredProducts} searchTerm={searchTerm} onResetFilters={resetFilters}  />

            </div>
        </div>
    );
};

export default Sellers;